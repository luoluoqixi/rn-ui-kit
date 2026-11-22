import type { ContextMenuNative as NativeImplementation } from "./context_menu_native.native";

/** System-native compound helpers are available only on iOS / Android. */
export const ContextMenuNative = (() => null) as unknown as typeof NativeImplementation;
