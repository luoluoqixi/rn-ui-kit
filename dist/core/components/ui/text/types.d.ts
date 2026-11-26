import type { TypographyRootProps as NativeTypographyProps, Typography as NativeTypography } from "heroui-native/text";
import type { TypographyRootProps as WebTypographyProps } from "@heroui/react/typography";
import type { ComponentProps, ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";
export type TextType = NonNullable<NativeTypographyProps["type"]>;
export type TextAlign = NonNullable<NativeTypographyProps["align"]>;
export type TextColor = NonNullable<NativeTypographyProps["color"]>;
export type TextWeight = NonNullable<NativeTypographyProps["weight"]>;
type Controlled = "children" | "className" | "type" | "align" | "color" | "weight" | "truncate";
export type TextProps = Pick<NativeTypographyProps, "type" | "align" | "color" | "weight" | "truncate"> & {
    children?: ReactNode;
    className?: string;
    /** RN text styles; DOM-only styles belong in herouiWebProps. */
    style?: StyleProp<TextStyle>;
    nativeID?: string;
    testID?: string;
    accessibilityLabel?: string;
    numberOfLines?: number;
    ellipsizeMode?: NativeTypographyProps["ellipsizeMode"];
    selectable?: boolean;
    herouiNativeProps?: Omit<ComponentProps<typeof NativeTypography>, Controlled>;
    herouiWebProps?: Omit<WebTypographyProps, Controlled>;
};
export {};
