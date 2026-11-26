import type { TrueSheetProps } from "@lodev09/react-native-true-sheet";
import type { StyleProp, ViewStyle } from "react-native";
/** v4: fixed detents fill; auto detents keep their natural content height. */
export declare function isTrueSheetAutoDetent(detents: TrueSheetProps["detents"], index?: number): boolean;
export declare function mergeTrueSheetContentStyle(_scrollable: boolean | undefined, style?: StyleProp<ViewStyle>, autoDetent?: boolean): StyleProp<ViewStyle>;
