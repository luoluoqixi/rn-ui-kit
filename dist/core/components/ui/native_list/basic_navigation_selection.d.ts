import type { NativeListNavigationItemProps, NativeListNavigationSelectionControls } from "./types";
export type BasicNavigationSelectionOptions = Pick<NativeListNavigationItemProps, "basicNavigationSelectionAutoClearDelay" | "basicNavigationSelectionReturnClearDelay">;
type Navigation = {
    addListener: (event: "blur" | "focus", listener: () => void) => () => void;
    isFocused: () => boolean;
};
/** Each press owns its listeners and controls, so stale async callbacks cannot clear a later press. */
export declare function createBasicNavigationSelection(navigation: Navigation | undefined, onChange: (selected: boolean) => void): {
    select: ({ basicNavigationSelectionAutoClearDelay, basicNavigationSelectionReturnClearDelay, }?: BasicNavigationSelectionOptions) => NativeListNavigationSelectionControls;
    clear: () => void;
};
export {};
