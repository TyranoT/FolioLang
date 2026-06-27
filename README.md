<h1 align="center">📄 FolioLang</h1>

<p align="center">
  <strong>Uma DSL declarativa para gerar portfólios estáticos.</strong><br>
  Você escreve um arquivo <code>.folio</code> legível por humanos — o FolioLang compila em <code>index.html</code> + <code>styles.css</code> prontos para publicar.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-F5B544.svg?style=flat-square" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/Node-%E2%89%A518-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node >= 18">
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript strict">
  <img src="https://img.shields.io/badge/PRs-welcome-7C9CFF?style=flat-square" alt="PRs welcome">
</p>

> **Quick overview (EN):** FolioLang is a tiny domain-specific language for building developer portfolios. You describe your portfolio in a declarative `.folio` file (sections, metadata, color theme) and the compiler renders a static `index.html` and `styles.css`. No framework, no runtime — just HTML and CSS.

* * *

## 📑 Índice

- [✨ O que é](#-o-que-é)
- [🧩 Como funciona](#-como-funciona)
- [📦 Instalação](#-instalação)
- [🚀 Uso rápido](#-uso-rápido)
- [✍️ A linguagem `.folio`](#️-a-linguagem-folio)
- [🎨 Paletas e temas](#-paletas-e-temas)
- [🔤 Fontes](#-fontes)
- [🧭 Exemplo completo](#-exemplo-completo)
- [🗂️ Estrutura do projeto](#️-estrutura-do-projeto)
- [🛠️ Scripts](#️-scripts)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

* * *

## ✨ O que é

O **FolioLang** transforma uma descrição declarativa em um site de portfólio estático. Em vez de mexer em HTML/CSS na mão, você descreve **o que** o portfólio tem — e o compilador cuida de **como** renderizar.

```folio
portfolio "Italo Monteiro Leite" {
  design "Aurora" {
    accent "#FF3366"
  }

  hero "Apresentação" {
    title "Italo Monteiro Leite"
  }
}
```

➡️ vira um `index.html` + `styles.css` com tema aplicado, fontes do Google e um hero animado — sem dependências em runtime.

* * *

## 🧩 Como funciona

O pipeline é simples e linear: o texto vira uma árvore de blocos, que vira um modelo de domínio, que é renderizado para arquivos.

```
arquivo.folio
     │
     ▼
┌─────────────┐   tokeniza blocos      ┌─────────────┐
│   Parser    │ ─────────────────────▶ │   Block[]   │
└─────────────┘                        └─────────────┘
     │
     ▼
┌─────────────┐   monta o modelo       ┌─────────────┐
│  Compiler   │ ─────────────────────▶ │  Portfolio  │  (nome, metadata, design, sections)
└─────────────┘                        └─────────────┘
     │
     ▼
┌──────────────────────────┐
│ HtmlRenderer + CssRenderer│ ─▶  dist/index.html
│ (ColorPalette · Fonts)    │ ─▶  dist/styles.css
└──────────────────────────┘
```

| Etapa | Responsável | O que faz |
| --- | --- | --- |
| **Parse** | `Parser` | Lê o `.folio` e produz uma árvore de `Block` (`keyword`, `label`, `properties`, `children`). |
| **Compile** | `Compiler` | Converte a árvore em um `Portfolio`, separando `metadata`, `design` e seções. |
| **Render** | `HtmlRenderer` / `CssRenderer` | Geram o HTML e o CSS, aplicando a paleta (`ColorPalette`) e as fontes (`FontsGoogle`). |
| **Write** | `FileWriter` | Grava `index.html` e `styles.css` em `dist/`. |

* * *

## 📦 Instalação

Requisitos: **Node.js ≥ 18** e **npm**.

```bash
# 1. Clone o repositório
git clone https://github.com/TyranoT/FolioLang.git
cd FolioLang

# 2. Instale as dependências
npm install

# 3. Compile o projeto (TypeScript → build/)
npm run build
```

> 💡 Para desenvolvimento, use o `tsx` (já incluído) e pule o build — veja [Uso rápido](#-uso-rápido).

* * *

## 🚀 Uso rápido

### Comece em um comando (recomendado)

A forma mais rápida de criar um portfólio — sem clonar nada:

```bash
npm create foliolang@latest
```

Ele pergunta o **nome** e a **paleta**, cria a pasta já com `npm install` + `git init` feitos, e te deixa pronto para:

```bash
cd seu-portfolio
npm run dev     # servidor local com live reload — edite portfolio.folio e veja na hora
npm run build   # gera o site estático em dist/
```

> 💡 `npm run dev` sobe um servidor em `http://localhost:5173`, abre o navegador e **recarrega a página sozinho** toda vez que você salva o `.folio`.

### Usando a CLI diretamente

O engine é a CLI `folio`, com dois subcomandos:

```bash
folio build <arquivo.folio> [--out <dir>]              # compila para dist/ (ou --out)
folio dev   <arquivo.folio> [--port <n>] [--out <dir>] # servidor + live reload
```

### Desenvolvendo o próprio FolioLang (a partir do fonte)

```bash
npm run dev      # folio dev example/italo.folio (via tsx, sem build)
npm run build    # compila TypeScript → build/
npm run start    # folio build example/italo.folio (usando o build)
```

A saída de `folio build` é sempre:

```
dist/
├── index.html   # o portfólio
├── styles.css   # tema + estilos
└── assets/      # imagens locais copiadas (se houver)
```

Abra o `dist/index.html` no navegador e pronto. ✅

* * *

## ✍️ A linguagem `.folio`

A sintaxe é baseada em **blocos** e **propriedades**:

```folio
keyword "label" {        # bloco: tem um rótulo e pode conter filhos
  propriedade "valor"    # propriedade: chave + valor entre aspas
}
```

Tudo começa dentro de um bloco raiz `portfolio`:

```folio
portfolio "Seu Nome" {
  metadata { ... }
  design "Principal" { ... }
  hero "Apresentação" { ... }
}
```

### 🔹 `portfolio` — bloco raiz (obrigatório)

O rótulo vira o `<title>` e o nome do portfólio.

```folio
portfolio "Italo Monteiro Leite" {
  # ...todos os outros blocos vão aqui
}
```

### 🔹 `metadata` — `<meta>` tags

Cada propriedade vira uma meta tag no `<head>`. A chave `lang` define o idioma do `<html>` e `favicon` vira o ícone.

```folio
metadata {
  lang "pt-BR"
  description "Desenvolvedor Full Stack"
  author "Italo Monteiro Leite"
  favicon "https://exemplo.com/favicon.png"
}
```

| Chave | Saída |
| --- | --- |
| `lang` | atributo `lang` do `<html>` |
| `favicon` | `<link rel="icon" href="...">` |
| _qualquer outra_ | `<meta name="chave" content="valor">` |

### 🔹 `design` — tema de cores

O **rótulo** escolhe um [conjunto de cores](#-paletas-e-temas) e as **propriedades** sobrescrevem cores específicas.

```folio
design "Aurora" {
  accent "#FF3366"   # sobrescreve só o accent do conjunto Aurora
}
```

- Sem rótulo válido → usa o conjunto `Principal`.
- Bloco vazio → usa o conjunto puro, sem alterações.
- Sobrescritas inválidas (chaves desconhecidas) são ignoradas com segurança.

### 🔹 `hero` — seção de destaque

A primeira coisa que o visitante vê. Renderiza um título grande sobre um grid técnico animado.

```folio
hero "Apresentação" {
  title "Italo Monteiro Leite"
  subtitle "Desenvolvedor Full Stack"
  description "Construo produtos web de ponta a ponta."
  image "https://i.pravatar.cc/480?img=68"
  link "mailto:voce@exemplo.com"
}
```

### 🔹 `projects` — grid de projetos

Cada projeto é um **bloco filho** dentro de `projects`. A seção aceita `title`/`subtitle` no cabeçalho; cada projeto aceita `title`, `description`, `image` e `link`.

```folio
projects "Trabalhos" {
  title "Projetos em destaque"
  subtitle "Uma seleção recente."

  projeto "Meu App" {
    title "Meu App"
    description "O que ele faz e qual problema resolve."
    image "./assets/meu-app.png"        # imagem local (copiada para dist/assets/)
    link "https://github.com/voce/meu-app"
  }
}
```

Renderiza um grid responsivo de cards (imagem + título + descrição), com hover na cor de destaque. Imagem e link são opcionais.

### Seções disponíveis

| Bloco | Status | Descrição |
| --- | --- | --- |
| `hero` | ✅ Renderizado | Seção de abertura com título animado |
| `projects` | ✅ Renderizado | Grid responsivo de cards de projeto |
| `about` | 🚧 Planejado | Bloco "sobre mim" |
| `contact` | 🚧 Planejado | Formulário / links de contato |

> ℹ️ As propriedades válidas de uma seção são `title`, `subtitle`, `description`, `image` e `link`.

### 🖼️ Imagens locais

Qualquer `image` (ou o `favicon` em `metadata`) pode apontar para um arquivo local relativo ao `.folio` (ex.: `image "./assets/foto.png"`). No build, o FolioLang copia o arquivo para `dist/assets/` e reescreve o caminho automaticamente. URLs externas (`http://`, `https://`, `data:`, etc.) são mantidas como estão.

* * *

## 🎨 Paletas e temas

O FolioLang vem com **vários conjuntos de cores** prontos. Escolha pelo rótulo do bloco `design`:

| Conjunto | `ink` (fundo) | `text` | `muted` | `accent` |
| --- | --- | --- | --- | --- |
| **Principal** | `#0B1220` | `#E8EDF7` | `#8A97B0` | `#F5B544` |
| **Aurora** | `#0A0F1E` | `#EAEBFF` | `#9AA0C4` | `#7C9CFF` |
| **Slate** | `#10141A` | `#F2F5F9` | `#94A3B8` | `#34D399` |
| **Light** | `#FFFFFF` | `#0B1220` | `#52617A` | `#E0532F` |

Cada conjunto define 5 variáveis CSS, expostas no `:root`:

| Variável | Papel |
| --- | --- |
| `--ink` | cor de fundo principal |
| `--line` | linhas/grids sutis (com transparência) |
| `--text` | cor do texto |
| `--muted` | texto secundário |
| `--accent` | cor de destaque |

### Customizando

Você pode partir de um conjunto e ajustar cores pontuais:

```folio
design "Slate" {
  accent "#FF3366"
  text "#FFFFFF"
}
```

Isso gera no `:root`:

```css
:root {
  --ink: #10141A;
  --line: rgba(255, 255, 255, 0.08);
  --text: #FFFFFF;        /* sobrescrito */
  --muted: #94A3B8;
  --accent: #FF3366;      /* sobrescrito */
}
```

* * *

## 🔤 Fontes

As fontes do Google são importadas automaticamente e expostas como variáveis CSS:

| Fonte | Variável CSS | Fallback |
| --- | --- | --- |
| Space Grotesk | `--font-space-grotesk` | `sans-serif` |
| IBM Plex Mono | `--font-ibm-plex-mono` | `monospace` |

Use no seu CSS com `font-family: var(--font-space-grotesk);`.

* * *

## 🧭 Exemplo completo

`example/italo.folio`:

```folio
portfolio "Italo Monteiro Leite" {
  metadata {
    lang "pt-BR"
    favicon "https://exemplo.com/favicon.png"
  }

  design "Principal" {
    accent "#F5B544"
  }

  hero "Apresentação" {
    title "Italo Monteiro Leite"
    subtitle "Desenvolvedor Full Stack"
    description "Construo produtos web de ponta a ponta — do modelo de dados à interface."
    image "https://i.pravatar.cc/480?img=68"
    link "mailto:italo.monteiro@exemplo.com"
  }
}
```

Compile:

```bash
npx tsx src/cli.ts build example/italo.folio
# Portfolio gerado em dist/index.html
```

* * *

## 🗂️ Estrutura do projeto

O repositório contém **dois pacotes**: o engine (`foliolang`, na raiz) e o scaffolder (`create-foliolang/`, publicado à parte).

```
FolioLang/                       # pacote `foliolang` (engine/CLI)
├── example/
│   └── italo.folio              # exemplo de entrada
├── src/
│   ├── cli.ts                   # dispatcher dos subcomandos (build/dev)
│   ├── buildPortfolio.ts        # pipeline reutilizável (compila + escreve)
│   ├── compiler/
│   │   ├── Parser.ts            # .folio  →  árvore de Block
│   │   └── Compiler.ts          # Block   →  Portfolio
│   ├── domain/
│   │   ├── Portfolio.ts         # modelo do portfólio
│   │   ├── types.ts             # tipos, enums e paletas
│   │   └── constants.ts
│   ├── renderers/
│   │   ├── HtmlRenderer.ts      # gera o index.html
│   │   ├── CssRenderer.ts       # gera o styles.css
│   │   ├── HtmlComponents.ts    # componentes de seção (hero, projects, ...)
│   │   ├── CssComponents.ts     # estilos de seção + scrollbar
│   │   ├── colors/ColorPalette.ts
│   │   └── fonts/FontsGoogle.ts
│   ├── io/
│   │   ├── FileWriter.ts        # escreve em dist/
│   │   └── AssetManager.ts      # copia/reescreve imagens locais
│   ├── server/
│   │   └── DevServer.ts         # servidor + live reload (só built-ins)
│   └── utils/dedent.ts
├── dist/                        # saída gerada (index.html + styles.css + assets/)
└── create-foliolang/            # pacote `create-foliolang` (scaffolder)
    ├── src/index.ts             # prompts + cópia de template + install + git init
    └── template/                # arquivos do projeto gerado
```

* * *

## 🛠️ Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | `folio dev example/italo.folio` com `tsx` (live reload, sem build) |
| `npm run build` | Compila o TypeScript para `build/` |
| `npm run start` | `folio build example/italo.folio` usando o build compilado |

> Variável `FOLIO_NO_OPEN=1` desliga a abertura automática do navegador no `folio dev`.

* * *

## 🗺️ Roadmap

- [x] Seção `projects` (grid de cards)
- [x] Imagens locais copiadas para `dist/assets/`
- [x] CLI: flag de diretório de saída (`--out`)
- [x] `npm create foliolang` + dev server com live reload
- [ ] Renderizar `subtitle`, `description`, `image` e `link` no `hero`
- [ ] Seções `about` e `contact`
- [ ] Customização de fontes pelo bloco `design`
- [ ] Mais conjuntos de cores
- [ ] Publicar `foliolang` e `create-foliolang` no npm

* * *

## 🤝 Contribuindo

Contribuições são bem-vindas! Algumas ideias do que ajuda bastante:

- 🎨 **Novas paletas** em `src/renderers/colors/ColorPalette.ts`
- 🧱 **Novas seções** (`about`, `contact`) nos renderers
- 🔤 **Novas fontes** em `src/renderers/fonts/FontsGoogle.ts`
- 🐛 **Correções** e melhorias no parser/compiler
- 📖 **Documentação** e exemplos `.folio`

Fluxo sugerido: faça um fork → crie uma branch → abra um PR descrevendo a mudança.

* * *

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [`LICENSE`](LICENSE) para os detalhes.

<p align="center">Feito com ☕ por <a href="https://github.com/TyranoT">Italo Monteiro</a></p>
