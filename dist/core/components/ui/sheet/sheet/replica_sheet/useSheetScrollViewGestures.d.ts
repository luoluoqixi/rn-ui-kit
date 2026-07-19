import type { ScrollView as RNScrollView } from "react-native";
import type { ScrollBridge } from "./types";
interface UseSheetScrollViewGesturesProps {
    scrollRef: React.RefObject<RNScrollView | null>;
    scrollBridge: ScrollBridge;
    hasScrollableContent: boolean;
    scrollEnabled: boolean;
    setScrollEnabled: (enabled: boolean, lockTo?: number) => void;
    allowSheetDragOnScrollEdge: boolean;
}
export declare function useSheetScrollViewGestures({ scrollRef, scrollBridge, hasScrollableContent, allowSheetDragOnScrollEdge, }: UseSheetScrollViewGesturesProps): {};
export {};
