/** Override HeroUI's source tokens, never its derived --color-* utilities. */
export function semanticColorsToVariables(colors) {
    return Object.fromEntries(Object.entries(colors).map(([name, value]) => [
        "--" + name.replace(/[A-Z]/g, letter => "-" + letter.toLowerCase()),
        value,
    ]));
}
