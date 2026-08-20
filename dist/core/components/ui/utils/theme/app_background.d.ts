import type { ResolvedColorScheme } from "./settings";
export type AppBackgroundLevel = "screen" | "sheet" | "card" | "header";
export type AppBackgroundColors = Record<AppBackgroundLevel, string>;
declare const STANDARD_IOS_BACKGROUND_COLORS: Record<ResolvedColorScheme, AppBackgroundColors>;
export { STANDARD_IOS_BACKGROUND_COLORS as defaultAppStandardAppBackgroundColors };
/**
 * 静态设置应用背景色。应在渲染 UI 之前调用。
 */
export declare function setStandardAppBackgroundColors(colors: Record<ResolvedColorScheme, AppBackgroundColors>): void;
export declare function getStandardAppBackgroundColors(colorScheme: ResolvedColorScheme): AppBackgroundColors;
