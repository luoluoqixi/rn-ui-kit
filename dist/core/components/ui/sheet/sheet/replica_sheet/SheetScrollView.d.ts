import type { ScrollViewProps } from "@tamagui/scroll-view";
import React from "react";
import { type ScrollView as RNScrollView } from "react-native";
export interface SheetScrollViewProps extends ScrollViewProps {
    allowSheetDragOnScrollEdge?: boolean;
    sheetDragDisabledScrollIndicatorWidth?: number;
}
export declare const SheetScrollView: React.ForwardRefExoticComponent<SheetScrollViewProps & React.RefAttributes<RNScrollView>>;
