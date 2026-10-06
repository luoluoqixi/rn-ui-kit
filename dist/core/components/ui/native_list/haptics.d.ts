import { type ReactNode } from "react";
import type { NativeHapticsSetting } from "../utils";
export declare function NativeListHapticsProvider({ children, nativeHaptics, }: {
    children: ReactNode;
    nativeHaptics?: NativeHapticsSetting;
}): import("react").JSX.Element;
export declare function useResolvedNativeListHaptics(nativeHaptics?: NativeHapticsSetting): NativeHapticsSetting | undefined;
