import type { TrueSheetProps } from "@lodev09/react-native-true-sheet";
import type { NativeSheetProps } from "./types";
type NativeSheetDetent = NonNullable<TrueSheetProps["detents"]>[number];
export type NativeDetentNormalization = {
    detents: NativeSheetDetent[];
    sourceDetentCount: number;
    toNativeIndex: (index: number) => number;
    fromNativeIndex: (index: number) => number;
};
export declare function resolveNativeDetents(snapPoints: NativeSheetProps["snapPoints"], snapPointsMode: NativeSheetProps["snapPointsMode"], windowHeight: number): NativeDetentNormalization;
export declare function clampDetentIndex(index: number | undefined, detentCount: number): number;
export declare function NativeSheet({ backgroundColor, children, content, defaultOpen, defaultPosition, dismissOnBackPress, dismissOnOverlayPress, disableDrag, grabberContentInsetTop, handle, modal, name, onAnimationComplete, onOpenChange, onPositionChange, open: openProp, overlay, overlayPortalHostName: overlayPortalHostNameProp, position: positionProp, snapPoints, snapPointsMode, }: NativeSheetProps): import("react").JSX.Element | null;
export {};
