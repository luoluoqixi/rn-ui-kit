import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search, X } from "@tamagui/lucide-icons-2";
import { createElement, forwardRef, useImperativeHandle, useRef, useState, } from "react";
import { Keyboard, Platform, StyleSheet, TextInput, View, useColorScheme, } from "react-native";
import { Button } from "../button";
import { isIos26Plus } from "../utils/platform";
import { GlassEffect } from "./glass_effect";
const WEB_INPUT_STYLE = Platform.OS === "web"
    ? {
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        boxShadow: "none",
        outlineColor: "transparent",
        outlineStyle: "none",
        outlineWidth: 0,
    }
    : undefined;
/**
 * 固定浮动搜索栏。未聚焦时搜索面板占满容器；聚焦后才渲染取消按钮。
 * iOS 26+ 的默认取消按钮使用本库 Button 的 SwiftUI 路径。
 */
export const GlassEffectSearchBar = forwardRef(function GlassEffectSearchBar({ cancelButtonAccessibilityLabel = "取消搜索", cancelButtonContainerStyle, cancelButtonProps, cancelButtonStyle, clearOnCancel = true, dismissKeyboardOnCancel = true, focused: focusedProp, inputColor, inputProps, inputStyle, keyboardAvoidance = true, keyboardHiddenConfirmation, onCancel, onFocusChange, placeholder = "搜索", placeholderTextColor, searchIcon, searchIconColor, searchStyle, style, focusedTrailing, unfocusedTrailing, ...glassProps }, forwardedRef) {
    const inputRef = useRef(null);
    const [uncontrolledFocused, setUncontrolledFocused] = useState(false);
    const focused = focusedProp ?? uncontrolledFocused;
    const focusStateRef = useRef(focused);
    focusStateRef.current = focused;
    const dark = useColorScheme() === "dark";
    const textColor = inputColor ?? (dark ? "#f5f5f7" : "#111114");
    const secondaryColor = placeholderTextColor ?? (dark ? "#b7b7bd" : "#65656b");
    useImperativeHandle(forwardedRef, () => inputRef.current, []);
    const setFocusState = (nextFocused) => {
        if (focusStateRef.current === nextFocused) {
            return;
        }
        focusStateRef.current = nextFocused;
        if (focusedProp == null) {
            setUncontrolledFocused(nextFocused);
        }
        onFocusChange?.(nextFocused);
    };
    const handleFocus = (event) => {
        setFocusState(true);
        inputProps?.onFocus?.(event);
    };
    const handleBlur = (event) => {
        inputProps?.onBlur?.(event);
    };
    const handlePressIn = (event) => {
        // Android back hides the IME without blurring the TextInput, so tapping an
        // already-focused input must restore the keyboard-dependent toolbar state.
        setFocusState(true);
        inputProps?.onPressIn?.(event);
    };
    const handleCancel = () => {
        setFocusState(false);
        if (clearOnCancel) {
            inputProps?.onChangeText?.("");
        }
        inputRef.current?.blur();
        if (dismissKeyboardOnCancel) {
            Keyboard.dismiss();
        }
        onCancel?.();
    };
    const trailingContext = {
        cancel: handleCancel,
        focused,
        inputRef,
    };
    const trailing = focused ? focusedTrailing : unfocusedTrailing;
    const usesNativeCancelButton = isIos26Plus();
    const defaultFocusedTrailing = (_jsx(View, { style: [styles.cancelButtonContainer, cancelButtonContainerStyle], children: _jsx(Button, { circular: !usesNativeCancelButton, ...cancelButtonProps, "aria-label": cancelButtonAccessibilityLabel, native: usesNativeCancelButton ? "swift-ui" : false, nativeButtonStyle: usesNativeCancelButton ? (cancelButtonStyle ?? "glass") : undefined, nativeSystemImage: usesNativeCancelButton ? "xmark" : undefined, nativeSystemImageSize: cancelButtonProps?.nativeSystemImageSize ?? 22, buttonSize: cancelButtonProps?.buttonSize ?? {
                height: usesNativeCancelButton ? 40 : 50,
                width: usesNativeCancelButton ? 40 : 50,
            }, onPress: handleCancel, style: cancelButtonProps?.style, title: cancelButtonProps?.title ?? "×", children: usesNativeCancelButton ? undefined : _jsx(X, { size: 24 }) }) }));
    return (_jsxs(GlassEffect, { glassEffectStyle: "none", keyboardAvoidance: keyboardAvoidance, keyboardHiddenConfirmation: keyboardHiddenConfirmation, onKeyboardHidden: () => setFocusState(false), pointerEvents: "box-none", style: [styles.row, style], children: [_jsxs(GlassEffect, { ...glassProps, style: [styles.searchSurface, searchStyle], testID: glassProps.testID ?? "glass-effect-search-toolbar", children: [searchIcon ?? _jsx(Search, { color: (searchIconColor ?? secondaryColor), size: 22 }), _jsx(TextInput, { ...inputProps, onBlur: handleBlur, onFocus: handleFocus, onPressIn: handlePressIn, placeholder: placeholder, placeholderTextColor: secondaryColor, ref: inputRef, returnKeyType: inputProps?.returnKeyType ?? "search", style: [
                            styles.input,
                            WEB_INPUT_STYLE,
                            { color: textColor },
                            inputProps?.style,
                            inputStyle,
                        ] })] }), renderTrailing(focused ? (trailing ?? defaultFocusedTrailing) : trailing, trailingContext)] }));
});
const styles = StyleSheet.create({
    cancelButtonContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        flex: 1,
        fontSize: 16,
        minHeight: 40,
        minWidth: 0,
        paddingHorizontal: 4,
        paddingVertical: 0,
    },
    row: {
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        zIndex: 20,
    },
    searchSurface: {
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        gap: 8,
        minHeight: 52,
        paddingHorizontal: 16,
    },
});
function renderTrailing(trailing, context) {
    if (trailing === false || trailing == null) {
        return null;
    }
    return typeof trailing === "function" ? createElement(trailing, context) : trailing;
}
