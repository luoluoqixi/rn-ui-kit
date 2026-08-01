import { type AppBackgroundColors, getStandardAppBackgroundColors } from "./app_background";
import { useResolvedeColorScheme, useUiPreferences } from "./settings";
import { useTheme } from "./use_theme";

export function useAppBackgroundColors(): AppBackgroundColors {
  const theme = useTheme();
  const resolvedColorScheme = useResolvedeColorScheme();
  const { preferences } = useUiPreferences();

  if (preferences.appearance.backgroundFollowsTheme) {
    const screen =
      theme.background?.val ?? getStandardAppBackgroundColors(resolvedColorScheme).screen;
    return {
      screen,
      sheet: screen,
      card: theme.color2?.val ?? screen,
      header: theme.color1?.val ?? screen,
    };
  }

  return getStandardAppBackgroundColors(resolvedColorScheme);
}
