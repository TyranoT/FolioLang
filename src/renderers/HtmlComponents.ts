import { Block, KeysSectionProperties } from "../domain/types.js";


export class HtmlComponents {

    protected takeSection(section: Block): string {
        switch (section.keyword) {
            case "hero":
                return this.applyHero(section);
            case "projects":
                return this.applyProjects(section);
            default:
                return "";
        }
    }

    protected applyHero(section: Block<KeysSectionProperties>): string {
        const title = section.properties.title;

        return (`
                <section label="${section.label}" class="hero">
                    <h1>${title}</h1>
                    <h2>${section.properties.subtitle}</h2>
                </section>
            `).trim();
    }

    protected applyProjects(section: Block<KeysSectionProperties>): string {
        const title = section.properties.title ?? "Projetos";
        const subtitle = section.properties.subtitle;

        const cards = section.children
            .map(project => this.applyProjectCard(project))
            .join("\n");

        return (`
            <section label="${section.label}" class="projects">
                <header class="projects__header">
                    <h2>${title}</h2>
                    ${subtitle ? `<p class="projects__subtitle">${subtitle}</p>` : ""}
                </header>
                <ul class="projects__grid">
                    ${cards}
                </ul>
            </section>
        `).trim();
    }

    private applyProjectCard(project: Block<KeysSectionProperties>): string {
        const { title, description, image, link } = project.properties;

        const cover = image
            ? `<img class="project-card__image" src="${image}" alt="${title ?? project.label}" loading="lazy" />`
            : "";

        const body = (`
            ${cover}
            <h3 class="project-card__title">${title ?? project.label}</h3>
            ${description ? `<p class="project-card__description">${description}</p>` : ""}
        `).trim();

        const content = link
            ? `<a class="project-card__link" href="${link}">${body}</a>`
            : body;

        return (`
            <li class="project-card">
                ${content}
            </li>
        `).trim();
    }
}