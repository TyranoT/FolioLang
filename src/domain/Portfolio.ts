import { Sections } from "./types.js";

type ResponseToString = {
    resume: string;
    sections: string[];
}

export class Portfolio {
    public name: string;
    public sections: Sections[];

    constructor(name: string) {
        this.name = name;
        this.sections = [];
    }

    addSection(section: Sections): void {
        this.sections.push(section);
    }

    toString(): ResponseToString {
        return {
            resume: `Portfolio: ${this.name}, Sections: ${this.sections.length}`,
            sections: this.sections.map(section => `Section Type: ${section.type}, Subtitle: ${section.subtitle ?? "N/A"}, Content: ${section.content}`),
        };
    }
}