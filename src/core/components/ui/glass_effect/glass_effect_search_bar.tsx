import { Search, X } from "@tamagui/lucide-icons-2";
import { createElement, forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type TextInputProps,
  useColorScheme,
} from "react-native";

import { Button } from "../button";
import { isIos26Plus } from "../utils/platform";
import { GlassEffect } from "./glass_effect";
import type {
  GlassEffectSearchBarProps,
  GlassEffectSearchBarTrailing,
  GlassEffectSearchBarTrailingContext,
} from "./types";

const WEB_INPUT_STYLE: StyleProp<TextStyle> =
  Platform.OS === "web"
    ? ({
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        boxShadow: "none",
        outlineColor: "transparent",
        outlineStyle: "none",
        outlineWidth: 0,
      } as unknown as TextStyle)
    : undefined;

/**
 * 固定浮动搜索栏。未聚焦时搜索面板占满容器；聚焦后才渲染取消按钮。
 * iOS 26+ 的默认取消按钮使用本库 Button 的 SwiftUI 路径。
 */
export const GlassEffectSearchBar = forwardRef<TextInput, GlassEffectSearchBarProps>(
  function GlassEffectSearchBar(
    {
      cancelButtonAccessibilityLabel = "取消搜索",
      cancelButtonContainerStyle,
      cancelButtonProps,
      cancelButtonStyle,
      clearOnCancel = true,
      dismissKeyboardOnCancel = true,
      focused: focusedProp,
      inputColor,
      inputProps,
      inputStyle,
      keyboardAvoidance = true,
      onCancel,
      onFocusChange,
      placeholder = "搜索",
      placeholderTextColor,
      searchIcon,
      searchIconColor,
      searchStyle,
      style,
      focusedTrailing,
      unfocusedTrailing,
      ...glassProps
    },
    forwardedRef,
  ) {
    const inputRef = useRef<TextInput>(null);
    const [uncontrolledFocused, setUncontrolledFocused] = useState(false);
    const focused = focusedProp ?? uncontrolledFocused;
    const dark = useColorScheme() === "dark";
    const textColor = inputColor ?? (dark ? "#f5f5f7" : "#111114");
    const secondaryColor = placeholderTextColor ?? (dark ? "#b7b7bd" : "#65656b");

    useImperativeHandle(forwardedRef, () => inputRef.current as TextInput, []);

    const setFocusState = (nextFocused: boolean) => {
      if (focusedProp == null) {
        setUncontrolledFocused(nextFocused);
      }
      onFocusChange?.(nextFocused);
    };

    const handleFocus: NonNullable<TextInputProps["onFocus"]> = (event) => {
      setFocusState(true);
      inputProps?.onFocus?.(event);
    };

    const handleBlur: NonNullable<TextInputProps["onBlur"]> = (event) => {
      setFocusState(false);
      inputProps?.onBlur?.(event);
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
    const trailingContext: GlassEffectSearchBarTrailingContext = {
      cancel: handleCancel,
      focused,
      inputRef,
    };
    const trailing = focused ? focusedTrailing : unfocusedTrailing;
    const usesNativeCancelButton = isIos26Plus();
    const defaultFocusedTrailing = (
      <View style={[styles.cancelButtonContainer, cancelButtonContainerStyle]}>
        <Button
          circular={!usesNativeCancelButton}
          {...cancelButtonProps}
          aria-label={cancelButtonAccessibilityLabel}
          native={usesNativeCancelButton ? "swift-ui" : false}
          nativeButtonStyle={usesNativeCancelButton ? (cancelButtonStyle ?? "glass") : undefined}
          nativeSystemImage={usesNativeCancelButton ? "xmark" : undefined}
          nativeSystemImageSize={cancelButtonProps?.nativeSystemImageSize ?? 22}
          buttonSize={cancelButtonProps?.buttonSize ?? { height: 40, width: 40 }}
          onPress={handleCancel}
          style={cancelButtonProps?.style}
          title={cancelButtonProps?.title ?? "×"}
        >
          {usesNativeCancelButton ? undefined : <X size={24} />}
        </Button>
      </View>
    );

    return (
      <GlassEffect
        glassEffectStyle="none"
        keyboardAvoidance={keyboardAvoidance}
        pointerEvents="box-none"
        style={[styles.row, style]}
      >
        <GlassEffect
          {...glassProps}
          style={[styles.searchSurface, searchStyle]}
          testID={glassProps.testID ?? "glass-effect-search-toolbar"}
        >
          {searchIcon ?? <Search color={(searchIconColor ?? secondaryColor) as any} size={22} />}
          <TextInput
            {...inputProps}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            placeholderTextColor={secondaryColor}
            ref={inputRef}
            returnKeyType={inputProps?.returnKeyType ?? "search"}
            style={[
              styles.input,
              WEB_INPUT_STYLE,
              { color: textColor },
              inputProps?.style,
              inputStyle,
            ]}
          />
        </GlassEffect>
        {renderTrailing(focused ? (trailing ?? defaultFocusedTrailing) : trailing, trailingContext)}
      </GlassEffect>
    );
  },
);

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

function renderTrailing(
  trailing: GlassEffectSearchBarTrailing | undefined,
  context: GlassEffectSearchBarTrailingContext,
) {
  if (trailing === false || trailing == null) {
    return null;
  }
  return typeof trailing === "function" ? createElement(trailing, context) : trailing;
}
