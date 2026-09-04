import { ColorValue, PressableProps, StyleProp, TextStyle } from "react-native";
import { ReactNode } from "react";
import React from "react";
export type HeaderCloseButtonType = PressableProps & {
    title?: ReactNode;
    titleClassName?: string;
    titleStyle?: StyleProp<TextStyle>;
    buttonColor?: ColorValue;
};
/** 原生 Stack `headerRight`：关闭当前 True Sheet。 */
export declare function TrueSheetStackHeaderCloseButton({ title, titleClassName, titleStyle, onPress, buttonColor, ...buttonProps }: HeaderCloseButtonType): React.JSX.Element;
