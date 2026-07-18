import "rn_ui_kit/initialize";

import "./tamagui.generated.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AppStatusBar,
  RootProvider,
  RnUiKitDebugPanel,
  type UiPreferences,
  useColorSchemeSettings,
} from "rn_ui_kit";
import { useEffect, useMemo, useState } from "react";

import config from "./tamagui.config";
import { accentThemeNames } from "./themes";
import { createAppDebugPages } from "./debug_pages";

const PREFERENCES_STORAGE_KEY = "rn_ui_kit_example.preferences.v1";
const defaultPreferences = {
  appearance: {
    accentColor: "ocean",
    backgroundFollowsTheme: false,
    themeMode: "system",
  },
} satisfies UiPreferences;

type StoredPreferences = {
  appearance?: Partial<UiPreferences["appearance"]>;
};

function parseStoredPreferences(value: string | null): UiPreferences | null {
  if (value == null) return null;

  try {
    const stored = JSON.parse(value) as StoredPreferences;
    const appearance = stored.appearance;
    if (appearance == null || typeof appearance !== "object") return null;

    const accentColor =
      typeof appearance.accentColor === "string" &&
      (accentThemeNames as readonly string[]).includes(appearance.accentColor)
        ? appearance.accentColor
        : defaultPreferences.appearance.accentColor;
    const themeMode =
      appearance.themeMode === "light" ||
      appearance.themeMode === "dark" ||
      appearance.themeMode === "system"
        ? appearance.themeMode
        : defaultPreferences.appearance.themeMode;
    const backgroundFollowsTheme =
      typeof appearance.backgroundFollowsTheme === "boolean"
        ? appearance.backgroundFollowsTheme
        : defaultPreferences.appearance.backgroundFollowsTheme;

    return {
      appearance: {
        accentColor,
        backgroundFollowsTheme,
        themeMode,
      },
    };
  } catch {
    return null;
  }
}

function DemoStatusBar() {
  const { resolvedColorScheme } = useColorSchemeSettings();

  return <AppStatusBar colorScheme={resolvedColorScheme} />;
}

export default function App() {
  const [currentPreferences, setCurrentPreferences] =
    useState<UiPreferences>(defaultPreferences);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(PREFERENCES_STORAGE_KEY)
      .then((storedValue) => {
        if (!active) return;
        const storedPreferences = parseStoredPreferences(storedValue);
        if (storedPreferences != null) setCurrentPreferences(storedPreferences);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setPreferencesLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(currentPreferences)).catch(
      () => undefined,
    );
  }, [currentPreferences, preferencesLoaded]);

  const pages = useMemo(
    () => createAppDebugPages(currentPreferences, (updater) => setCurrentPreferences(updater)),
    [currentPreferences],
  );

  return (
    <RootProvider
      accentThemeNames={accentThemeNames}
      preferences={currentPreferences}
      tamaguiConfig={config}
    >
      <DemoStatusBar />
      <RnUiKitDebugPanel pages={pages} />
    </RootProvider>
  );
}
