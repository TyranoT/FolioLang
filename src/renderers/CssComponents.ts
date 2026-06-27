

export class CssComponents {

    getStyleScrollbar(): string {
        return (`
        /* Firefox */
        html {
            scrollbar-width: thin;
            scrollbar-color: var(--line) transparent;
        }

        /* WebKit / Chromium */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        ::-webkit-scrollbar-track {
            background: var(--ink);
        }

        ::-webkit-scrollbar-thumb {
            background: color-mix(in srgb, var(--muted) 45%, transparent);
            border: 3px solid var(--ink);
            border-radius: 999px;
            transition: background 0.2s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent);
        }

        ::-webkit-scrollbar-corner {
            background: var(--ink);
        }

        /* seleção de texto no mesmo tom de destaque */
        ::selection {
            background: color-mix(in srgb, var(--accent) 30%, transparent);
            color: var(--text);
        }
        `).trim();
    }

    getStyleHero(): string {
        return (`
        .hero {
            position: relative;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: clamp(2rem, 8vw, 8rem);
            overflow: hidden;
        }

        /* technical blueprint grid, faded toward the edges */
        .hero::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(var(--line) 1px, transparent 1px),
                linear-gradient(90deg, var(--line) 1px, transparent 1px);
            background-size: 64px 64px;
            -webkit-mask-image: radial-gradient(ellipse 80% 70% at 25% 45%, #000 25%, transparent 100%);
            mask-image: radial-gradient(ellipse 80% 70% at 25% 45%, #000 25%, transparent 100%);
            pointer-events: none;
        }

        /* monospace eyebrow generated purely from CSS */
        .hero::after {
            content: "// portfolio";
            position: absolute;
            top: clamp(2rem, 8vw, 8rem);
            left: clamp(2rem, 8vw, 8rem);
            font-size: 0.85rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--accent);
        }

        .hero h1 {
            position: relative;
            z-index: 1;
            max-width: 16ch;
            margin: 0;
            font-family: "Space Grotesk", sans-serif;
            font-weight: 700;
            font-size: clamp(2.8rem, 11vw, 8rem);
            line-height: 0.98;
            letter-spacing: -0.03em;
            color: var(--text);
        }

        /* accent rule + caret under the headline */
        .hero h1::after {
            content: "";
            display: block;
            width: clamp(3rem, 8vw, 6rem);
            height: 4px;
            margin-top: clamp(1.2rem, 3vw, 2rem);
            background: var(--accent);
            border-radius: 2px;
        }

        @keyframes hero-rise {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: none; }
        }

        @media (prefers-reduced-motion: no-preference) {
            .hero h1 { animation: hero-rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
            .hero::after { animation: hero-rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both 0.15s; }
        }
        `).trim();
    }

    getStyleProjects(): string {
        return (`
        .projects {
            position: relative;
            padding: clamp(3rem, 10vw, 9rem) clamp(2rem, 8vw, 8rem);
        }

        .projects__header {
            max-width: 60ch;
            margin: 0 0 clamp(2rem, 5vw, 4rem);
        }

        /* monospace eyebrow generated purely from CSS */
        .projects__header::before {
            content: "// projetos";
            display: block;
            margin-bottom: 1rem;
            font-size: 0.85rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--accent);
        }

        .projects__header h2 {
            margin: 0;
            font-family: "Space Grotesk", sans-serif;
            font-weight: 700;
            font-size: clamp(2rem, 6vw, 4rem);
            line-height: 1.02;
            letter-spacing: -0.02em;
            color: var(--text);
        }

        .projects__subtitle {
            margin: 1rem 0 0;
            color: var(--muted);
            font-size: clamp(0.95rem, 2vw, 1.15rem);
        }

        .projects__grid {
            list-style: none;
            margin: 0;
            padding: 0;
            display: grid;
            gap: clamp(1rem, 3vw, 2rem);
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
        }

        .project-card {
            position: relative;
            border: 1px solid var(--line);
            border-radius: 12px;
            overflow: hidden;
            background: color-mix(in srgb, var(--ink) 92%, var(--text));
            transition: transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1),
                        border-color 0.3s ease;
        }

        @media (prefers-reduced-motion: no-preference) {
            .project-card:hover {
                transform: translateY(-4px);
                border-color: var(--accent);
            }
        }

        .project-card__link {
            display: block;
            height: 100%;
            text-decoration: none;
            color: inherit;
        }

        .project-card__image {
            display: block;
            width: 100%;
            aspect-ratio: 16 / 9;
            object-fit: cover;
            border-bottom: 1px solid var(--line);
        }

        .project-card__title {
            margin: 0;
            padding: clamp(1.1rem, 3vw, 1.6rem) clamp(1.1rem, 3vw, 1.6rem) 0;
            font-family: "Space Grotesk", sans-serif;
            font-weight: 600;
            font-size: 1.25rem;
            letter-spacing: -0.01em;
            color: var(--text);
        }

        .project-card__description {
            margin: 0.6rem 0 0;
            padding: 0 clamp(1.1rem, 3vw, 1.6rem) clamp(1.1rem, 3vw, 1.6rem);
            color: var(--muted);
            font-size: 0.95rem;
            line-height: 1.55;
        }
        `).trim();
    }

}