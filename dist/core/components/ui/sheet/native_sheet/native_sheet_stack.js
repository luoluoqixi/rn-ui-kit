/** Common-platform placeholder. Metro selects `.native.tsx` or `.web.tsx`. */
function NativeSheetStackFallback(_props) {
    return null;
}
function NativeSheetStackScreenFallback(_props) {
    return null;
}
export const NativeSheetStack = Object.assign(NativeSheetStackFallback, {
    Screen: NativeSheetStackScreenFallback,
});
