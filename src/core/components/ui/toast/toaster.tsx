import { BasicToaster } from "./toast_basic";
import type { AccentThemeName } from "../utils/theme";
import type { ToastNativeToasterProps } from "./types";

export function Toaster(
  props: Omit<ToastNativeToasterProps, "accentThemeName"> & { accentThemeName?: AccentThemeName },
) {
  return <BasicToaster {...props} />;
}
