import { type ReactNode, createContext, createElement, useContext } from "react";

import type { ResolvedColorScheme } from "./settings";

export type AppBackgroundLevel = "screen" | "sheet" | "card" | "header";

export type AppBackgroundColors = Record<AppBackgroundLevel, string>;

export const STANDARD_IOS_BACKGROUND_COLORS: Record<ResolvedColorScheme, AppBackgroundColors> = {
  light: {
    screen: "#F2F2F7",
    sheet: "#F2F2F7",
    card: "#FFFFFF",
    header: "#F7F7FA",
  },
  dark: {
    screen: "#0e0e0e",
    sheet: "#0e0e0e",
    card: "#1C1C1E",
    header: "#1C1C1E",
  },
};

export { STANDARD_IOS_BACKGROUND_COLORS as defaultAppStandardAppBackgroundColors };

export type AppBackgroundColorsConfig = Record<ResolvedColorScheme, AppBackgroundColors>;

const AppBackgroundColorsContext = createContext<AppBackgroundColorsConfig | null>(null);

export function AppBackgroundColorsProvider({
  children,
  colors,
}: {
  children: ReactNode;
  colors?: AppBackgroundColorsConfig;
}) {
  return createElement(AppBackgroundColorsContext.Provider, { value: colors ?? null }, children);
}

export function useConfiguredAppBackgroundColors(): AppBackgroundColorsConfig | null {
  return useContext(AppBackgroundColorsContext);
}

export function getStandardAppBackgroundColors(
  colorScheme: ResolvedColorScheme,
): AppBackgroundColors {
  return STANDARD_IOS_BACKGROUND_COLORS[colorScheme];
}
