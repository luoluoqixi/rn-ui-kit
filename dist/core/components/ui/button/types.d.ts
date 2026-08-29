import type { ComponentProps, ComponentRef, ReactNode, RefAttributes } from "react";
import type { ButtonProps as ExpoSwiftUIButtonProps } from "@luoluoqixi/expo-ui-55/swift-ui";
import type { ButtonProps as ExpoComposeButtonProps } from "@luoluoqixi/expo-ui-55/jetpack-compose";
import type { SFSymbol } from "sf-symbols-typescript";
import type { VariantProps } from "class-variance-authority";
import type { Pressable } from "react-native";
import type { NativeHapticsSetting } from "../utils";
import type { buttonVariants } from "./button";
export type ButtonNativeMode = boolean;
export type ButtonSize = {
    height?: number;
    width?: number;
};
export type ButtonNativeComposeProps = Omit<ExpoComposeButtonProps, "children" | "onClick">;
export type ButtonNativeSwiftProps = Omit<ExpoSwiftUIButtonProps, "onPress">;
export type ButtonProps = ComponentProps<typeof Pressable> & RefAttributes<ComponentRef<typeof Pressable>> & VariantProps<typeof buttonVariants> & {
    buttonSize?: ButtonSize;
    circular?: boolean;
    native?: ButtonNativeMode;
    nativeButtonStyle?: "automatic" | "glass" | "glassProminent";
    nativeComposeProps?: ButtonNativeComposeProps;
    nativeHaptics?: NativeHapticsSetting;
    nativeSwiftProps?: ButtonNativeSwiftProps;
    nativeSystemImage?: SFSymbol;
    nativeSystemImageSize?: number;
    loading?: boolean;
    loadingIcon?: ReactNode;
    title?: string;
};
