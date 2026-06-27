#!/usr/bin/env node
import { buildPortfolio } from "./buildPortfolio.js";
import { DevServer } from "./server/DevServer.js";

const USAGE = `
FolioLang — DSL para portfólios estáticos

Uso:
  folio build [arquivo.folio] [--out <dir>]      Compila para HTML + CSS (padrão: dist/)
  folio dev   [arquivo.folio] [--port <n>] [--out <dir>]
                                                 Servidor local com live reload

Argumentos:
  arquivo.folio   Caminho do .folio (padrão: portfolio.folio)

Opções:
  --out <dir>     Pasta de saída (padrão: dist)
  --port <n>      Porta do dev server (padrão: 5173)
  -h, --help      Mostra esta ajuda
`.trim();

interface Args {
    command: string;
    file: string;
    out: string;
    port: number;
}

function parseArgs(argv: string[]): Args {
    const command = argv[0] ?? "";
    let file = "";
    let out = "dist";
    let port = 5173;

    for (let i = 1; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === "--out") out = argv[++i];
        else if (arg === "--port") port = Number(argv[++i]);
        else if (!arg.startsWith("-")) file = arg;
    }

    return { command, file: file || "portfolio.folio", out, port };
}

function main(): void {
    const argv = process.argv.slice(2);

    if (argv.length === 0 || argv[0] === "-h" || argv[0] === "--help") {
        console.log(USAGE);
        return;
    }

    const args = parseArgs(argv);

    switch (args.command) {
        case "build":
            buildPortfolio(args.file, args.out);
            console.log(`Portfolio gerado em ${args.out}/index.html`);
            break;

        case "dev":
            new DevServer({ file: args.file, outDir: args.out, port: args.port }).start();
            break;

        default:
            console.error(`Comando desconhecido: "${args.command}"\n`);
            console.log(USAGE);
            process.exit(1);
    }
}

main();
