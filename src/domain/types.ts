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
}