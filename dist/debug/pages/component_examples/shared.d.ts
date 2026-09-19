import { type ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
export declare function ComponentExamplePlaceholder({ children, name, status, }: {
    children?: ReactNode;
    name: string;
    status?: string;
}): import("react").JSX.Element;
export declare function InputExampleContent(): import("react").JSX.Element;
export declare function NativeListExampleContent(): import("react").JSX.Element;
export declare function ExampleStack({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function ExampleBlock({ children, description, title, }: {
    children: ReactNode;
    description?: ReactNode;
    title?: ReactNode;
}): import("react").JSX.Element;
export declare function ExampleRow({ children, style, }: {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}): import("react").JSX.Element;
