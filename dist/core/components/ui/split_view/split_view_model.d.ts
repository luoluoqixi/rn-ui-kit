import { PaneView } from "./pane_view";
import { type SplitLayoutState } from "./types";
type ViewItemSize = number | {
    cachedVisibleSize: number;
};
export type SplitViewDescriptor = {
    size: number;
    views: {
        size: ViewItemSize;
        view: PaneView;
    }[];
};
export type SplitViewModelOptions = {
    descriptor: SplitViewDescriptor;
    proportionalLayout?: boolean;
};
export declare class SplitViewModel {
    contentSize: number;
    onDidChange?: (sizes: number[]) => void;
    onDidVisibleChange?: (index: number, visible: boolean) => void;
    private proportionalLayout;
    private proportions?;
    private sashDragState?;
    private size;
    private viewItems;
    constructor(options: SplitViewModelOptions);
    getState(): SplitLayoutState;
    getViewSize(index: number): number;
    isViewVisible(index: number): boolean;
    layout(size?: number): void;
    resizeView(index: number, size: number): void;
    resizeViews(sizes: number[]): void;
    restoreState(state: SplitLayoutState): void;
    resetSash(index: number, state: SplitLayoutState): void;
    distributeViewSizes(): void;
    setViewVisible(index: number, visible: boolean): void;
    startSashDrag(index: number, start: number): void;
    changeSashDrag(current: number): void;
    endSashDrag(): void;
    private createSnapState;
    private distributeEmptySpace;
    private findFirstSnapIndex;
    private layoutViews;
    private relayout;
    private resize;
    private saveProportions;
    private applyViewState;
    private setItemVisible;
}
export {};
