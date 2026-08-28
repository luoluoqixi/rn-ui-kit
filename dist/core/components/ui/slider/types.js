export function resolveSliderValues(value) {
    if (value == null)
        return undefined;
    return Array.isArray(value) ? value : [value];
}
export function resolveSliderFirstValue(value, fallback) {
    return resolveSliderValues(value)?.[0] ?? fallback;
}
