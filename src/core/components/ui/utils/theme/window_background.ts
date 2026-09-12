import { getStandardAppBackgroundColors } from "./app_background";
import type { ResolvedColorScheme } from "./settings";

export function getAppWindowBackgroundColor(colorScheme: ResolvedColorScheme): string {
  return getStandardAppBackgroundColors(colorScheme).screen;
}
