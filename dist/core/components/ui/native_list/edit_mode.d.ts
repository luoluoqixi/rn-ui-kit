import { type ReactNode } from "react";
import type { NativeListRootProps, NativeListSelectionId } from "./types";
export declare function NativeListEditRowIdProvider({ children, selectionId, }: {
    children: ReactNode;
    selectionId: NativeListSelectionId;
}): import("react").JSX.Element;
type NativeListEditModeProviderProps = Pick<NativeListRootProps, "defaultSelectedIds" | "editMode" | "editModeIcon" | "editModeSelectedIcon" | "editModeSelectedSfSymbol" | "editModeSfSymbol" | "onSelectedIdsChange" | "selectedIds"> & {
    children: ReactNode;
    nativeSelectionEnabled?: boolean;
};
export declare function NativeListEditModeProvider({ children, defaultSelectedIds, editMode, editModeIcon, editModeSelectedIcon, editModeSelectedSfSymbol, editModeSfSymbol, nativeSelectionEnabled, onSelectedIdsChange, selectedIds, }: NativeListEditModeProviderProps): import("react").JSX.Element;
export declare function useNativeListEditMode(): boolean;
export declare function useNativeListEditIcons(): {
    editModeIcon: import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | undefined;
    editModeSelectedIcon: import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | undefined;
    editModeSelectedSfSymbol: import("sf-symbols-typescript").SFSymbols7_0 | undefined;
    editModeSfSymbol: import("sf-symbols-typescript").SFSymbols7_0 | undefined;
};
export declare function useNativeListEditRow({ disabled, nativeScrollId, nativeSelection, onPress, selectionId, }: {
    disabled?: boolean;
    nativeScrollId?: string | number;
    nativeSelection?: boolean;
    onPress?: () => void;
    selectionId?: NativeListSelectionId;
}): {
    editMode: boolean;
    editingSelected: boolean;
    nativeSelection: boolean;
    onPress: (() => void) | undefined;
    selectionId: NativeListSelectionId;
};
export {};
