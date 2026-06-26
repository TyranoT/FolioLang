import { propertyKeysExcludeMeta } from "../domain/constants.js";
import { Portfolio } from "../domain/Portfolio.js";
import { Block } from "../domain/types.js";


export class ParserHTML {

    public applyMetadatas(portfolio: Portfolio): string {
        const source = portfolio.metadatas;
        const keys = Object.keys(source).filter(key => !propertyKeysExcludeMeta.includes(key));
        const listProperties = keys.map(key => this.getTagMetadatas(key, source[key])).join("\n");

        return listProperties;
    }

    public getTagMetadatas(key: string, value: string): string {
        switch (key) {
            case "favicon":
                return `<link rel="icon" href="${value}">`;
            default:
                return `<meta name="${key}" content="${value}">`;
        }
    }

    public getSectionsHtml(portfolio: Portfolio): Block<string>[] {
        const sectionsHtml = portfolio.sections
            .filter(section => section.keyword !== "metadatas")

        return sectionsHtml;
    }
}