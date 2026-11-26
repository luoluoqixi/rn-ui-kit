import {
  type AppBackgroundColors,
  resolveAppBackgroundColors,
  useConfiguredAppBackgroundColors,
} from "./app_background";
import { useUiColorScheme } from "./ui_theme";

export function useAppBackgroundColors(): AppBackgroundColors {
  return resolveAppBackgroundColors(useUiColorScheme(), useConfiguredAppBackgroundColors());
}
