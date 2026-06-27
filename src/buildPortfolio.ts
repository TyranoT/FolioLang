import fs from "node:fs";
import path from "node:path";
import { Compiler } from "./compiler/Compiler.js";
import { FileWriter } from "./io/FileWriter.js";
import { AssetManager } from "./io/AssetManager.js";
import { HtmlRenderer } from "./renderers/HtmlRenderer.js";
import { CssRenderer } from "./renderers/CssRenderer.js";

/**
 * Pipeline completo: lê um arquivo `.folio`, compila e grava o portfólio
 * (index.html + styles.css + assets) em `outDir`. Reutilizado pelos comandos
 * `build` e `dev` da CLI.
 */
export function buildPortfolio(inputFile: string, outDir = "dist"): void {
    const filePath = path.resolve(process.cwd(), inputFile);
    const source = fs.readFileSync(filePath, "utf-8");

    const portfolio = new Compiler().compile(source);

    const assets = new AssetManager(path.dirname(filePath));
    assets.process(portfolio);

    const html = new HtmlRenderer(portfolio).render();
    const css = new CssRenderer(portfolio).render();

    new FileWriter().write(outDir, {
        "index.html": html,
        "styles.css": css,
    });

    assets.copyTo(outDir);
}
