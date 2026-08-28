import type { ReactNode } from "react";
import type { Theme as NavigationTheme } from "@react-navigation/native";
import type { KeyboardProviderProps } from "react-native-keyboard-controller";

import type {
  AccentThemeName,
  AccentThemeNames,
  ResolvedColorScheme,
  UiThemeConfig,
  UiPreferences,
} from "../utils/theme";

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
}

export interface RootProviderProps extends Omit<UIProviderProps, "children"> {
  children: ReactNode;
}
