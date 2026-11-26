import { type ReactNode, createContext, useContext, useMemo } from "react";
import { type ColorSchemeName, useColorScheme } from "react-native";

import type { AccentThemeNames } from "./accent_theme";

export {
  defaultUiPreferences,
  resolveUiPreferences,
  type ResolvedColorScheme,
  type ColorSchemeSetting,
  type UiPreferences,
} from "./preferences";
import {
  defaultUiPreferences,
  resolveUiPreferences,
  type ResolvedColorScheme,
  type ColorSchemeSetting,
  type UiPreferences,
} from "./preferences";

export type UiPreferencesContextValue = {
  accentThemeNames: AccentThemeNames;
  error: unknown;
  isLoaded: boolean;
  isLoading: boolean;
  patchPreferences: (
    updater: (currentPreferences: UiPreferences) => UiPreferences,
  ) => Promise<void>;
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

const noopAsync = async () => undefined;

const UiPreferencesContext = createContext<UiPreferencesContextValue>({
  accentThemeNames: [],
  error: null,
  isLoaded: true,
  isLoading: false,
  patchPreferences: noopAsync,
  preferences: defaultUiPreferences,
  reload: noopAsync,
  save: noopAsync,
  setPreferences: noopAsync,
  updateAndSave: noopAsync,
});

export function UiPreferencesProvider({
  accentThemeNames,
  children,
  preferences,
}: UiPreferencesProviderProps) {
  const value = useMemo<UiPreferencesContextValue>(
    () => ({
      accentThemeNames: accentThemeNames ?? [],
      error: null,
      isLoaded: true,
      isLoading: false,
      patchPreferences: noopAsync,
      preferences: resolveUiPreferences(preferences),
      reload: noopAsync,
      save: noopAsync,
      setPreferences: noopAsync,
      updateAndSave: noopAsync,
    }),
    [accentThemeNames, preferences],
  );

  return <UiPreferencesContext.Provider value={value}>{children}</UiPreferencesContext.Provider>;
}

export function useUiPreferences() {
  return useContext(UiPreferencesContext);
}

function normalizeSystemColorScheme(colorScheme: ColorSchemeName) {
  return colorScheme === "dark" ? "dark" : "light";
}

export function resolveColorSchemeSettings(
  preferredColorScheme: ColorSchemeSetting,
  systemColorScheme: ColorSchemeName,
): ResolvedColorScheme {
  if (preferredColorScheme === "system") {
    return normalizeSystemColorScheme(systemColorScheme);
  }

  return preferredColorScheme;
}

export function useResolvedeColorScheme() {
  const systemColorScheme = useColorScheme();
  const { preferences } = useUiPreferences();
  const preferredColorScheme = preferences.appearance.themeMode;
  return resolveColorSchemeSettings(preferredColorScheme, systemColorScheme);
}

export function useColorSchemeSettings() {
  const systemColorScheme = useColorScheme();
  const {
    accentThemeNames,
    preferences,
    isLoaded,
    isLoading,
    error,
    reload,
    save,
    patchPreferences,
    updateAndSave,
  } = useUiPreferences();

  const preferredColorScheme = preferences.appearance.themeMode;
  const normalizedSystemColorScheme = normalizeSystemColorScheme(systemColorScheme);
  const resolvedColorScheme = resolveColorSchemeSettings(preferredColorScheme, systemColorScheme);

  return {
    accentThemeNames,
    error,
    isLoaded,
    isLoading,
    isSystemColorScheme: preferredColorScheme === "system",
    preferredColorScheme,
    preferences,
    reload,
    resolvedColorScheme,
    save,
    setPreferredColorScheme: (nextColorScheme: ColorSchemeSetting) => {
      return patchPreferences((currentPreferences) => ({
        ...currentPreferences,
        appearance: {
          ...currentPreferences.appearance,
          themeMode: nextColorScheme,
        },
      }));
    },
    setPreferredColorSchemeAndSave: async (nextColorScheme: ColorSchemeSetting) => {
      return updateAndSave((currentPreferences) => ({
        ...currentPreferences,
        appearance: {
          ...currentPreferences.appearance,
          themeMode: nextColorScheme,
        },
      }));
    },
    systemColorScheme: normalizedSystemColorScheme,
  };
}
