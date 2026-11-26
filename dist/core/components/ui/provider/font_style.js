/** 显式的样式置于默认字体之后，代码语义由调用者保留。 */
export function defaultFontStyle(family, className) {
    return family &&
        !/(?:^|\s)(?:[\w-]+:)*font-mono(?:\s|$)/.test(className ?? "")
        ? { fontFamily: family }
        : undefined;
}
