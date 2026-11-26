/**
 * RN Web 0.21.2 interoperability boundary. Keep the existing Pressable callbacks,
 * press lifecycle, layout and measurement refs on HeroUI's single DOM button.
 * These are the same hooks used by RNW Pressable/View; no fabricated RN events or
 * extra pressable DOM ancestor. Recheck this boundary when upgrading RN Web.
 */
import { type AriaAttributes, type ComponentRef, type CSSProperties, type Ref, type RefCallback } from "react";
import type { Pressable, PressableProps, PressableStateCallbackType } from "react-native";
import type { ButtonHeroUIWebProps } from "./types";
type ConvertedDOMProps = Omit<ButtonHeroUIWebProps, "style"> & {
    className?: string;
    style?: CSSProperties;
    "aria-busy"?: AriaAttributes["aria-busy"];
};
type InteropResult = {
    state: PressableStateCallbackType;
    ref: RefCallback<HTMLButtonElement>;
    domProps: ConvertedDOMProps;
};
export declare function useButtonWebInterop(props: PressableProps, publicRef: Ref<ComponentRef<typeof Pressable>> | undefined, webRef: Ref<HTMLButtonElement> | undefined): InteropResult;
export {};
