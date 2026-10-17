import type { TrueSheetProps } from "@lodev09/react-native-true-sheet";
import type { NativeSheetProps } from "./types";
type NativeSheetDetent = NonNullable<TrueSheetProps["detents"]>[number];
export type NativeDetentNormalization = {
    detents: NativeSheetDetent[];
    sourceDetentCount: number;
    toNativeIndex: (index: number) => number;
    fromNativeIndex: (index: number) => number;
};
export declare function resolveNativeDetents(detents: NativeSheetProps["detents"], snapPoints: NativeSheetProps["snapPoints"], compactHeight?: boolean): NativeDetentNormalization;
export declare function clampDetentIndex(index: number | undefined, detentCount: number): number;
export declare function NativeSheet({ ...props }: NativeSheetProps): import("react").JSX.Element | null;
export {};
