import { Portfolio } from "../domain/Portfolio.js";
import { Block } from "../domain/types.js";
import { dedent } from "../utils/dedent.js";
import { HtmlComponents } from "./HtmlComponents.js";
import { ParserHTML } from "./HtmlParser.js";

export class HtmlRenderer extends HtmlComponents {
    private readonly parserHTML = new ParserHTML();

    private name: string = "";
    private lang: string = "pt-BR";
    private metadatas: string = "";
    private sectionsHtml: string = "";

    constructor(portfolio: Portfolio) {
        super();
        this.name = portfolio.name;
        this.lang = portfolio.metadatas.lang || "pt-BR";
        this.metadatas = this.parserHTML.applyMetadatas(portfolio);
        this.sectionsHtml = this.parserHTML.getSectionsHtml(portfolio).map(section => this.takeSection(section)).join("\n");
    }

    render(): string {

        return dedent(`
            <!DOCTYPE html>
            <html lang="${this.lang}">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                ${this.metadatas}
                <title>${this.name}</title>
                <link rel="stylesheet" href="./styles.css" />
            </head>
            <body>
                ${this.sectionsHtml}
            </body>
            </html>
        `);
    }
}
