import type { ComponentProps, ReactNode } from "react";
import type { TamaguiProvider } from "tamagui";

import type {
  AccentThemeName,
  AccentThemeNames,
  ResolvedColorScheme,
  UiPreferences,
} from "../utils/theme";

export interface UIProviderProps {
  accentThemeName?: AccentThemeName;
  accentThemeNames?: AccentThemeNames;
  children: ReactNode;
  colorScheme?: ResolvedColorScheme;
  defaultNativeHapticsEnabled?: boolean;
  preferences?: Partial<UiPreferences>;
  tamaguiConfig: ComponentProps<typeof TamaguiProvider>["config"];
}

export interface RootProviderProps extends Omit<UIProviderProps, "children"> {
  children: ReactNode;
}
