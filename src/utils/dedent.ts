/**
 * Remove o excesso de indentação de uma string multilinha.
 *
 * Calcula a menor indentação entre as linhas não vazias e a remove de
 * todas as linhas, preservando a indentação relativa do conteúdo.
 */
export function dedent(text: string): string {
    const lines = text.replace(/^\n/, "").replace(/\s+$/, "").split("\n");

    const indents = lines
        .filter(line => line.trim().length > 0)
        .map(line => line.match(/^\s*/)?.[0].length ?? 0);

    const minIndent = indents.length > 0 ? Math.min(...indents) : 0;

    return lines.map(line => line.slice(minIndent)).join("\n");
}
