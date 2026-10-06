import { type ReactNode } from "react";
import type { TextStyle } from "react-native";
export declare function NativeListTriggerFontWeightProvider({ children, nativeTriggerFontWeight, }: {
    children: ReactNode;
    nativeTriggerFontWeight?: TextStyle["fontWeight"];
}): import("react").JSX.Element;
export declare function useResolvedNativeListTriggerFontWeight(nativeTriggerFontWeight?: TextStyle["fontWeight"]): "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "condensed" | 100 | "light" | "medium" | "heavy" | "regular" | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "ultralight" | "thin" | "semibold" | "condensedBold" | "black" | undefined;
