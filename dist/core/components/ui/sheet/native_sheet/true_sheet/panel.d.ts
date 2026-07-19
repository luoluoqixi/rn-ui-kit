import type { TrueSheetProps } from "@lodev09/react-native-true-sheet";
import type { ReactElement, ReactNode } from "react";
import { type ViewStyle } from "react-native";
import { type TrueSheetChromeMode } from "./sheet_chrome";
export type TrueSheetPanelProps = {
    backgroundColor?: ViewStyle["backgroundColor"];
    children: ReactNode;
    /** `plain`：仅 grabber，无顶栏；`toolbar`：自绘工具栏，无 grabber。 */
    chrome?: TrueSheetChromeMode;
    /** 原生 grabber 需要避让时，为内容区额外预留顶部占位；默认不预留，让拖拽条悬浮覆盖在内容顶部。 */
    grabberContentInsetTop?: number;
    /** 覆盖 `chrome` 默认的 grabber 行为。 */
    grabber?: boolean;
    /** 自绘 toolbar 是否透明。 */
    headerTransparent?: boolean;
    /** 自定义 header 内容，会渲染在 TrueSheet 原生 header 槽中。设置此项后 `chrome`/`title`/`canGoBack`/`headerRight` 等仍独立生效，此 header 将优先渲染。 */
    header?: ReactElement;
    name: string;
    title?: string;
    canGoBack?: boolean;
    onBack?: () => void;
    onRequestClose?: () => void;
    headerRight?: ReactNode;
    /** 当前 True Sheet 专属 overlay host 名；省略时按 `name` 自动生成。 */
    overlayPortalHostName?: string;
    onDidDismiss?: () => void;
    sheetProps?: Omit<TrueSheetProps, "children" | "header" | "name">;
};
/**
 * 简单 True Sheet：无内嵌 Stack。
 * - `chrome="plain"`：适合仅需 grabber 的轻量弹层。
 * - `chrome="toolbar"`：Android 等无法挂 Native Stack 时的标题栏 + 硬件返回。
 * - 默认以 `name` 创建独立 overlay host；传入 `overlayPortalHostName` 可覆盖名称，勿复用外层 host。
 */
export declare function TrueSheetPanel(props: TrueSheetPanelProps): import("react").JSX.Element;
