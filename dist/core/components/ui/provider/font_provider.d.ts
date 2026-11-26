import * as React from "react";
import { Text as RNText, TextInput as RNTextInput } from "react-native";
import type { TextProps, TextInputProps, StyleProp, TextStyle } from "react-native";
export declare function TextFontProvider({ family, children, }: {
    family?: string;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useTextFontFamily(): string | undefined;
export declare function useDefaultTextStyle(style?: StyleProp<TextStyle>, className?: string): StyleProp<TextStyle>;
/** 与 RN 原语保持 props/ref 兼容，只追加可被显式 style 覆盖的默认字体。 */
export type FontText = RNText;
export declare const FontText: React.ForwardRefExoticComponent<TextProps & {
    className?: string;
} & React.RefAttributes<RNText>>;
export type FontTextInput = RNTextInput;
export declare const FontTextInput: React.ForwardRefExoticComponent<TextInputProps & {
    className?: string;
} & React.RefAttributes<RNTextInput>>;
