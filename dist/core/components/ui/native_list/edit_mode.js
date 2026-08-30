import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useId, useMemo, useState, } from "react";
const NativeListEditModeContext = createContext({
    editMode: false,
    editModeIcon: undefined,
    editModeSelectedIcon: undefined,
    editModeSelectedSfSymbol: undefined,
    editModeSfSymbol: undefined,
    isSelected: () => false,
    nativeSelectionEnabled: false,
    toggleSelection: () => { },
});
const NativeListEditRowIdContext = createContext(undefined);
export function NativeListEditRowIdProvider({ children, selectionId, }) {
    return (_jsx(NativeListEditRowIdContext.Provider, { value: selectionId, children: children }));
}
export function NativeListEditModeProvider({ children, defaultSelectedIds, editMode = false, editModeIcon, editModeSelectedIcon, editModeSelectedSfSymbol, editModeSfSymbol, nativeSelectionEnabled = false, onSelectedIdsChange, selectedIds, }) {
    const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState(() => [...(defaultSelectedIds ?? [])]);
    const isControlled = selectedIds != null;
    const resolvedSelectedIds = isControlled ? selectedIds : uncontrolledSelectedIds;
    const selectedIdSet = useMemo(() => new Set(resolvedSelectedIds), [resolvedSelectedIds]);
    const isSelected = useCallback((selectionId) => selectedIdSet.has(selectionId), [selectedIdSet]);
    const toggleSelection = useCallback((selectionId) => {
        const nextSelectedIds = selectedIdSet.has(selectionId)
            ? resolvedSelectedIds.filter((id) => id !== selectionId)
            : [...resolvedSelectedIds, selectionId];
        if (!isControlled) {
            setUncontrolledSelectedIds(nextSelectedIds);
        }
        onSelectedIdsChange?.([...nextSelectedIds]);
    }, [isControlled, onSelectedIdsChange, resolvedSelectedIds, selectedIdSet]);
    const value = useMemo(() => ({
        editMode,
        editModeIcon,
        editModeSelectedIcon,
        editModeSelectedSfSymbol,
        editModeSfSymbol,
        isSelected,
        nativeSelectionEnabled,
        toggleSelection,
    }), [
        editMode,
        editModeIcon,
        editModeSelectedIcon,
        editModeSelectedSfSymbol,
        editModeSfSymbol,
        isSelected,
        nativeSelectionEnabled,
        toggleSelection,
    ]);
    return (_jsx(NativeListEditModeContext.Provider, { value: value, children: children }));
}
export function useNativeListEditMode() {
    return useContext(NativeListEditModeContext).editMode;
}
/** Section RenderProp 使用的完整编辑态选择上下文。 */
export function useNativeListEditContext() {
    return useContext(NativeListEditModeContext);
}
export function useNativeListEditIcons() {
    const { editModeIcon, editModeSelectedIcon, editModeSelectedSfSymbol, editModeSfSymbol } = useContext(NativeListEditModeContext);
    return {
        editModeIcon,
        editModeSelectedIcon,
        editModeSelectedSfSymbol,
        editModeSfSymbol,
    };
}
export function useNativeListEditRow({ disabled, nativeScrollId, nativeSelection = false, onPress, selectionId, selectionDisabled = false, }) {
    const generatedSelectionId = useId();
    const inheritedSelectionId = useContext(NativeListEditRowIdContext);
    const { editMode, isSelected, nativeSelectionEnabled, toggleSelection } = useContext(NativeListEditModeContext);
    const resolvedSelectionId = selectionId ?? nativeScrollId ?? inheritedSelectionId ?? generatedSelectionId;
    const editingSelected = editMode && isSelected(resolvedSelectionId);
    const selectionEnabled = editMode && !selectionDisabled;
    const usesNativeSelection = selectionEnabled && nativeSelectionEnabled && nativeSelection;
    const resolvedOnPress = editMode
        ? disabled || selectionDisabled || usesNativeSelection
            ? undefined
            : () => toggleSelection(resolvedSelectionId)
        : onPress;
    return {
        editMode,
        editingSelected,
        nativeSelection: usesNativeSelection,
        onPress: resolvedOnPress,
        selectionId: resolvedSelectionId,
        selectionEnabled,
    };
}
