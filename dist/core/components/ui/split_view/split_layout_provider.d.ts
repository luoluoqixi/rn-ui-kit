import type { UiStorageAdapter } from "../utils/storage";
import type { SplitLayoutProviderProps, SplitLayoutState } from "./types";
type SplitLayoutStateUpdater = SplitLayoutState | ((prev: SplitLayoutState | undefined) => SplitLayoutState);
export declare function SplitLayoutProvider({ children, fallbackState, storageAdapter, storageKey, }: SplitLayoutProviderProps): import("react").JSX.Element;
export declare function useSplitLayoutStorage(storageKey?: string, fallbackState?: SplitLayoutState, storageAdapter?: UiStorageAdapter): {
    ready: boolean;
    state: SplitLayoutState | undefined;
    setState: (updater: SplitLayoutStateUpdater) => void;
};
export {};
