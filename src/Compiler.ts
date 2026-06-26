import { Portfolio } from "./domain/Portfolio.js";
import { SectionType } from "./domain/types.js";

export class Compiler {

    compile(source: string): Portfolio {
        const name = this.identifyPortfolioName(source);
        const portfolio = new Portfolio(name);

        const content = this.getPortfolioBlock(source);
        const sections = this.getSectionsBlocks(content || "");

        if(sections.length > 0){
            for (const section of sections) {
                portfolio.addSection({
                    content: section.content,
                    type: section.type
                });
            }
        }
        
        return portfolio;
    }


    identifyPortfolioName(source: string): string {
        const match = source.match(/portfolio\s+"([^"]+)"/);

        if (!match) {
            throw new Error('Esperado: portfolio "Seu Nome"');
        }

        return match[1];
    }

    identifySectionsType(source: string): {index: number, type: SectionType}[] | undefined {
        const regex = new RegExp(`${Object.values(SectionType).join("|")}\s+"([^"]+)"\s*\{`, "g")
        const matches = [...source.match(regex) || []];

        if (!matches) {
            return undefined;
        }

        return matches.map((match) => {
            const type = match as SectionType;
            const index = source.indexOf(match);
            return { index, type };
        });
    }

    getPortfolioBlock(source: string): string | undefined {
        const match = source.match(/portfolio\s+"([^"]+)"\s*\{/);

        if (!match || match.index === undefined) {
            return undefined;
        }

        const openingBraceIndex = match.index + match[0].lastIndexOf("{");

        return this.extractBlockFromIndex(source, openingBraceIndex);
    }

    getSectionsBlocks(source: string): { type: SectionType; content: string }[] {
        const regex = new RegExp(`(${Object.values(SectionType).join("|")})\\s+"([^"]+)"\\s*\\{`, "g");
        const blocks: { type: SectionType; content: string }[] = [];

        console.log(source.matchAll(regex))

        for (const match of source.matchAll(regex)) {
            if (match.index === undefined) continue;

            const type = match[1] as SectionType;
            const openingBraceIndex = match.index + match[0].lastIndexOf("{");
            const content = this.extractBlockFromIndex(source, openingBraceIndex);

            blocks.push({ type, content });
        }

        return blocks;
    }

    getStringProperty(source: string, propertyName: string): string | undefined {
        const regex = new RegExp(`${propertyName}\\s+"([^"]+)"`);
        return source.match(regex)?.[1];
    }

    extractBlockFromIndex(source: string, openingBraceIndex: number): string {
        let depth = 0;

        for (let i = openingBraceIndex; i < source.length; i++) {
            const char = source[i];

            if (char === "{") depth++;
            if (char === "}") depth--;

            if (depth === 0) {
                return source.slice(openingBraceIndex + 1, i).trim();
            }
        }

        throw new Error("Bloco não fechado. Está faltando }");
    }
    
}