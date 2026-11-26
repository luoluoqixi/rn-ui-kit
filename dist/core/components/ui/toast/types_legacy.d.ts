import type { CSSProperties, MouseEvent, ReactNode } from "react";
import type { StyleProp, TextProps, TextStyle, ViewStyle } from "react-native";
/** Project-owned compatibility options mapped by the HeroUI adapters; no Sonner dependency. */
type ToastKind = "default" | "info" | "success" | "warning" | "error" | "loading";
type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
type ToastIcons = Partial<Record<Exclude<ToastKind, "default"> | "close", ReactNode>>;
type WebAction = {
    label: ReactNode;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    actionButtonStyle?: CSSProperties;
};
type WebClasses = Partial<Record<"toast" | "content" | "title" | "description" | "icon" | "actionButton" | "cancelButton" | "closeButton", string>>;
type WebToastEvent = {
    id: string | number;
    title?: ReactNode;
    description?: ReactNode;
    type: ToastKind;
};
/** @deprecated Prefer ToastShowOptions and herouiWebProps. Only mapped legacy options remain. */
export type SonnerAdvancedOptions = {
    duration?: number;
    position?: ToastPosition;
    dismissible?: boolean;
    closeButton?: boolean;
    icon?: ReactNode;
    action?: ReactNode | WebAction;
    cancel?: ReactNode | WebAction;
    actionButtonStyle?: CSSProperties;
    cancelButtonStyle?: CSSProperties;
    className?: string;
    descriptionClassName?: string;
    classNames?: WebClasses;
    style?: CSSProperties;
    testId?: string;
    onDismiss?: (toast: WebToastEvent) => void;
    onAutoClose?: (toast: WebToastEvent) => void;
};
export type LegacyWebToasterProps = {
    position?: ToastPosition;
    duration?: number;
    offset?: number | string | Partial<Record<"top" | "bottom" | "left" | "right", number | string>>;
    visibleToasts?: number;
    gap?: number;
    expand?: boolean;
    hotkey?: string[];
    dir?: "ltr" | "rtl" | "auto";
    className?: string;
    style?: CSSProperties;
    closeButton?: boolean;
    icons?: ToastIcons;
    toastOptions?: SonnerAdvancedOptions & {
        closeButtonAriaLabel?: string;
    };
};
type NativeStyles = {
    toast?: StyleProp<ViewStyle>;
    textContainer?: StyleProp<ViewStyle>;
    title?: StyleProp<TextStyle>;
    description?: StyleProp<TextStyle>;
    buttons?: StyleProp<ViewStyle>;
    closeButton?: StyleProp<ViewStyle>;
};
type NativeAction = {
    label: string;
    onClick: () => void;
};
/** @deprecated Prefer ToastShowOptions and herouiNativeProps. Only mapped legacy options remain. */
export type SonnerNativeAdvancedOptions = Pick<TextProps, "allowFontScaling" | "maxFontSizeMultiplier"> & {
    duration?: number;
    position?: ToastPosition | "center";
    dismissible?: boolean;
    closeButton?: boolean;
    icon?: ReactNode;
    close?: ReactNode;
    jsx?: ReactNode;
    action?: ReactNode | NativeAction;
    cancel?: ReactNode | NativeAction;
    actionButtonStyle?: StyleProp<ViewStyle>;
    cancelButtonStyle?: StyleProp<ViewStyle>;
    backgroundComponent?: ReactNode;
    style?: StyleProp<ViewStyle>;
    styles?: NativeStyles;
    onPress?: () => void;
    onDismiss?: (id: string | number) => void;
    onAutoClose?: (id: string | number) => void;
};
export type LegacyNativeToasterProps = Pick<TextProps, "allowFontScaling" | "maxFontSizeMultiplier"> & {
    duration?: number;
    position?: SonnerNativeAdvancedOptions["position"];
    offset?: number;
    visibleToasts?: number;
    pauseWhenPageIsHidden?: boolean;
    closeButton?: boolean;
    icons?: ToastIcons;
    loadingIcon?: ReactNode;
    toastOptions?: {
        style?: StyleProp<ViewStyle>;
        textContainerStyle?: StyleProp<ViewStyle>;
        titleStyle?: StyleProp<TextStyle>;
        descriptionStyle?: StyleProp<TextStyle>;
        buttonsStyle?: StyleProp<ViewStyle>;
        actionButtonStyle?: StyleProp<ViewStyle>;
        cancelButtonStyle?: StyleProp<ViewStyle>;
        closeButtonStyle?: StyleProp<ViewStyle>;
        backgroundComponent?: ReactNode;
    };
};
export {};
