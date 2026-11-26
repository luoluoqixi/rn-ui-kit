import type { AccentThemeName } from "../utils/theme";
import type { ToastNativeToasterProps } from "./types";
export declare function Toaster(props: Omit<ToastNativeToasterProps, "accentThemeName"> & {
    accentThemeName?: AccentThemeName;
}): import("react").JSX.Element;
