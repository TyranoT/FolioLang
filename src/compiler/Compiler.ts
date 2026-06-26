import { Portfolio } from "../domain/Portfolio.js";
import { Parser } from "./Parser.js";

export class Compiler {
    private readonly parser = new Parser();

    compile(source: string): Portfolio {
        const root = this.parser.parse(source);
        const portfolio = new Portfolio(root.label);

        console.log(root);
        
        for (const section of root.children) {
            if (section.keyword === "design") {
                portfolio.setDesign(section);
                continue;
            }

            portfolio.addSection(section);
        }

        portfolio.addMetadatas(root.properties);

        return portfolio;
    }
}
