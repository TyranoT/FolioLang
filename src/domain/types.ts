export enum SectionType {
    Hero = "hero",
    About = "about",
    Projects = "projects",
    Contact = "contact",
}

export interface Sections {
    content: string;
    subtitle?: string;
    type: SectionType;
    label?: string;
}