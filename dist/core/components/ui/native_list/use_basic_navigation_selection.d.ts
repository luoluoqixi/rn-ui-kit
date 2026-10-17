import { createBasicNavigationSelection, type BasicNavigationSelectionOptions } from "./basic_navigation_selection";
import type { NativeListNavigationItemProps } from "./types";
type Selection = ReturnType<typeof createBasicNavigationSelection>;
export declare const BasicNavigationSelectionContext: import("react").Context<{
    current: Selection | undefined;
} | undefined>;
export declare function useBasicNavigationSelection(enabled: boolean, onPress: NativeListNavigationItemProps["onPress"], options: BasicNavigationSelectionOptions): {
    selected: boolean;
    onPress: ((() => void) & ((selection?: import("./types").NativeListNavigationSelectionControls) => void)) | undefined;
};
export {};
