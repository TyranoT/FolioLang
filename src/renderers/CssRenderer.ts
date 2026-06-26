import { dedent } from "../utils/dedent.js";
import { CssComponents } from "./CssComponents.js";
import { FontsGoogle } from "./fonts/FontsGoogle.js";

export class CssRenderer extends CssComponents {

    private fontsGoogleImports: FontsGoogle

    constructor() {
        super();
        
        this.fontsGoogleImports = new FontsGoogle();
    }
    
    render(): string {
        return dedent(`
            ${this.fontsGoogleImports.getImportsFonts().join("\n            ")}

            :root {
                --ink: #0B1220;
                --line: rgba(232, 237, 247, 0.09);
                --text: #E8EDF7;
                --muted: #8A97B0;
                --accent: #F5B544;
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
