import { FontsFamily, StructFont } from "../../domain/types.js"


export class FontsGoogle {

    private payloadImports: Record<`${FontsFamily}`, string>;

    constructor(){
        this.payloadImports = Object.fromEntries(
            this.getAll().map(({ font, url }) => [font, `@import url('${url}');`])
        ) as Record<`${FontsFamily}`, string>
    }

    getSpaceGrotesk(): StructFont {
        return ({
            font: FontsFamily.SpaceGrotesk,
            url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap"
        })
    }

    getIBMPlexMono(): StructFont {
        return ({
            font: FontsFamily.IBMPlexMono,
            url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
        })
    }

    getAll(): StructFont[] {
        return [
            this.getSpaceGrotesk(),
            this.getIBMPlexMono(),
        ]
    }

    getImportsFonts(selecteds?: `${FontsFamily}`[]): string[] {
        if (!selecteds?.length) {
            return Object.values(this.payloadImports)
        }

        return selecteds
            .filter((font) => font in this.payloadImports)
            .map((font) => this.payloadImports[font])
    }
}