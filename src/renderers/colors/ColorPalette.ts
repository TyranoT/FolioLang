import { ColorName, PaletteSet } from "../../domain/types.js"


export class ColorPalette {

    /** Conjunto usado quando o .folio não informa um nome válido. */
    private readonly defaultPalette = "Principal";

    /** Vários conjuntos prontos; o usuário escolhe pelo rótulo do bloco `design`. */
    private readonly palettes: Record<string, PaletteSet> = {
        Principal: {
            ink: "#0B1220",
            line: "rgba(232, 237, 247, 0.09)",
            text: "#E8EDF7",
            muted: "#8A97B0",
            accent: "#F5B544",
        },
        Aurora: {
            ink: "#0A0F1E",
            line: "rgba(168, 184, 255, 0.10)",
            text: "#EAEBFF",
            muted: "#9AA0C4",
            accent: "#7C9CFF",
        },
        Slate: {
            ink: "#10141A",
            line: "rgba(255, 255, 255, 0.08)",
            text: "#F2F5F9",
            muted: "#94A3B8",
            accent: "#34D399",
        },
        Light: {
            ink: "#FFFFFF",
            line: "rgba(15, 23, 42, 0.10)",
            text: "#0B1220",
            muted: "#52617A",
            accent: "#E0532F",
        },
    };

    /** Nomes dos conjuntos disponíveis. */
    getPalettesNames(): string[] {
        return Object.keys(this.palettes);
    }

    /** Resolve o conjunto pelo nome (case-insensitive), caindo no padrão se não existir. */
    getPalette(name?: string): PaletteSet {
        if (name) {
            const match = this.getPalettesNames().find(
                (palette) => palette.toLowerCase() === name.toLowerCase()
            );

            if (match) {
                return this.palettes[match];
            }
        }

        return this.palettes[this.defaultPalette];
    }

    /**
     * Monta as variáveis CSS do `:root` a partir de um conjunto base,
     * aplicando sobrescritas pontuais vindas do bloco `design` do .folio.
     */
    getVariaveisColors(name?: string, overrides?: Partial<PaletteSet>): string[] {
        const base = this.getPalette(name);
        const merged: PaletteSet = { ...base, ...this.sanitizeOverrides(overrides) };

        return (Object.entries(merged) as [keyof PaletteSet, string][])
            .map(([color, value]) => `--${color}: ${value};`);
    }

    /** Mantém apenas chaves que são cores válidas (ColorName) e com valor preenchido. */
    private sanitizeOverrides(overrides?: Partial<PaletteSet>): Partial<PaletteSet> {
        if (!overrides) {
            return {};
        }

        const validNames = Object.values(ColorName) as string[];

        return Object.fromEntries(
            Object.entries(overrides).filter(
                ([color, value]) => validNames.includes(color) && Boolean(value)
            )
        ) as Partial<PaletteSet>;
    }
}
