import { Block, DesignConfig, PaletteSet } from "./types.js";

type ResponseToString = {
    resume: string;
    sections: string[];
}

export class Portfolio {
    public name: string;
    public style: Record<string, string>;
    public metadatas: Record<string, string>;
    public sections: Block[];
    public design: DesignConfig;

    constructor(name: string) {
        this.name = name;
        this.metadatas = {};
        this.sections = [];
        this.style = {};
        this.design = { palette: "", colors: {} };
    }

    addSection(section: Block): void {
        this.sections.push(section);
    }

    addMetadatas(properties: Object): void {
        Object.assign(this.metadatas, properties);
    }

    addStyle(properties: Object): void {
        Object.assign(this.style, properties);
    }

    /** Lê o bloco `design "Nome" { ... }`: rótulo vira o conjunto, propriedades viram sobrescritas. */
    setDesign(block: Block): void {
        this.design = {
            palette: block.label,
            colors: block.properties as Partial<PaletteSet>,
        };
    }

    toString(): ResponseToString {
        return {
            resume: `Portfolio: ${this.name}, Sections: ${this.sections.length}`,
            sections: this.sections.map(section => this.describe(section)),
        };
    }

    private describe(block: Block, depth = 0): string {
        const indent = "  ".repeat(depth);
        const properties = Object.entries(block.properties)
            .map(([key, value]) => `${key}="${value}"`)
            .join(", ") || "—";

        const lines = [`${indent}${block.keyword} "${block.label}" { ${properties} }`];

        for (const child of block.children) {
            lines.push(this.describe(child, depth + 1));
        }

        return lines.join("\n");
    }
}
