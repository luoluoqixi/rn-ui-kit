import type { ComponentProps, ComponentRef, ReactNode, RefAttributes } from "react";
import type { ButtonProps as ExpoSwiftUIButtonProps } from "@luoluoqixi/expo-ui-55/swift-ui";
import type { ButtonProps as ExpoComposeButtonProps } from "@luoluoqixi/expo-ui-55/jetpack-compose";
import type { SFSymbol } from "sf-symbols-typescript";
import type { ColorValue, Pressable, PressableProps, StyleProp, TextStyle } from "react-native";
import type { Button as HeroUINativeButton } from "heroui-native/button";
import type { Button as HeroUIWebButton } from "@heroui/react/button";
import type { NativeHapticsSetting } from "../utils";
export type ButtonNativeMode = boolean;
export type ButtonSize = {
    height?: number;
    width?: number;
};
export type ButtonSizeVariant = "sm" | "md" | "lg";
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger" | "danger-soft";
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type ManagedProps = "children" | "className" | "size" | "variant" | "isIconOnly" | "isDisabled" | "disabled" | "asChild";
/** Keep the feedbackVariant / animation discriminated union intact. */
type SharedEvents = "onPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut";
export type ButtonHeroUINativeProps = DistributiveOmit<ComponentProps<typeof HeroUINativeButton>, ManagedProps | SharedEvents> & Pick<PressableProps, SharedEvents>;
export type ButtonHeroUIWebProps = Omit<ComponentProps<typeof HeroUIWebButton>, ManagedProps | "isPending">;
export type ButtonNativeComposeProps = Omit<ExpoComposeButtonProps, "children" | "onClick">;
export type ButtonNativeSwiftProps = Omit<ExpoSwiftUIButtonProps, "onPress">;
export type ButtonProps = ComponentProps<typeof Pressable> & RefAttributes<ComponentRef<typeof Pressable>> & {
    /** HeroUI's built-in size; defaults to md. buttonSize still accepts exact dimensions. */
    size?: ButtonSizeVariant;
    variant?: ButtonVariant;
    isIconOnly?: boolean;
    /** Equivalent to disabled; either flag (or loading) disables activation. */
    isDisabled?: boolean;
    herouiNativeProps?: ButtonHeroUINativeProps;
    herouiWebProps?: ButtonHeroUIWebProps;
    buttonSize?: ButtonSize;
    circular?: boolean;
    /** 为 `title` 或基础类型 children 自动生成的文本设置 utility class。 */
    textClassName?: string;
    /** 为 `title` 或基础类型 children 自动生成的文本设置原生样式。 */
    textStyle?: StyleProp<TextStyle>;
    /** 设置按钮文本颜色；iOS/Android native Button 同样支持。 */
    buttonColor?: ColorValue;
    native?: ButtonNativeMode;
    nativeMatchContents?: boolean | {
        vertical?: boolean | undefined;
        horizontal?: boolean | undefined;
    };
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
export {};
