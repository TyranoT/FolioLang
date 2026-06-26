import fs from "node:fs";
import path from "node:path";

export class FileWriter {
    write(outputDir: string, files: Record<string, string>): void {
        fs.mkdirSync(outputDir, { recursive: true });

        for (const [filename, content] of Object.entries(files)) {
            fs.writeFileSync(path.join(outputDir, filename), content);
        }
    }
}