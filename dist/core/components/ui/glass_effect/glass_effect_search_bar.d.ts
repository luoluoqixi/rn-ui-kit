import { TextInput } from "react-native";
import type { GlassEffectSearchBarProps } from "./types";
/**
 * 固定浮动搜索栏。未聚焦时搜索面板占满容器；聚焦后才渲染取消按钮。
 * iOS 26+ 的默认取消按钮使用本库 Button 的 SwiftUI 路径。
 */
export declare const GlassEffectSearchBar: import("react").ForwardRefExoticComponent<Omit<GlassEffectSearchBarProps, "ref"> & import("react").RefAttributes<TextInput>>;
