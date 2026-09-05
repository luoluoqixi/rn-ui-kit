import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { Icon } from "../icon";
import { cn } from "../utils/cn";
import { triggerNativeHaptics } from "../utils";
import { useUiTheme } from "../utils/theme";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react-native";
import * as React from "react";
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming, } from "react-native-reanimated";
import { Platform, Pressable } from "react-native";
import { ButtonNative } from "./button_native";
const buttonVariants = cva(cn("group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none", Platform.select({
    web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
})), {
    variants: {
        variant: {
            default: cn("bg-primary active:bg-primary/90 shadow-sm shadow-black/5", Platform.select({ web: "hover:bg-primary/90" })),
            destructive: cn("bg-destructive active:bg-destructive/90 dark:bg-destructive/60 shadow-sm shadow-black/5", Platform.select({
                web: "hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
            })),
            outline: cn("border-border bg-background active:bg-accent dark:bg-input/30 dark:border-input dark:active:bg-input/50 border shadow-sm shadow-black/5", Platform.select({
                web: "hover:bg-accent dark:hover:bg-input/50 disabled:hover:bg-background disabled:active:bg-background",
            })),
            secondary: cn("bg-secondary active:bg-input shadow-sm shadow-black/5", Platform.select({ web: "hover:bg-input/70" })),
            ghost: cn("active:bg-accent dark:active:bg-accent/50", Platform.select({ web: "hover:bg-accent dark:hover:bg-accent/50" })),
            link: Platform.select({ web: "hover:opacity-80" }),
            icon: cn("bg-transparent active:bg-accent dark:active:bg-accent/50", Platform.select({ web: "hover:bg-accent dark:hover:bg-accent/50" })),
        },
        size: {
            "2xs": cn("h-8 min-w-8 gap-1 rounded-md px-2 py-1", Platform.select({ web: "has-[>svg]:px-1.5" })),
            "xs": cn("h-9 min-w-9 gap-1 rounded-md px-3 py-1.5", Platform.select({ web: "has-[>svg]:px-2" })),
            "sm": cn("h-10 min-w-10 gap-1.5 rounded-md px-4 py-2", Platform.select({ web: "has-[>svg]:px-3" })),
            "md": cn("h-11 min-w-11 px-5 py-2.5", Platform.select({ web: "has-[>svg]:px-4" })),
            // `default` remains an alias for the former default size.
            "default": cn("h-11 min-w-11 px-5 py-2.5", Platform.select({ web: "has-[>svg]:px-4" })),
            "lg": cn("h-12 min-w-12 rounded-md px-6 py-2.5", Platform.select({ web: "has-[>svg]:px-5" })),
            "xl": cn("h-14 min-w-14 gap-2.5 rounded-md px-8 py-3", Platform.select({ web: "has-[>svg]:px-6" })),
            "2xl": cn("h-16 min-w-16 gap-3 rounded-md px-10 py-4", Platform.select({ web: "has-[>svg]:px-8" })),
        },
    },
    compoundVariants: [
        { variant: "icon", size: "2xs", class: "w-8 px-0" },
        { variant: "icon", size: "xs", class: "w-9 px-0" },
        { variant: "icon", size: "sm", class: "w-10 px-0" },
        { variant: "icon", size: "md", class: "w-11 px-0" },
        { variant: "icon", size: "default", class: "w-11 px-0" },
        { variant: "icon", size: "lg", class: "w-12 px-0" },
        { variant: "icon", size: "xl", class: "w-14 px-0" },
        { variant: "icon", size: "2xl", class: "w-16 px-0" },
    ],
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
const buttonTextVariants = cva(cn("text-foreground text-sm font-medium", Platform.select({ web: "pointer-events-none transition-colors" })), {
    variants: {
        variant: {
            default: "text-primary-foreground",
            destructive: "text-white",
            outline: cn("group-active:text-accent-foreground", Platform.select({
                web: "group-hover:text-accent-foreground disabled:group-hover:text-foreground disabled:group-active:text-foreground",
            })),
            secondary: "text-secondary-foreground",
            ghost: "group-active:text-accent-foreground",
            icon: "group-active:text-accent-foreground",
            link: cn("text-primary underline underline-offset-4 group-active:opacity-70", Platform.select({ web: "group-hover:opacity-80" })),
        },
        size: {
            "2xs": "text-xs",
            "xs": "text-xs",
            "sm": "text-sm",
            "md": "text-base",
            "default": "text-base",
            "lg": "text-base",
            "xl": "text-lg",
            "2xl": "text-xl",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
function normalizeButtonChildren(children, textClassName, textStyle) {
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? (_jsx(Text, { className: textClassName, style: textStyle, children: child })) : (child));
}
function ButtonLoadingIcon({ children }) {
    const loadingRotation = useSharedValue(0);
    const loadingIconStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${loadingRotation.value}deg` }],
    }));
    React.useEffect(() => {
        loadingRotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false);
        return () => {
            cancelAnimation(loadingRotation);
            loadingRotation.value = 0;
        };
    }, [loadingRotation]);
    return (_jsx(Animated.View, { className: "pointer-events-none", style: loadingIconStyle, children: children }));
}
const Button = React.forwardRef(function Button({ buttonSize, buttonColor, children, circular, className, native, nativeMatchContents, nativeButtonStyle = "automatic", nativeComposeProps, nativeHaptics, nativeSwiftProps, nativeSystemImage, nativeSystemImageSize, loading = false, loadingIcon, onPress, size = "default", style, textClassName, textStyle, title, variant, ...props }, ref) {
    const theme = useUiTheme();
    const resolvedButtonSize = buttonSize;
    const buttonSizeStyle = resolvedButtonSize == null
        ? null
        : {
            ...(resolvedButtonSize.width == null ? {} : { width: resolvedButtonSize.width }),
            ...(resolvedButtonSize.height == null ? {} : { height: resolvedButtonSize.height }),
        };
    const resolvedTitle = title ??
        (typeof children === "string" || typeof children === "number" ? String(children) : "") ??
        "";
    const resolvedChildren = title ?? children;
    const isDisabled = props.disabled || loading;
    const nativePressableState = { hovered: false, pressed: false };
    const handlePress = (event) => {
        onPress?.(event);
        if (!event.defaultPrevented)
            triggerNativeHaptics(nativeHaptics);
    };
    if (native === true && Platform.OS !== "web") {
        if (Platform.OS === "android") {
            return (_jsx(ButtonNative, { matchContents: nativeMatchContents, androidColors: {
                    destructive: theme.destructive,
                    primary: theme.primary,
                    primaryForeground: theme.primaryForeground,
                    secondary: theme.secondary,
                    secondaryForeground: theme.secondaryForeground,
                }, buttonSize: resolvedButtonSize, buttonColor: buttonColor, children: title == null && (typeof children === "string" || typeof children === "number")
                    ? children
                    : undefined, disabled: isDisabled, nativeComposeProps: nativeComposeProps, onPress: () => handlePress({ defaultPrevented: false }), style: (typeof style === "function"
                    ? style(nativePressableState)
                    : style), title: resolvedTitle, variant: variant }));
        }
        return (_jsx(ButtonNative, { matchContents: nativeMatchContents, accessibilityLabel: props["aria-label"], androidColors: {
                destructive: theme.destructive,
                primary: theme.primary,
                primaryForeground: theme.primaryForeground,
                secondary: theme.secondary,
                secondaryForeground: theme.secondaryForeground,
            }, buttonSize: resolvedButtonSize, buttonColor: buttonColor, children: title == null && (typeof children === "string" || typeof children === "number")
                ? children
                : undefined, disabled: isDisabled, nativeButtonStyle: nativeButtonStyle, nativeOpacity: isDisabled ? 0.5 : 1, nativeSystemImage: nativeSystemImage, nativeSystemImageSize: nativeSystemImageSize, nativeSwiftProps: nativeSwiftProps, onPress: () => handlePress({ defaultPrevented: false }), style: (typeof style === "function"
                ? style(nativePressableState)
                : style), title: resolvedTitle, variant: variant }));
    }
    return (_jsx(TextClassContext.Provider, { value: cn(buttonTextVariants({ variant, size }), isDisabled && "group-hover:text-foreground group-active:text-foreground"), children: _jsxs(Pressable, { ...props, disabled: isDisabled, className: cn(isDisabled && "opacity-50", buttonVariants({ variant, size }), circular && "rounded-full", className), onPress: handlePress, ref: ref, role: "button", style: ({ pressed }) => [
                buttonSizeStyle,
                isDisabled && variant === "outline" ? { backgroundColor: theme.background } : null,
                // Keep the pre-Expo-types runtime contract: custom Button styles only receive `pressed`.
                typeof style === "function" ? style({ pressed }) : style,
                variant === "link" && pressed ? { opacity: 0.7 } : null,
                variant === "secondary" && pressed ? { backgroundColor: theme.input } : null,
            ], children: [loading ? (_jsx(ButtonLoadingIcon, { children: loadingIcon ?? _jsx(Icon, { as: Loader2, className: "size-4" }) })) : null, (typeof resolvedChildren === "function"
                    ? resolvedChildren
                    : normalizeButtonChildren(resolvedChildren, textClassName, [
                        textStyle,
                        buttonColor == null ? null : { color: buttonColor },
                    ]))] }) }));
});
export { Button, buttonTextVariants, buttonVariants };
