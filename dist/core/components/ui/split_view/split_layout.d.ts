import React from "react";
import { View } from "react-native";
import { SplitLayoutProvider } from "./split_layout_provider";
import { type SplitLayoutHandle, type SplitLayoutMobileHandleOffsets, type SplitLayoutMobileHandlePosition, type SplitLayoutMobileHandlePositions, SplitLayoutPriority, type SplitLayoutState } from "./types";
export declare const SplitLayout: React.ForwardRefExoticComponent<import("./types").SplitLayoutCommonProps & {
    children: React.ReactNode;
    defaultSizes?: number[];
    mobileHandleOffset?: number;
    mobileHandlePosition?: SplitLayoutMobileHandlePosition;
    mobileHandleOffsets?: SplitLayoutMobileHandleOffsets;
    mobileHandlePositions?: SplitLayoutMobileHandlePositions;
    proportionalLayout?: boolean;
    separator?: boolean;
    storageKey?: string;
    storageAdapter?: import("..").UiStorageAdapter;
    storageFallbackState?: SplitLayoutState;
    vertical?: boolean;
    onChange?: (sizes: number[]) => void;
    onDragEnd?: (sizes: number[]) => void;
    onDragStart?: (sizes: number[]) => void;
    onReset?: () => void;
    onStateChange?: (state: SplitLayoutState) => void;
    onVisibleChange?: (index: number, visible: boolean) => void;
} & React.RefAttributes<SplitLayoutHandle>> & {
    Pane: React.ForwardRefExoticComponent<import("./types").SplitLayoutCommonProps & {
        children: React.ReactNode;
        preferredSize?: number | string;
        priority?: SplitLayoutPriority;
        visible?: boolean;
    } & React.RefAttributes<View>>;
    Provider: typeof SplitLayoutProvider;
};
