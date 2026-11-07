import * as React from "react";
import { StyleSheet, Text as RNText, TextInput as RNTextInput } from "react-native";
import type {
  TextProps,
  TextInputProps,
  StyleProp,
  TextStyle,
} from "react-native";
import { defaultFontStyle } from "./font_style";

const TextFontContext = React.createContext<string | undefined>(undefined);
export function TextFontProvider({
  family,
  children,
}: {
  family?: string;
  children: React.ReactNode;
}) {
  return (
    <TextFontContext.Provider value={family}>
      {children}
    </TextFontContext.Provider>
  );
}
export function useTextFontFamily(): string | undefined {
  return React.useContext(TextFontContext);
}
export function useDefaultTextStyle(
  style?: StyleProp<TextStyle>,
  className?: string,
): StyleProp<TextStyle> {
  // Web 文字 primitive 可能直接渲染 DOM，必须展开 RN 样式数组。
  return StyleSheet.flatten([defaultFontStyle(useTextFontFamily(), className), style]);
}

/** 与 RN 原语保持 props/ref 兼容，只追加可被显式 style 覆盖的默认字体。 */
export type FontText = RNText;
export const FontText = React.forwardRef<
  RNText,
  TextProps & { className?: string }
>(function FontText(props, ref) {
  const family = useTextFontFamily();
  return (
    <RNText
      {...props}
      ref={ref}
      style={[defaultFontStyle(family, props.className), props.style]}
    />
  );
});
export type FontTextInput = RNTextInput;
export const FontTextInput = React.forwardRef<
  RNTextInput,
  TextInputProps & { className?: string }
>(function FontTextInput(props, ref) {
  const family = useTextFontFamily();
  return (
    <RNTextInput
      {...props}
      ref={ref}
      style={[defaultFontStyle(family, props.className), props.style]}
    />
  );
});
