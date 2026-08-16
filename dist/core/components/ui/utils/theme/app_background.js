const STANDARD_IOS_BACKGROUND_COLORS = {
    light: {
        screen: "#F2F2F7",
        sheet: "#F2F2F7",
        card: "#FFFFFF",
        header: "#F7F7FA",
    },
    dark: {
        screen: "#0e0e0e",
        sheet: "#0e0e0e",
        card: "#1C1C1E",
        header: "#1C1C1E",
    },
};
let appBackgroundColors = STANDARD_IOS_BACKGROUND_COLORS;
export { STANDARD_IOS_BACKGROUND_COLORS as defaultAppStandardAppBackgroundColors };
/**
 * 静态设置应用背景色。应在渲染 UI 之前调用。
 */
export function setStandardAppBackgroundColors(colors) {
    appBackgroundColors = colors;
}
export function getStandardAppBackgroundColors(colorScheme) {
    return appBackgroundColors[colorScheme];
}
