import type { UiStorageAdapter } from "../utils/storage";
import type { SplitLayoutState } from "./types";
export declare function readSplitLayoutState(storageAdapter?: UiStorageAdapter, storageKey?: string): Promise<SplitLayoutState | undefined>;
export declare function writeSplitLayoutState(storageAdapter: UiStorageAdapter | undefined, storageKey: string | undefined, state: SplitLayoutState): Promise<void>;
