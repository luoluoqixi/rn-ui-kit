import type { ComponentProps, ReactNode } from "react";
import type { InputGroup as NativeGroup } from "heroui-native/input-group";
import type { InputGroup as WebGroup } from "@heroui/react/input-group";
import type { InputProps } from "../input";
import type { FieldSlotProps, TextInputOptions } from "../utils/field_types";
export type InputGroupDecoratorProps = FieldSlotProps<ComponentProps<typeof NativeGroup.Prefix>, ComponentProps<typeof WebGroup.Prefix>, "isDecorative"> & {
    isDecorative?: boolean;
};
export type InputGroupProps = TextInputOptions & FieldSlotProps<ComponentProps<typeof NativeGroup>, ComponentProps<typeof WebGroup>, "isDisabled" | "variant"> & {
    prefix?: ReactNode;
    suffix?: ReactNode;
    prefixProps?: InputGroupDecoratorProps;
    suffixProps?: InputGroupDecoratorProps;
    inputProps?: Omit<InputProps, keyof TextInputOptions>;
    inputClassName?: string;
};
