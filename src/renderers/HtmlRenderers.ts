import { Portfolio, Sections } from "../domain/Portfolio.js";


export class HtmlRenderer {

    render(portfolio: Portfolio): string {
        const sectionsHtml = portfolio.sections.map(section => this.takeSection(section)).join("\n");

        return (`
            <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>${portfolio.name}</title>
                    <link rel="stylesheet" href="./styles.css" />
                </head>
                <body>
                    ${sectionsHtml}
                </body>
            </html>
        `).trim();
    }

    sectionHero(section: Sections): string {
        
        return (`
            <section label="${section.type}" class="hero">
                Teste
            </section>    
        `).trim();
    }

    takeSection(section: Sections): string {
        switch (section.type) {
            case "hero":
                return this.sectionHero(section);
            default:
                return "";
        }
    }
}