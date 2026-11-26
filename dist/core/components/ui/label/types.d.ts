import type { Label as NativeLabel } from "heroui-native/label";
import type { Label as WebLabel } from "@heroui/react/label";
import type { ComponentProps, ReactNode, RefObject } from "react";
export type LabelProps = {
    children?: ReactNode;
    className?: string;
    textClassName?: string;
    nativeID?: string;
    htmlFor?: string;
    isRequired?: boolean;
    isInvalid?: boolean;
    isDisabled?: boolean;
    /** Native has no htmlFor. Focus the associated control when the label is pressed. */
    controlRef?: RefObject<{
        focus(): void;
    } | null>;
    herouiNativeProps?: Omit<ComponentProps<typeof NativeLabel>, "asChild" | "children" | "className" | "nativeID" | "isRequired" | "isInvalid" | "isDisabled">;
    herouiWebProps?: Omit<ComponentProps<typeof WebLabel>, "children" | "className" | "htmlFor" | "isRequired" | "isInvalid" | "isDisabled">;
    textProps?: {
        className?: string;
        herouiNativeProps?: Omit<ComponentProps<typeof NativeLabel.Text>, "children" | "className" | "nativeID">;
    };
};
