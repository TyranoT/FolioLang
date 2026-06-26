import { Block, KeysSectionProperties } from "../domain/types.js";


export class HtmlComponents {

    protected takeSection(section: Block): string {
        switch (section.keyword) {
            case "hero":
                return this.applyHero(section);
            default:
                return "";
        }
    }

    protected applyHero(section: Block<KeysSectionProperties>): string {
        const title = section.properties.title;

        return (`
                <section label="${section.label}" class="hero">
                    <h1>${title}</h1>
                </section>
            `).trim();
    }
}