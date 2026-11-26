import type { TrueSheetProps } from "@lodev09/react-native-true-sheet";
import type { ParamListBase } from "@react-navigation/native";
import { type ReactNode } from "react";
import type { NativeSheetStackHeaderButtonProps, NativeSheetStackHeaderLeftItems, NativeSheetStackHeaderRightItems } from "../types";
import { type TrueSheetStackNavigationRef } from "./stack_navigation";
import { type TrueSheetInnerStackScreenOptions } from "./stack_navigator";
export type TrueSheetStackHostProps<ParamList extends ParamListBase = ParamListBase> = {
    children: ReactNode;
    /** 当前 True Sheet Stack 宿主专属 overlay host；省略时按 `name` 自动生成。 */
    overlayPortalHostName?: string;
    /** Android/Web Stack Header 左侧 React 内容。 */
    headerLeft?: TrueSheetInnerStackScreenOptions["headerLeft"];
    headerLeftButtonProps?: NativeSheetStackHeaderButtonProps;
    headerLeftItems?: NativeSheetStackHeaderLeftItems;
    /** Android/Web Stack Header 右侧 React 内容。 */
    headerRight?: TrueSheetInnerStackScreenOptions["headerRight"];
    headerRightButtonProps?: NativeSheetStackHeaderButtonProps;
    headerRightButtonVisible?: boolean;
    headerRightItems?: NativeSheetStackHeaderRightItems;
    /** 关闭 Sheet 时重置栈到该路由名 */
    initialRouteName?: keyof ParamList & string;
    name: string;
    navigationRef?: TrueSheetStackNavigationRef<ParamList>;
    onDidDismiss?: () => void;
    onDidPresent?: () => void;
    onRequestClose?: () => void;
    screenOptions?: TrueSheetInnerStackScreenOptions;
    /** 透传 TrueSheet 属性（不含 name / children / header） */
    sheetProps?: Omit<TrueSheetProps, "children" | "header" | "name">;
};
export declare function TrueSheetStackHost<ParamList extends ParamListBase = ParamListBase>(props: TrueSheetStackHostProps<ParamList>): import("react").JSX.Element;
