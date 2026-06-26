import fs from "node:fs";
import path from "node:path";
import { Compiler } from "./compiler/Compiler.js";
import { FileWriter } from "./io/FileWriter.js";
import { HtmlRenderer } from "./renderers/HtmlRenderer.js";
import { CssRenderer } from "./renderers/CssRenderer.js";

const inputFile = process.argv[2];

if (!inputFile) {
    console.error("Uso: folio <arquivo.folio>");
    process.exit(1);
}

const filePath = path.resolve(process.cwd(), inputFile);
const source = fs.readFileSync(filePath, "utf-8");

const compiler = new Compiler();
const portfolio = compiler.compile(source);

const html = new HtmlRenderer(portfolio).render();
const css = new CssRenderer().render();

new FileWriter().write("dist", {
    "index.html": html,
    "styles.css": css,
});

console.log("Portfolio gerado em dist/index.html");