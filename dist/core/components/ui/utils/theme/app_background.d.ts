import { type ReactNode } from "react";
import type { ResolvedColorScheme } from "./settings";
export type AppBackgroundLevel = "screen" | "sheet" | "card" | "header";
export type AppBackgroundColors = Record<AppBackgroundLevel, string>;
export type AppBackgroundColorsByScheme = Record<ResolvedColorScheme, AppBackgroundColors>;
/** 分别配置 backgroundFollowsTheme=true 和 false 时使用的应用背景。 */
export type AppBackgroundColorsConfig = {
    /** backgroundFollowsTheme=false 时的覆盖色；未配置时使用标准默认色。 */
    false?: AppBackgroundColorsByScheme;
    /** backgroundFollowsTheme=true 时的覆盖色；未配置时使用当前 UI 主题色。 */
    true?: AppBackgroundColorsByScheme;
};
export declare const STANDARD_IOS_BACKGROUND_COLORS: AppBackgroundColorsByScheme;
export { STANDARD_IOS_BACKGROUND_COLORS as defaultAppStandardAppBackgroundColors };
export declare function AppBackgroundColorsProvider({ children, colors, }: {
    children: ReactNode;
    colors?: AppBackgroundColorsConfig;
}): import("react").FunctionComponentElement<import("react").ProviderProps<AppBackgroundColorsConfig | null>>;
export declare function useConfiguredAppBackgroundColors(): AppBackgroundColorsConfig | null;
export declare function getStandardAppBackgroundColors(colorScheme: ResolvedColorScheme): AppBackgroundColors;
