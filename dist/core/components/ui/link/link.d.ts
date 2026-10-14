import type { LinkProps } from "./types";
export declare const DEFAULT_LINK_PRESS_STYLE: {
    readonly opacity: 0.5;
};
export declare const DEFAULT_LINK_FOCUS_VISIBLE_STYLE: {};
/** Link uses the RNR Button link variant so native and web share the same button semantics. */
export declare const Link: import("react").ForwardRefExoticComponent<Omit<LinkProps, "ref"> & import("react").RefAttributes<import("react-native").View>>;
