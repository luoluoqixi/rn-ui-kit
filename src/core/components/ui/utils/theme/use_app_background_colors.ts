import { type AppBackgroundColors, getStandardAppBackgroundColors } from "./app_background";
import { useResolvedeColorScheme, useUiPreferences } from "./settings";
import { useUiTheme } from "./ui_theme";

export function useAppBackgroundColors(): AppBackgroundColors {
  const theme = useUiTheme();
  const resolvedColorScheme = useResolvedeColorScheme();
  const { preferences } = useUiPreferences();

  if (preferences.appearance.backgroundFollowsTheme) {
    const screen = theme.background;
    return {
      screen,
      sheet: screen,
      card: theme.card,
      header: theme.muted,
    };
  }

  return getStandardAppBackgroundColors(resolvedColorScheme);
}
