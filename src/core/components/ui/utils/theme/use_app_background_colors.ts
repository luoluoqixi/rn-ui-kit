import {
  type AppBackgroundColors,
  getStandardAppBackgroundColors,
  useConfiguredAppBackgroundColors,
} from "./app_background";
import { useResolvedeColorScheme, useUiPreferences } from "./settings";
import { useUiTheme } from "./ui_theme";

export function useAppBackgroundColors(): AppBackgroundColors {
  const theme = useUiTheme();
  const resolvedColorScheme = useResolvedeColorScheme();
  const { preferences } = useUiPreferences();
  const configuredColors = useConfiguredAppBackgroundColors();

  if (configuredColors != null) {
    return configuredColors[resolvedColorScheme];
  }

  if (preferences.appearance.backgroundFollowsTheme) {
    const screen = theme.primaryBackground;
    return {
      screen,
      sheet: screen,
      card: theme.card,
      header: theme.muted,
    };
  }

  return getStandardAppBackgroundColors(resolvedColorScheme);
}
