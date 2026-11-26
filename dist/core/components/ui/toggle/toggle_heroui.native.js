import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "heroui-native/button";
import { useThemeColor } from "heroui-native/hooks";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { useHasDefaultThemeBackground } from "heroui-native/theme-background";
import { colorKit } from "heroui-native/utils";
import { Children, useState } from "react";
import { TextClassContext } from "../text";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
function withScaleSetting(animation, disabled) {
    // Global animation opt-outs (including reduced motion in HeroUI) still win.
    if (disabled === undefined || animation === false || typeof animation === "string")
        return animation;
    return {
        ...(typeof animation === "object" ? animation : {}),
        scale: disabled ? false : typeof animation === "object" && "scale" in animation && typeof animation.scale === "object" ? animation.scale : undefined,
    };
}
function separateColorFeedback(p, color, activated) {
    const props = p.herouiNativeProps;
    if (props?.feedbackVariant === "none")
        return { buttonProps: props };
    const animation = withScaleSetting(props?.animation, p.isScaleDisabled);
    // Keep color feedback in a separate visibility layer without replacing Button,
    // its focus/ref, or its scale animation. Use only public HeroUI compound parts.
    // Keep animated styles attached: Reanimated retains their native opacity when
    // detached, overriding a static opacity=0 after a held press. Hide only the
    // decorative drawing with display, leaving the ripple touch container active.
    const buttonProps = { ...props, feedbackVariant: "scale", animation };
    if (props?.feedbackVariant === "scale" || animation === false || typeof animation === "string")
        return { buttonProps };
    if (props?.feedbackVariant === "scale-ripple") {
        const ripple = typeof props.animation === "object" ? props.animation.ripple : undefined;
        const config = typeof ripple === "object" ? ripple : undefined;
        return { buttonProps, overlay: ripple === false || ripple === "disabled" ? undefined : (_jsx(PressableFeedback.Ripple, { styles: activated ? { ripple: { display: "none" } } : undefined, animation: { ...config,
                    backgroundColor: { value: color, ...config?.backgroundColor }, opacity: { value: [0, 1, 0], ...config?.opacity } } }, p.isSelected ? "selected-ripple" : "ripple")) };
    }
    const highlight = typeof props?.animation === "object" ? props.animation.highlight : undefined;
    const config = typeof highlight === "object" ? highlight : undefined;
    return { buttonProps, overlay: highlight === false || highlight === "disabled" ? undefined : (_jsx(PressableFeedback.Highlight, { style: activated ? { display: "none" } : undefined, animation: { ...config,
                backgroundColor: { value: color, ...config?.backgroundColor }, opacity: { value: [0, 1], ...config?.opacity } } }, p.isSelected ? "selected-highlight" : "highlight")) };
}
export function ToggleHeroUI(p) {
    const [activated, setActivated] = useState(false);
    const [selectedColor, defaultHover] = useThemeColor(["accent-soft-hover", "default-hover"]);
    const hasThemeBackground = useHasDefaultThemeBackground();
    // Match HeroUI Button's secondary/ghost feedback, including glass themes.
    const unselectedColor = p.variant === "ghost"
        ? colorKit.setAlpha(defaultHover, hasThemeBackground ? 0.05 : 0.3).hex()
        : hasThemeBackground ? colorKit.setAlpha(defaultHover, 0.2).hex() : defaultHover;
    const feedback = separateColorFeedback(p, p.isSelected ? selectedColor : unselectedColor, activated);
    const haptics = useResolvedNativeHaptics(p.nativeHaptics, { defaultEnabled: true });
    const labelClass = cn(p.isSelected ? "text-accent-soft-foreground" : "text-foreground", p.labelClassName);
    const font = useDefaultTextStyle(undefined, labelClass);
    const content = resolveRenderProp(p.title, { isSelected: !!p.isSelected, isDisabled: !!p.isDisabled }) ?? p.children;
    return _jsx(TextClassContext.Provider, { value: labelClass, children: _jsxs(Button, { ...feedback.buttonProps, size: p.size, isIconOnly: p.isIconOnly, isDisabled: p.isDisabled, variant: p.variant === "ghost" ? "ghost" : "secondary", className: cn("self-start", p.isSelected && "bg-accent-soft", p.className), accessibilityLabel: p.accessibilityLabel, accessibilityRole: "button", accessibilityState: { selected: !!p.isSelected, disabled: !!p.isDisabled }, "aria-pressed": !!p.isSelected, onPressIn: event => {
                setActivated(false);
                const onPressIn = p.herouiNativeProps?.onPressIn;
                if (typeof onPressIn === "function")
                    onPressIn(event);
            }, onPress: () => {
                if (p.isDisabled)
                    return;
                // Finish this gesture's color feedback in the same render as selection.
                // Only a new press-in re-arms it; a delayed press-out must not re-arm it.
                setActivated(true);
                triggerNativeHaptics(haptics);
                p.onSelectedChange?.(!p.isSelected);
            }, children: [feedback.overlay, Children.map(content, child => typeof child === "string" || typeof child === "number"
                    ? _jsx(Button.Label, { className: labelClass, style: font, children: child }) : child)] }) });
}
