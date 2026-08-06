import type { LinkProps } from "./types";
export declare const DEFAULT_LINK_HOVER_STYLE: {
    readonly opacity: 0.8 | 0.6;
    readonly textDecorationColor: "$color10";
};
export declare const DEFAULT_LINK_PRESS_STYLE: {
    readonly opacity: 0.5;
    readonly textDecorationColor: "$color10";
};
export declare const DEFAULT_LINK_FOCUS_VISIBLE_STYLE: {
    readonly outlineColor: "$outlineColor";
    readonly outlineStyle: "solid";
    readonly outlineWidth: 2;
};
export declare const Link: import("react").ForwardRefExoticComponent<Omit<LinkProps, "ref"> & import("react").RefAttributes<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").Text>>;
