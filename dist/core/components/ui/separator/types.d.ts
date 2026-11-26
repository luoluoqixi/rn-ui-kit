import type { Separator as NativeSeparator } from "heroui-native/separator";
import type { Separator as WebSeparator } from "@heroui/react/separator";
import type { ComponentProps } from "react";
export type SeparatorProps = {
    orientation?: "horizontal" | "vertical";
    variant?: "thin" | "thick";
    thickness?: number;
    isDecorative?: boolean;
    className?: string;
    herouiNativeProps?: Omit<ComponentProps<typeof NativeSeparator>, "className" | "orientation" | "variant" | "thickness">;
    /** Web variant controls color, whereas the shared variant controls thickness. */
    herouiWebProps?: Omit<ComponentProps<typeof WebSeparator>, "className" | "orientation" | "isDecorative">;
};
