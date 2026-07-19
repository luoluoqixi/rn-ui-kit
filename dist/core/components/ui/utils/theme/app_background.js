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
export function getStandardAppBackgroundColors(colorScheme) {
    return STANDARD_IOS_BACKGROUND_COLORS[colorScheme];
}
