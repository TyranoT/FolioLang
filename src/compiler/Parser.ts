import { Block } from "../domain/types.js";

export class Parser {

    /** Lê o source inteiro a partir do bloco `portfolio` raiz. */
    parse(source: string): Block {
        const match = source.match(/portfolio\s+"([^"]+)"\s*\{/);

        if (!match || match.index === undefined) {
            throw new Error('Esperado: portfolio "Seu Nome"');
        }

        const openingBraceIndex = match.index + match[0].lastIndexOf("{");
        const closingBraceIndex = this.findClosingBrace(source, openingBraceIndex);
        const body = source.slice(openingBraceIndex + 1, closingBraceIndex);

        const { properties, children } = this.parseBlockBody(body);

        return { keyword: "portfolio", label: match[1], properties, children };
    }

    /**
     * Percorre o corpo de um bloco guardando:
     *  - `chave "valor"`            -> propriedade
     *  - `chave "rótulo" { ... }`   -> bloco filho (lido recursivamente)
     */
    private parseBlockBody(body: string): { properties: Record<string, string>; children: Block[] } {
        const properties: Record<string, string> = {};
        const children: Block[] = [];

        const token = /(\w+)\s+"([^"]*)"\s*(\{)?/g;
        let match: RegExpExecArray | null;

        while ((match = token.exec(body)) !== null) {
            const [full, keyword, label, openingBrace] = match;

            if (!openingBrace) {
                properties[keyword] = label;
                continue;
            }

            const openingBraceIndex = match.index + full.length - 1;
            const closingBraceIndex = this.findClosingBrace(body, openingBraceIndex);
            const innerBody = body.slice(openingBraceIndex + 1, closingBraceIndex);

            const nested = this.parseBlockBody(innerBody);
            children.push({ keyword, label, properties: nested.properties, children: nested.children });

            token.lastIndex = closingBraceIndex + 1;
        }

        return { properties, children };
    }

    private findClosingBrace(source: string, openingBraceIndex: number): number {
        let depth = 0;

        for (let i = openingBraceIndex; i < source.length; i++) {
            const char = source[i];

            if (char === "{") depth++;
            if (char === "}") depth--;

            if (depth === 0) {
                return i;
            }
        }

        throw new Error("Bloco não fechado. Está faltando }");
    }
}
