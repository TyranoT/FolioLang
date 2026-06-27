import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { buildPortfolio } from "../buildPortfolio.js";

/** Script injetado no index.html servido: recarrega a aba quando o servidor avisa. */
const LIVE_RELOAD_CLIENT = `
<script>
  (function () {
    const source = new EventSource("/__livereload");
    source.onmessage = function () { location.reload(); };
    source.onerror = function () { /* reconecta sozinho */ };
  })();
</script>`;

const CONTENT_TYPES: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".json": "application/json; charset=utf-8",
};

export interface DevServerOptions {
    file: string;
    outDir: string;
    port: number;
}

/**
 * Servidor de desenvolvimento com live reload, usando apenas built-ins do Node:
 * `http` serve a pasta de saída, `fs.watch` observa o `.folio` + `assets/`, e
 * Server-Sent Events avisam o navegador para recarregar a cada recompilação.
 */
export class DevServer {
    private readonly clients = new Set<http.ServerResponse>();
    private debounce: NodeJS.Timeout | null = null;

    constructor(private readonly options: DevServerOptions) { }

    start(): void {
        this.safeBuild();

        const server = http.createServer((req, res) => this.handleRequest(req, res));

        server.on("error", (err: NodeJS.ErrnoException) => {
            if (err.code === "EADDRINUSE") {
                console.warn(`Porta ${this.options.port} ocupada, tentando ${this.options.port + 1}...`);
                this.options.port += 1;
                server.listen(this.options.port);
                return;
            }
            throw err;
        });

        server.listen(this.options.port, () => {
            const url = `http://localhost:${this.options.port}`;
            console.log(`\n  ➜ Local:   ${url}`);
            console.log(`  ➜ Observando ${this.options.file}\n`);
            this.openBrowser(url);
            this.watch();
        });
    }

    private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
        const url = (req.url ?? "/").split("?")[0];

        if (url === "/__livereload") {
            return this.handleLiveReload(res);
        }

        const relative = url === "/" ? "index.html" : decodeURIComponent(url.replace(/^\/+/, ""));
        const filePath = path.join(this.options.outDir, relative);

        // impede sair da pasta de saída (path traversal)
        if (!path.resolve(filePath).startsWith(path.resolve(this.options.outDir))) {
            res.writeHead(403).end("Forbidden");
            return;
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("404 Not Found");
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const type = CONTENT_TYPES[ext] ?? "application/octet-stream";

            if (ext === ".html") {
                const injected = content.toString().replace("</body>", `${LIVE_RELOAD_CLIENT}\n</body>`);
                res.writeHead(200, { "Content-Type": type }).end(injected);
                return;
            }

            res.writeHead(200, { "Content-Type": type }).end(content);
        });
    }

    private handleLiveReload(res: http.ServerResponse): void {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });
        res.write("retry: 1000\n\n");

        this.clients.add(res);
        res.on("close", () => this.clients.delete(res));
    }

    /** Observa o arquivo `.folio` e a pasta `assets/` ao lado dele. */
    private watch(): void {
        const fileDir = path.dirname(path.resolve(this.options.file));
        const fileName = path.basename(this.options.file);
        const assetsDir = path.join(fileDir, "assets");

        fs.watch(fileDir, (_event, changed) => {
            if (changed === fileName) this.scheduleRebuild();
        });

        if (fs.existsSync(assetsDir)) {
            fs.watch(assetsDir, () => this.scheduleRebuild());
        }
    }

    /** Coalesce os múltiplos eventos que o fs.watch dispara por save (sobretudo no Windows). */
    private scheduleRebuild(): void {
        if (this.debounce) clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
            const ok = this.safeBuild();
            if (ok) {
                console.log("  ✓ recompilado");
                this.notifyReload();
            }
        }, 100);
    }

    /** Compila capturando erros para não derrubar o servidor. Retorna true em sucesso. */
    private safeBuild(): boolean {
        try {
            buildPortfolio(this.options.file, this.options.outDir);
            return true;
        } catch (error) {
            console.error(`\n  ✗ Erro ao compilar: ${(error as Error).message}\n`);
            return false;
        }
    }

    private notifyReload(): void {
        for (const client of this.clients) {
            client.write("data: reload\n\n");
        }
    }

    private openBrowser(url: string): void {
        if (process.env.FOLIO_NO_OPEN) return;

        const command =
            process.platform === "win32" ? "cmd" :
                process.platform === "darwin" ? "open" :
                    "xdg-open";
        const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];

        // spawn emite 'error' de forma assíncrona; o handler evita derrubar o processo.
        const child = spawn(command, args, { stdio: "ignore", detached: true });
        child.on("error", () => { /* sem navegador disponível — a URL já foi impressa */ });
        child.unref();
    }
}
