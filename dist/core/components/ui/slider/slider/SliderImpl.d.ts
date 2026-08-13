import type { TamaguiElement } from "@tamagui/core";
import * as React from "react";
import { View } from "react-native";
import type { SliderImplProps } from "./types";
export declare const SliderFrame: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
    size?: any;
    elevation?: number | import("tamagui").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const SliderImpl: React.ForwardRefExoticComponent<SliderImplProps & React.RefAttributes<View>>;
