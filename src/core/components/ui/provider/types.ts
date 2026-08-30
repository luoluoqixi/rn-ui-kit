import type { ComponentType, ReactNode } from "react";
import type { Theme as NavigationTheme } from "@react-navigation/native";
import type { KeyboardProviderProps } from "react-native-keyboard-controller";

import type {
  AccentThemeName,
  AccentThemeNames,
  AppBackgroundColorsConfig,
  ResolvedColorScheme,
  UiThemeConfig,
  UiPreferences,
} from "../utils/theme";
import type { ToastNativeToasterProps } from "../toast/types";

export interface UIProviderProps {
  accentThemeName?: AccentThemeName;
  accentThemeNames?: AccentThemeNames;
  children: ReactNode;
  colorScheme?: ResolvedColorScheme;
  navigationTheme?: NavigationTheme;
  /** Complete custom semantic colors for both light and dark schemes. */
  theme?: UiThemeConfig;
  defaultNativeHapticsEnabled?: boolean;
  keyboardAnimationProviderProps?: Omit<KeyboardProviderProps, "children">;
  preferences?: Partial<UiPreferences>;
  /** Application background colors used by both fixed and theme-following backgrounds. */
  appBackgroundColors?: AppBackgroundColorsConfig;
  /** Replaces the built-in Toast Toaster. */
  toaster?: ComponentType<ToastNativeToasterProps>;
  /** Props passed to the built-in or custom Toast Toaster. */
  toasterProps?: Omit<ToastNativeToasterProps, "accentThemeName">;
}

export interface RootProviderProps extends Omit<UIProviderProps, "children"> {
  children: ReactNode;
}
