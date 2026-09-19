import type { TextProps } from "../text";
import type { NativeHapticsSetting } from "../utils";
export type LinkProps = TextProps & {
    href?: string;
    nativeHaptics?: NativeHapticsSetting;
    pressStyle?: object;
};
