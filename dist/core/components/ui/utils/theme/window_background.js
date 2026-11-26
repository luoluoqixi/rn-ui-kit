import { getStandardAppBackgroundColors } from "./app_background";
export function getAppWindowBackgroundColor(colorScheme) {
    return getStandardAppBackgroundColors(colorScheme).screen;
}
