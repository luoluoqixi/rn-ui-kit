import { getVariableValue, useTheme } from "tamagui";

export function useSeparatorColor(fallback = "#D6D9DE") {
  const theme = useTheme();
  const color = getVariableValue(theme.borderColor);

  return typeof color === "string" && color.length > 0 ? color : fallback;
}
