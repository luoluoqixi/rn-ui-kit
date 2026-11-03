import type { ReactNode } from "react";
export type TrueSheetToolbarHeaderProps = {
    /** 是否显示返回箭头（子页为 true，根页为 false）。 */
    canGoBack?: boolean;
    headerRight?: ReactNode;
    /** 透明顶栏：保留标题和按钮，仅移除背景与分隔线。 */
    transparent?: boolean;
    onBack?: () => void;
    title: string;
};
/**
 * Android / 无 Native Stack 时的工具栏：左箭头 + 标题（对齐全屏 Expo Stack 样式，非居中三栏文字）。
 */
export declare function TrueSheetToolbarHeader({ canGoBack, headerRight, transparent, onBack, title, }: TrueSheetToolbarHeaderProps): import("react").JSX.Element;
