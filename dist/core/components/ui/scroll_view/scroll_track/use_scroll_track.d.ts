import { type RefObject } from "react";
import { type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import type { ScrollTrackOptions } from "./types";
type ScrollableRef = {
    scrollTo?: (options: {
        animated?: boolean;
        x?: number;
        y?: number;
    }) => void;
};
type UseScrollTrackParams = ScrollTrackOptions & {
    horizontal?: boolean;
    onContentSizeChange?: (width: number, height: number) => void;
    onLayout?: (event: LayoutChangeEvent) => void;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    scrollRef: RefObject<ScrollableRef | null>;
};
export declare function useScrollTrack({ alwaysVisible, disableGestures, fadeOutDelay, hitSlop, horizontal, insets, minScrollDistanceToShow, onContentSizeChange, onDragEnd, onDragStart, onLayout, onPressEnd, onPressStart, onScroll, scrollRef, styling, }: UseScrollTrackParams): {
    ScrollTrack: import("react").JSX.Element;
    onContentSizeChange: (width: number, height: number) => void;
    onLayout: (event: LayoutChangeEvent) => void;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};
export {};
