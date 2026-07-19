import type { ResolvedColorScheme } from "./settings";
export type AppBackgroundLevel = "screen" | "sheet" | "card" | "header";
export type AppBackgroundColors = Record<AppBackgroundLevel, string>;
export declare function getStandardAppBackgroundColors(colorScheme: ResolvedColorScheme): AppBackgroundColors;
