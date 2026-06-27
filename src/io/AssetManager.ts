import fs from "node:fs";
import path from "node:path";
import { Portfolio } from "../domain/Portfolio.js";
import { Block } from "../domain/types.js";

/** Propriedades cujo valor pode apontar para um arquivo de imagem local. */
const IMAGE_KEYS = ["image", "favicon"];

/**
 * Resolve referências de imagens locais declaradas no `.folio`, copiando os
 * arquivos para a pasta de assets da saída e reescrevendo as propriedades para
 * apontarem ao caminho relativo gerado. URLs e data URIs são preservados.
 */
export class AssetManager {
    /** Caminho absoluto da origem -> nome do arquivo na saída. */
    private readonly assets = new Map<string, string>();
    /** Nome de saída já usado -> origem, para evitar colisões de nome. */
    private readonly usedNames = new Map<string, string>();

    /**
     * @param baseDir   Diretório do arquivo `.folio` (base para caminhos relativos).
     * @param assetsDir Subpasta dentro da saída onde as imagens serão copiadas.
     */
    constructor(private readonly baseDir: string, private readonly assetsDir = "assets") {}

    /** Reescreve, no lugar, todas as referências de imagem do portfólio. */
    process(portfolio: Portfolio): void {
        portfolio.metadatas.favicon = this.resolve(portfolio.metadatas.favicon);

        for (const section of portfolio.sections) {
            this.processBlock(section);
        }
    }

    /** Copia os arquivos registrados para `<outputDir>/<assetsDir>`. */
    copyTo(outputDir: string): void {
        if (this.assets.size === 0) return;

        const targetDir = path.join(outputDir, this.assetsDir);
        fs.mkdirSync(targetDir, { recursive: true });

        for (const [source, filename] of this.assets) {
            fs.copyFileSync(source, path.join(targetDir, filename));
        }
    }

    private processBlock(block: Block): void {
        for (const key of IMAGE_KEYS) {
            if (block.properties[key]) {
                block.properties[key] = this.resolve(block.properties[key]);
            }
        }

        for (const child of block.children) {
            this.processBlock(child);
        }
    }

    /**
     * Registra um arquivo local para cópia e devolve o caminho relativo da
     * saída. Retorna a referência intacta quando é externa ou inexistente.
     */
    private resolve(reference: string | undefined): string {
        if (!reference || this.isExternal(reference)) {
            return reference ?? "";
        }

        const source = path.resolve(this.baseDir, reference);

        if (!fs.existsSync(source)) {
            console.warn(`Imagem não encontrada, mantendo referência original: ${reference}`);
            return reference;
        }

        const filename = this.assets.get(source) ?? this.registerName(source);
        return `./${this.assetsDir}/${filename}`;
    }

    /** Gera um nome único na pasta de assets, evitando sobrescrever homônimos. */
    private registerName(source: string): string {
        const extension = path.extname(source);
        const base = path.basename(source, extension);

        let candidate = `${base}${extension}`;
        let counter = 1;

        while (this.usedNames.has(candidate) && this.usedNames.get(candidate) !== source) {
            candidate = `${base}-${counter++}${extension}`;
        }

        this.usedNames.set(candidate, source);
        this.assets.set(source, candidate);
        return candidate;
    }

    private isExternal(reference: string): boolean {
        return /^(https?:|mailto:|tel:|data:|\/\/)/i.test(reference);
    }
}
