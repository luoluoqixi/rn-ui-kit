import { Animated } from "react-native";
import type { ScrollTrackOptions, ScrollTrackStyling } from "./types";
type Axis = "horizontal" | "vertical";
type ScrollTrackProps = Required<Pick<ScrollTrackOptions, "alwaysVisible" | "disableGestures" | "hitSlop">> & {
    axis: Axis;
    containerSize: number;
    contentSize: number;
    onHoverChange?: (hovered: boolean) => void;
    onPressChange?: (pressed: boolean) => void;
    onScrollToPosition: (axis: Axis, position: number) => void;
    scrollPosition: Animated.Value;
    styling: ScrollTrackStyling;
    visible: boolean;
} & Pick<ScrollTrackOptions, "insets" | "onDragEnd" | "onDragStart" | "onPressEnd" | "onPressStart">;
/** One axis of the custom draggable scrollbar. */
export declare function ScrollTrack({ alwaysVisible, axis, containerSize, contentSize, disableGestures, hitSlop, insets, onDragEnd, onDragStart, onHoverChange, onPressChange, onPressEnd, onPressStart, onScrollToPosition, scrollPosition, styling, visible, }: ScrollTrackProps): import("react").JSX.Element | null;
export {};
