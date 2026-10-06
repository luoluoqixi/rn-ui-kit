import { useUiTheme } from "./ui_theme";

export function useSeparatorColor(fallback = "#D6D9DE") {
  const color = useUiTheme().border;
  return color.length > 0 ? color : fallback;
}
