const isFiniteNumberArray = (value) => {
    return (Array.isArray(value) && value.every((item) => typeof item === "number" && Number.isFinite(item)));
};
const isBooleanArray = (value) => {
    return Array.isArray(value) && value.every((item) => typeof item === "boolean");
};
const parseSplitLayoutState = (value) => {
    if (typeof value === "undefined" || value === null)
        return undefined;
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!parsed || typeof parsed !== "object")
        return undefined;
    const state = parsed;
    if (!isFiniteNumberArray(state.sizes) || !isBooleanArray(state.visible))
        return undefined;
    return {
        sizes: state.sizes,
        visible: state.visible,
    };
};
export async function readSplitLayoutState(storageAdapter, storageKey) {
    if (!storageAdapter || !storageKey)
        return undefined;
    try {
        return parseSplitLayoutState(await storageAdapter.getItem(storageKey));
    }
    catch {
        return undefined;
    }
}
export async function writeSplitLayoutState(storageAdapter, storageKey, state) {
    if (!storageAdapter || !storageKey)
        return;
    try {
        await storageAdapter.setItem(storageKey, state);
        await storageAdapter.save?.();
    }
    catch {
        /* empty */
    }
}
