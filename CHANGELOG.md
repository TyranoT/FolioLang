# Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

Este repositório publica **dois pacotes**: `foliolang` (o engine/CLI) e
`create-foliolang` (o scaffolder por trás de `npm create foliolang`).

## [Não lançado]

## [foliolang 1.1.0] — 2026-06-27

### Adicionado

- Seção **`projects`**: grid responsivo de cards de projeto (imagem, título,
  descrição e link), com cada projeto declarado como bloco filho.
- **Imagens locais**: `image`/`favicon` podem apontar para arquivos locais; no
  build são copiados para `dist/assets/` (com nomes à prova de colisão) e os
  caminhos são reescritos automaticamente. URLs externas são preservadas.
- **Scrollbar e `::selection`** customizadas a partir da paleta ativa
  (`var(--*)`), adaptando-se a qualquer tema.
- Subcomando **`folio dev`**: servidor local com **live reload** — recompila e
  recarrega o navegador a cada save. Usa apenas built-ins do Node
  (`http` + `fs.watch` + Server-Sent Events). Flags `--port` (padrão 5173) e
  `--out`. Variável `FOLIO_NO_OPEN` desativa a abertura automática do navegador.
- Subcomando **`folio build`** com a flag `--out` para o diretório de saída.

### Alterado

- **BREAKING (CLI):** a invocação mudou de `folio <arquivo>` para
  `folio build <arquivo>` (ou `folio dev <arquivo>`).
- Pacote renomeado de `folio-lang` para **`foliolang`**.
- Empacotamento pronto para publicação: `files`, `main`, `engines`, shebang no
  binário e `prepublishOnly` (build automático antes de publicar).

### Removido

- `console.log` de depuração que poluía a saída do compilador.

## [create-foliolang 1.0.0] — 2026-06-27

### Adicionado

- Scaffolder `npm create foliolang`: pergunta nome e paleta, gera a pasta a
  partir de um template, e roda `npm install` + `git init` automaticamente.
- Projeto gerado já vem com `portfolio.folio` inicial (hero + projects) e os
  scripts `dev`/`build` apontando para o engine `foliolang`.

## [foliolang 1.0.0]

### Adicionado

- DSL `.folio` com blocos `portfolio`, `metadata`, `design` e `hero`.
- Pipeline Parser → Compiler → Renderers → FileWriter gerando `index.html` +
  `styles.css` estáticos.
- Quatro paletas de cores (`Principal`, `Aurora`, `Slate`, `Light`) com
  sobrescritas pontuais via bloco `design`, expostas como variáveis CSS.
- Fontes do Google (Space Grotesk, IBM Plex Mono) importadas automaticamente.
- Seção `hero` com título animado.
