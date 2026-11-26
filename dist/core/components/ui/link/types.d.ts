import type { ComponentProps, ReactNode } from "react";
import type { LinkButton as NativeLink } from "heroui-native/link-button";
import type { Link as WebLink } from "@heroui/react/link";
import type { FieldSlotProps } from "../utils/field_types";
import type { NativeHapticsSetting } from "../utils";
export type LinkSize = "sm" | "md" | "lg";
export type LinkProps = FieldSlotProps<ComponentProps<typeof NativeLink>, ComponentProps<typeof WebLink>, "size" | "isDisabled" | "href" | "target" | "rel"> & {
    children?: ReactNode;
    href?: string;
    size?: LinkSize;
    isDisabled?: boolean;
    /** Platform-neutral activation; actual press events are in platform props. */
    onPress?: () => void;
    target?: "_self" | "_blank" | "_parent" | "_top";
    rel?: string;
    nativeHaptics?: NativeHapticsSetting;
    /** Defaults to text-accent; override the label color on both platforms. */
    labelClassName?: string;
};
