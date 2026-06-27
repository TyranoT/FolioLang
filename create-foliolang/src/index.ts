#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createInterface, Interface } from "node:readline";
import { stdin, stdout } from "node:process";

/** Paletas disponíveis — espelha ColorPalette.palettes do pacote `foliolang`. */
const PALETTES = ["Principal", "Aurora", "Slate", "Light"];

/**
 * Faz perguntas sequenciais de forma confiável tanto em terminal interativo
 * quanto com stdin redirecionado (pipe). Usa o evento `line` com uma fila — o
 * `readline/promises.question()` perde linhas ou trava no EOF de input piped.
 */
class Prompter {
    private readonly buffered: string[] = [];
    private readonly waiting: ((line: string) => void)[] = [];
    private closed = false;

    constructor(private readonly rl: Interface) {
        rl.on("line", (line) => {
            const resolve = this.waiting.shift();
            if (resolve) resolve(line);
            else this.buffered.push(line);
        });
        rl.on("close", () => {
            this.closed = true;
            for (const resolve of this.waiting.splice(0)) resolve("");
        });
    }

    ask(question: string): Promise<string> {
        stdout.write(question);
        const next = this.buffered.shift();
        if (next !== undefined) return Promise.resolve(next);
        if (this.closed) return Promise.resolve("");
        return new Promise((resolve) => this.waiting.push(resolve));
    }

    close(): void {
        this.rl.close();
    }
}

const TEMPLATE_DIR = path.resolve(fileURLToPath(import.meta.url), "../../template");

/** Converte um nome livre em um slug válido para pasta/pacote npm. */
function slugify(name: string): string {
    const diacritics = new RegExp("[\\u0300-\\u036f]", "g");  // marcas de acento combinantes
    return name
        .toLowerCase()
        .normalize("NFD").replace(diacritics, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "meu-portfolio";
}

/** Aplica os placeholders {{name}}, {{palette}} e {{name-slug}}. */
function fill(content: string, vars: Record<string, string>): string {
    return content.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

/** Copia a árvore do template aplicando substituições e renomeando _gitignore. */
function copyTemplate(src: string, dest: string, vars: Record<string, string>): void {
    fs.mkdirSync(dest, { recursive: true });

    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const from = path.join(src, entry.name);
        // npm publica `.gitignore` como `_gitignore`; restauramos o nome aqui.
        const name = entry.name === "_gitignore" ? ".gitignore" : entry.name;
        const to = path.join(dest, name);

        if (entry.isDirectory()) {
            copyTemplate(from, to, vars);
        } else if (/\.(folio|json|md|txt)$|gitignore$/.test(entry.name)) {
            fs.writeFileSync(to, fill(fs.readFileSync(from, "utf-8"), vars));
        } else {
            fs.copyFileSync(from, to);  // binários (imagens) sem alteração
        }
    }
}

function run(command: string, args: string[], cwd: string): boolean {
    // No Windows o `npm` é o script `npm.cmd`; chamar direto evita `shell: true` (e o aviso DEP0190).
    const bin = process.platform === "win32" && command === "npm" ? "npm.cmd" : command;
    const result = spawnSync(bin, args, { cwd, stdio: "inherit" });
    return result.status === 0;
}

async function main(): Promise<void> {
    const positional = process.argv.slice(2).find((arg) => !arg.startsWith("-"));
    const prompter = new Prompter(createInterface({ input: stdin, output: stdout }));

    console.log("\n  📄 create-foliolang\n");

    const nameAnswer = (await prompter.ask(`  Nome do portfólio: ${positional ? `(${positional}) ` : ""}`)).trim();
    const name = nameAnswer || positional || "Meu Portfólio";

    console.log(`\n  Paletas: ${PALETTES.map((p, i) => `${i + 1}) ${p}`).join("   ")}`);
    const paletteAnswer = (await prompter.ask("  Escolha a paleta (1): ")).trim();
    const paletteIndex = Number(paletteAnswer) - 1;
    const palette = PALETTES[paletteIndex] ?? PALETTES[0];

    prompter.close();

    const slug = positional ? slugify(positional) : slugify(name);
    const targetDir = path.resolve(process.cwd(), slug);

    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
        console.error(`\n  ✗ A pasta "${slug}" já existe e não está vazia. Abortando.\n`);
        process.exit(1);
    }

    copyTemplate(TEMPLATE_DIR, targetDir, { name, palette, "name-slug": slug });
    console.log(`\n  ✔ Criado em ./${slug}`);

    console.log("  ⏳ Instalando dependências...");
    const installed = run("npm", ["install"], targetDir);
    if (installed) console.log("  ✔ Dependências instaladas");

    if (run("git", ["init", "-q"], targetDir)) {
        console.log("  ✔ git inicializado");
    }

    console.log("\n  Pronto! Próximos passos:\n");
    console.log(`    cd ${slug}`);
    if (!installed) console.log("    npm install");
    console.log("    npm run dev\n");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
