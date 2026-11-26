import type { CSSProperties } from "react";
import { type StyleProp, type TextStyle } from "react-native";
/** Normalize the shared RN text-style shortcuts at the DOM boundary. */
export declare function textWebStyle(style?: StyleProp<TextStyle>): CSSProperties;
