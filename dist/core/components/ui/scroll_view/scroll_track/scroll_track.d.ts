import { Animated } from "react-native";
import type { ScrollTrackOptions, ScrollTrackStyling } from "./types";
type ScrollTrackProps = Required<Pick<ScrollTrackOptions, "alwaysVisible" | "disableGestures" | "hitSlop">> & {
    contentHeight: number;
    containerHeight: number;
    onScrollToPosition: (position: number) => void;
    onHoverChange?: (hovered: boolean) => void;
    onPressChange?: (pressed: boolean) => void;
    scrollPosition: Animated.Value;
    styling: ScrollTrackStyling;
    visible: boolean;
} & Pick<ScrollTrackOptions, "onDragEnd" | "onDragStart" | "onPressEnd" | "onPressStart">;
export declare function ScrollTrack({ alwaysVisible, containerHeight, contentHeight, disableGestures, hitSlop, onDragEnd, onDragStart, onHoverChange, onPressChange, onPressEnd, onPressStart, onScrollToPosition, scrollPosition, styling, visible, }: ScrollTrackProps): import("react").JSX.Element | null;
export {};
