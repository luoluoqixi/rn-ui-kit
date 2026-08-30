import "rn-ui-kit/initialize";

import "./global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  accentThemeNames,
  AppStatusBar,
  RootProvider,
  type UiPreferences,
  useColorSchemeSettings,
} from "rn-ui-kit";
import { RnUiKitDebugPanel } from "rn-ui-kit/debug";
import { useEffect, useMemo, useState } from "react";

import { createAppDebugPages } from "./debug_pages";

const PREFERENCES_STORAGE_KEY = "rn-ui-kit_example.preferences.v1";
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

const Stack = createNativeStackNavigator();

function parseStoredPreferences(value: string | null): UiPreferences | null {
  if (value == null) return null;

  try {
    const stored = JSON.parse(value) as StoredPreferences;
    const appearance = stored.appearance;
    if (appearance == null || typeof appearance !== "object") return null;

    const accentColor =
      typeof appearance.accentColor === "string" &&
      ((accentThemeNames as readonly string[]).includes(appearance.accentColor) ||
        /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(appearance.accentColor))
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
  const [currentPreferences, setCurrentPreferences] = useState<UiPreferences>(defaultPreferences);
  const [usesHostNavigation, setUsesHostNavigation] = useState(true);
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

    console.log("rn-ui-kit inited.");

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
    () =>
      createAppDebugPages(
        currentPreferences,
        (updater) => setCurrentPreferences(updater),
        usesHostNavigation,
        setUsesHostNavigation,
      ),
    [currentPreferences, usesHostNavigation],
  );

  return (
    <RootProvider accentThemeNames={accentThemeNames} preferences={currentPreferences}>
      <DemoStatusBar />
      {usesHostNavigation ? (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="debug">
              {() => <RnUiKitDebugPanel navigationMode="host" pages={pages} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <RnUiKitDebugPanel pages={pages} />
      )}
    </RootProvider>
  );
}
