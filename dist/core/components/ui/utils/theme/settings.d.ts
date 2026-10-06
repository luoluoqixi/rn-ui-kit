import { type ReactNode } from "react";
import { type ColorSchemeName } from "react-native";
import { type AccentThemeName, type AccentThemeNames } from "./accent_theme";
export type ResolvedColorScheme = "light" | "dark";
export type ColorSchemeSetting = ResolvedColorScheme | "system";
export type UiPreferences = {
    appearance: {
        accentColor: AccentThemeName;
        backgroundFollowsTheme: boolean;
        themeMode: ColorSchemeSetting;
    };
};
export type UiPreferencesContextValue = {
    accentThemeNames: AccentThemeNames;
    error: unknown;
    isLoaded: boolean;
    isLoading: boolean;
    patchPreferences: (updater: (currentPreferences: UiPreferences) => UiPreferences) => Promise<void>;
    preferences: UiPreferences;
    reload: () => Promise<void>;
    save: () => Promise<void>;
    setPreferences: (preferences: UiPreferences) => Promise<void>;
    updateAndSave: (updater: (currentPreferences: UiPreferences) => UiPreferences) => Promise<void>;
};
export type UiPreferencesProviderProps = {
    accentThemeNames?: AccentThemeNames;
    children: ReactNode;
    preferences?: Partial<UiPreferences>;
};
export declare const defaultUiPreferences: UiPreferences;
export declare function resolveUiPreferences(preferences: Partial<UiPreferences> | undefined): UiPreferences;
export declare function UiPreferencesProvider({ accentThemeNames, children, preferences, }: UiPreferencesProviderProps): import("react").JSX.Element;
export declare function useUiPreferences(): UiPreferencesContextValue;
export declare function resolveColorSchemeSettings(preferredColorScheme: ColorSchemeSetting, systemColorScheme: ColorSchemeName): ResolvedColorScheme;
export declare function useResolvedeColorScheme(): ResolvedColorScheme;
export declare function useColorSchemeSettings(): {
    accentThemeNames: AccentThemeNames;
    error: unknown;
    isLoaded: boolean;
    isLoading: boolean;
    isSystemColorScheme: boolean;
    preferredColorScheme: ColorSchemeSetting;
    preferences: UiPreferences;
    reload: () => Promise<void>;
    resolvedColorScheme: ResolvedColorScheme;
    save: () => Promise<void>;
    setPreferredColorScheme: (nextColorScheme: ColorSchemeSetting) => Promise<void>;
    setPreferredColorSchemeAndSave: (nextColorScheme: ColorSchemeSetting) => Promise<void>;
    systemColorScheme: string;
};
