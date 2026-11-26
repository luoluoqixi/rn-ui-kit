/** v4: fixed detents fill; auto detents keep their natural content height. */
export function isTrueSheetAutoDetent(detents, index = 0) {
    const detent = detents?.[Math.max(0, index)];
    return detent === "auto" || detent === -1;
}
export function mergeTrueSheetContentStyle(_scrollable, style, autoDetent = false) {
    return [autoDetent ? { flexGrow: 0, flexBasis: "auto", flexShrink: 1 } : { flex: 1, minHeight: 0 }, style];
}
