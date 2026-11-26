import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button as HeroUIButton } from "heroui-native/button";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { TextClassContext } from "../text/text_context";
import { Spinner } from "../spinner";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "../utils/cn";
import { buttonChildren, buttonDimensions, buttonTextClass } from "./button_content";
import { ButtonLoadingIcon } from "./button_loading_icon";
export const ButtonHeroUI = forwardRef(function ButtonHeroUI({ native: _, nativeMatchContents: _match, nativeButtonStyle: _buttonStyle, nativeComposeProps: _compose, nativeSwiftProps: _swift, nativeSystemImage: _image, nativeSystemImageSize: _imageSize, nativeHaptics: _haptics, herouiWebProps: _web, herouiNativeProps, buttonSize, buttonColor, circular, children, title, loading, loadingIcon, textClassName, textStyle, className, style, size = "md", variant = "primary", isIconOnly, disabled, isDisabled, onPress, onPressIn, onPressOut, onHoverIn, onHoverOut, ...props }, ref) {
    const [pressed, setPressed] = useState(false);
    const [hovered, setHovered] = useState(false);
    useEffect(() => { if (disabled || isDisabled || loading) {
        setPressed(false);
        setHovered(false);
    } }, [disabled, isDisabled, loading]);
    const platformRef = herouiNativeProps?.ref;
    const mergedRef = useCallback((node) => {
        if (typeof ref === "function")
            ref(node);
        else if (ref)
            ref.current = node;
        if (typeof platformRef === "function")
            platformRef(node);
        else if (platformRef)
            platformRef.current = node;
    }, [ref, platformRef]);
    const state = { pressed: !disabled && pressed, hovered: !disabled && hovered };
    const inherited = buttonTextClass(variant, size, true);
    const font = useDefaultTextStyle([textStyle, buttonColor == null ? undefined : { color: buttonColor }], cn(inherited, textClassName));
    const customStyle = herouiNativeProps?.style;
    return _jsx(TextClassContext.Provider, { value: inherited, children: _jsxs(HeroUIButton, { ...props, ...herouiNativeProps, ref: mergedRef, variant: variant, size: size, isIconOnly: isIconOnly, isDisabled: !!(disabled || isDisabled || loading), className: cn(circular && "rounded-full", className), style: [buttonDimensions(buttonSize), typeof style === "function" ? style(state) : style,
                typeof customStyle === "function" ? customStyle(state) : customStyle], onPress: (event) => {
                if (disabled || isDisabled || loading)
                    return;
                herouiNativeProps?.onPress?.(event);
                if (!event.defaultPrevented)
                    onPress?.(event);
            }, onPressIn: (event) => { setPressed(true); herouiNativeProps?.onPressIn?.(event); onPressIn?.(event); }, onPressOut: (event) => { setPressed(false); herouiNativeProps?.onPressOut?.(event); onPressOut?.(event); }, onHoverIn: (event) => { setHovered(true); herouiNativeProps?.onHoverIn?.(event); onHoverIn?.(event); }, onHoverOut: (event) => { setHovered(false); herouiNativeProps?.onHoverOut?.(event); onHoverOut?.(event); }, children: [loading ? loadingIcon != null ? _jsx(ButtonLoadingIcon, { children: loadingIcon }) : _jsx(Spinner, { size: "sm", color: "current" }) : null, buttonChildren(title ?? (typeof children === "function" ? children(state) : children), (child) => _jsx(HeroUIButton.Label, { className: textClassName, style: font, children: child }))] }) });
});
