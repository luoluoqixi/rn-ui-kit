import { type ComponentProps } from "react";
import type { Input as NativeInput } from "heroui-native/input";
import type { TextInputOptions } from "../utils/field_types";
import type { InputProps } from "./types";
export declare function useNativeInputProps(props: TextInputOptions, nativeProps: InputProps["herouiNativeProps"], className?: string): ComponentProps<typeof NativeInput>;
