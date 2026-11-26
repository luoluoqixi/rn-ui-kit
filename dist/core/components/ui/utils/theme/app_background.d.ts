import { type ReactNode } from "react";
import type { ResolvedColorScheme } from "./settings";
export type AppBackgroundLevel = "screen" | "sheet" | "card" | "header";
export type AppBackgroundColors = Record<AppBackgroundLevel, string>;
export type AppBackgroundColorsByScheme = Record<ResolvedColorScheme, AppBackgroundColors>;
/** Container-owned background overrides, independent of the accent preference. */
export type AppBackgroundColorsConfig = Partial<Record<ResolvedColorScheme, Partial<AppBackgroundColors>>>;
export declare const STANDARD_IOS_BACKGROUND_COLORS: AppBackgroundColorsByScheme;
export { STANDARD_IOS_BACKGROUND_COLORS as defaultAppStandardAppBackgroundColors };
export declare function AppBackgroundColorsProvider({ children, colors, }: {
    children: ReactNode;
    colors?: AppBackgroundColorsConfig;
}): import("react").FunctionComponentElement<import("react").ProviderProps<Partial<Record<ResolvedColorScheme, Partial<AppBackgroundColors>>> | null>>;
export declare function useConfiguredAppBackgroundColors(): AppBackgroundColorsConfig | null;
export declare function getStandardAppBackgroundColors(colorScheme: ResolvedColorScheme): AppBackgroundColors;
export declare function resolveAppBackgroundColors(colorScheme: ResolvedColorScheme, configured?: AppBackgroundColorsConfig | null): AppBackgroundColors;
