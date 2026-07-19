import type { GetProps, SizeTokens, TamaguiElement } from "@tamagui/core";
import type { SizableStackProps } from "@tamagui/stacks";
import * as React from "react";
import type { View } from "react-native";
import type { SliderProps, SliderTrackProps } from "./types";
export declare const SliderTrackFrame: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
    size?: any;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
declare const SliderTrack: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "transparent" | "size" | "unstyled" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & React.RefAttributes<TamaguiElement>>;
export declare const SliderActiveFrame: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
    size?: any;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
type SliderActiveProps = GetProps<typeof SliderActiveFrame>;
declare const SliderActive: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation" | "size" | "unstyled" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen"> & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
    orientation?: "horizontal" | "vertical" | undefined;
    size?: any;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
    orientation?: "horizontal" | "vertical" | undefined;
    size?: any;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
    size?: any;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & React.RefAttributes<View>>;
export declare const SliderThumbFrame: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    transparent?: boolean | undefined;
    size?: number | SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export interface SliderThumbExtraProps {
    index?: number;
}
export interface SliderThumbProps extends SizableStackProps, SliderThumbExtraProps {
}
declare const SliderThumb: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    transparent?: boolean | undefined;
    size?: number | SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "index"> & SliderThumbExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & SliderThumbExtraProps, import("@tamagui/web").StackStyleBase, {
    transparent?: boolean | undefined;
    size?: number | SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
declare const Slider: React.ForwardRefExoticComponent<SliderProps & {
    __scopeSlider?: string;
} & React.RefAttributes<unknown>> & {
    Track: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "transparent" | "size" | "unstyled" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & React.RefAttributes<TamaguiElement>>;
    TrackActive: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation" | "size" | "unstyled" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen"> & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
        orientation?: "horizontal" | "vertical" | undefined;
        size?: any;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
        orientation?: "horizontal" | "vertical" | undefined;
        size?: any;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        orientation?: "horizontal" | "vertical" | undefined;
        size?: any;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & React.RefAttributes<View>>;
    Thumb: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        transparent?: boolean | undefined;
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "index"> & SliderThumbExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & SliderThumbExtraProps, import("@tamagui/web").StackStyleBase, {
        transparent?: boolean | undefined;
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
};
declare const Track: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "transparent" | "size" | "unstyled" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & React.RefAttributes<TamaguiElement>>;
declare const Range: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation" | "size" | "unstyled" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen"> & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
    orientation?: "horizontal" | "vertical" | undefined;
    size?: any;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & {
    orientation?: "horizontal" | "vertical" | undefined;
    size?: any;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
    size?: any;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & React.RefAttributes<View>>;
declare const Thumb: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    transparent?: boolean | undefined;
    size?: number | SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "index"> & SliderThumbExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & SliderThumbExtraProps, import("@tamagui/web").StackStyleBase, {
    transparent?: boolean | undefined;
    size?: number | SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export { Range, Slider, SliderThumb, SliderTrack, SliderActive, Thumb, Track, };
export type { SliderProps, SliderActiveProps, SliderTrackProps };
