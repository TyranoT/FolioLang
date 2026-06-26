import { Portfolio } from "../domain/Portfolio.js";
import { dedent } from "../utils/dedent.js";
import { CssComponents } from "./CssComponents.js";
import { ColorPalette } from "./colors/ColorPalette.js";
import { FontsGoogle } from "./fonts/FontsGoogle.js";

export class CssRenderer extends CssComponents {

    private fontsGoogleImports: FontsGoogle
    private colorPalette: ColorPalette
    private design: Portfolio["design"]

    constructor(portfolio: Portfolio) {
        super();

        this.fontsGoogleImports = new FontsGoogle();
        this.colorPalette = new ColorPalette();
        this.design = portfolio.design;
    }

    render(): string {
        const variaveisColors = this.colorPalette.getVariaveisColors(
            this.design.palette,
            this.design.colors
        );

        return dedent(`
            ${this.fontsGoogleImports.getImportsFonts().join("\n            ")}

            :root {
                ${variaveisColors.join("\n                ")}

                ${this.fontsGoogleImports.getVariaveisFonts().join("\n                ")}
            }

            *, *::before, *::after { box-sizing: border-box; }

            body {
                margin: 0;
                font-family: "IBM Plex Mono", system-ui, monospace;
                background: var(--ink);
                color: var(--text);
                -webkit-font-smoothing: antialiased;
            }

            /* ---- Hero -------------------------------------------------------- */

            ${this.getStyleHero()}
        `);
    }
}
