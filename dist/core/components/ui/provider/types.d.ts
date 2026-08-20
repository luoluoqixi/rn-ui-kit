import type { ComponentProps, ReactNode } from "react";
import type { TamaguiProvider } from "tamagui";
import type { Theme as NavigationTheme } from "@react-navigation/native";
import type { KeyboardProviderProps } from "react-native-keyboard-controller";
import type { AccentThemeName, AccentThemeNames, ResolvedColorScheme, UiPreferences } from "../utils/theme";
export interface UIProviderProps {
    accentThemeName?: AccentThemeName;
    accentThemeNames?: AccentThemeNames;
    children: ReactNode;
    colorScheme?: ResolvedColorScheme;
    navigationTheme?: NavigationTheme;
    defaultNativeHapticsEnabled?: boolean;
    keyboardAnimationProviderProps?: Omit<KeyboardProviderProps, "children">;
    preferences?: Partial<UiPreferences>;
    tamaguiConfig: ComponentProps<typeof TamaguiProvider>["config"];
}
export interface RootProviderProps extends Omit<UIProviderProps, "children"> {
    children: ReactNode;
}
