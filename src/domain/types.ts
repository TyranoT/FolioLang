export enum SectionType {
    Hero = "hero",
    About = "about",
    Projects = "projects",
    Contact = "contact",
    Metadatas = "metadatas",
}

export enum FontsFamily {
    SpaceGrotesk = "space-grotesk",
    IBMPlexMono = "ibm-plex-mono"
}

export enum ColorName {
    Ink = "ink",
    Line = "line",
    Text = "text",
    Muted = "muted",
    Accent = "accent",
}

export interface StructColor {
    name: ColorName;
    value: string;
}

/** Um conjunto completo de cores: cada ColorName aponta para um valor CSS. */
export type PaletteSet = Record<`${ColorName}`, string>;

/** Resultado da leitura do bloco `design` do .folio. */
export interface DesignConfig {
    /** Nome do conjunto de cores escolhido (rótulo do bloco `design`). */
    palette: string;
    /** Sobrescritas pontuais de cores declaradas dentro do bloco `design`. */
    colors: Partial<PaletteSet>;
}

export type KeysMetadataProperties =
    "title" |
    "description" |
    "author" |
    "keywords" |
    "viewport" |
    "charset";

export type KeysSectionProperties =
    "title" |
    "subtitle" |
    "description" |
    "image" |
    "link";

export interface Block<T extends string = string> {
    keyword: string;
    label: string;
    properties: Record<T, string>;
    children: Block<T>[];
}

export interface StructFont {
    font: FontsFamily;
    url: string;
    family: string;
    fallback: string;
}