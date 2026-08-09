import { type AccentThemeName } from "../utils/theme";
export { IOS_PAGE_SHEET_TOAST_VIEWPORT_INSET, IOS_TRUE_SHEET_TOAST_VIEWPORT_INSET, SCOPED_TOAST_VIEWPORT_INSET, } from "../sheet/native_sheet/true_sheet/overlay_toast_layout";
export declare function Toaster({ accentThemeName, viewportName, }: {
    accentThemeName?: AccentThemeName;
    viewportName?: string;
}): import("react").JSX.Element;
