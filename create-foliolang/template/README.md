# {{name}}

Portfólio feito com [FolioLang](https://github.com/TyranoT/FolioLang).

## Como usar

```bash
npm run dev     # servidor local com live reload — edite portfolio.folio e veja na hora
npm run build   # gera o site estático em dist/ (index.html + styles.css + assets)
```

## Editando

Tudo que aparece no site vem do arquivo **`portfolio.folio`**. Abra, edite os textos,
troque a paleta no bloco `design` e adicione projetos. Imagens locais vão na pasta
`assets/` e são referenciadas por caminho relativo (ex.: `image "./assets/foto.png"`).

Para publicar, rode `npm run build` e suba o conteúdo da pasta `dist/` em qualquer
hospedagem estática (GitHub Pages, Netlify, Vercel, etc).
