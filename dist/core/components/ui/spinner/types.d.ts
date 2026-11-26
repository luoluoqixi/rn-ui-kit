import type { Spinner as NativeSpinner } from "heroui-native/spinner";
import type { Spinner as WebSpinner } from "@heroui/react/spinner";
import type { ComponentProps } from "react";
export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerColor = "accent" | "current" | "success" | "warning" | "danger";
export type SpinnerProps = {
    size?: SpinnerSize | number;
    color?: SpinnerColor | (string & {});
    isLoading?: boolean;
    className?: string;
    accessibilityLabel?: string;
    herouiNativeProps?: Omit<ComponentProps<typeof NativeSpinner>, "size" | "color" | "isLoading" | "className" | "children">;
    herouiWebProps?: Omit<ComponentProps<typeof WebSpinner<"span">>, "size" | "color" | "className" | "children">;
    indicatorProps?: {
        herouiNativeProps?: Omit<ComponentProps<typeof NativeSpinner.Indicator>, "children">;
    };
};
