import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { NativeListRootProps, NativeListSelectionId } from "./types";

type NativeListEditModeContextValue = {
  editMode: boolean;
  editModeIcon: NativeListRootProps["editModeIcon"];
  editModeSelectedIcon: NativeListRootProps["editModeSelectedIcon"];
  editModeSelectedSfSymbol: NativeListRootProps["editModeSelectedSfSymbol"];
  editModeSfSymbol: NativeListRootProps["editModeSfSymbol"];
  isSelected: (selectionId: NativeListSelectionId) => boolean;
  nativeSelectionEnabled: boolean;
  toggleSelection: (selectionId: NativeListSelectionId) => void;
};

const NativeListEditModeContext = createContext<NativeListEditModeContextValue>({
  editMode: false,
  editModeIcon: undefined,
  editModeSelectedIcon: undefined,
  editModeSelectedSfSymbol: undefined,
  editModeSfSymbol: undefined,
  isSelected: () => false,
  nativeSelectionEnabled: false,
  toggleSelection: () => {},
});
const NativeListEditRowIdContext = createContext<NativeListSelectionId | undefined>(undefined);

export function NativeListEditRowIdProvider({
  children,
  selectionId,
}: {
  children: ReactNode;
  selectionId: NativeListSelectionId;
}) {
  return (
    <NativeListEditRowIdContext.Provider value={selectionId}>
      {children}
    </NativeListEditRowIdContext.Provider>
  );
}

type NativeListEditModeProviderProps = Pick<
  NativeListRootProps,
  | "defaultSelectedIds"
  | "editMode"
  | "editModeIcon"
  | "editModeSelectedIcon"
  | "editModeSelectedSfSymbol"
  | "editModeSfSymbol"
  | "onSelectedIdsChange"
  | "selectedIds"
> & {
  children: ReactNode;
  nativeSelectionEnabled?: boolean;
};

export function NativeListEditModeProvider({
  children,
  defaultSelectedIds,
  editMode = false,
  editModeIcon,
  editModeSelectedIcon,
  editModeSelectedSfSymbol,
  editModeSfSymbol,
  nativeSelectionEnabled = false,
  onSelectedIdsChange,
  selectedIds,
}: NativeListEditModeProviderProps) {
  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState<NativeListSelectionId[]>(
    () => [...(defaultSelectedIds ?? [])],
  );
  const isControlled = selectedIds != null;
  const resolvedSelectedIds = isControlled ? selectedIds : uncontrolledSelectedIds;
  const selectedIdSet = useMemo(() => new Set(resolvedSelectedIds), [resolvedSelectedIds]);

  const isSelected = useCallback(
    (selectionId: NativeListSelectionId) => selectedIdSet.has(selectionId),
    [selectedIdSet],
  );
  const toggleSelection = useCallback(
    (selectionId: NativeListSelectionId) => {
      const nextSelectedIds = selectedIdSet.has(selectionId)
        ? resolvedSelectedIds.filter((id) => id !== selectionId)
        : [...resolvedSelectedIds, selectionId];

      if (!isControlled) {
        setUncontrolledSelectedIds(nextSelectedIds);
      }
      onSelectedIdsChange?.([...nextSelectedIds]);
    },
    [isControlled, onSelectedIdsChange, resolvedSelectedIds, selectedIdSet],
  );
  const value = useMemo(
    () => ({
      editMode,
      editModeIcon,
      editModeSelectedIcon,
      editModeSelectedSfSymbol,
      editModeSfSymbol,
      isSelected,
      nativeSelectionEnabled,
      toggleSelection,
    }),
    [
      editMode,
      editModeIcon,
      editModeSelectedIcon,
      editModeSelectedSfSymbol,
      editModeSfSymbol,
      isSelected,
      nativeSelectionEnabled,
      toggleSelection,
    ],
  );

  return (
    <NativeListEditModeContext.Provider value={value}>
      {children}
    </NativeListEditModeContext.Provider>
  );
}

export function useNativeListEditMode() {
  return useContext(NativeListEditModeContext).editMode;
}

/** Section RenderProp 使用的完整编辑态选择上下文。 */
export function useNativeListEditContext() {
  return useContext(NativeListEditModeContext);
}

export function useNativeListEditIcons() {
  const { editModeIcon, editModeSelectedIcon, editModeSelectedSfSymbol, editModeSfSymbol } =
    useContext(NativeListEditModeContext);

  return {
    editModeIcon,
    editModeSelectedIcon,
    editModeSelectedSfSymbol,
    editModeSfSymbol,
  };
}

export function useNativeListEditRow({
  disabled,
  nativeScrollId,
  nativeSelection = false,
  onPress,
  selectionId,
  selectionDisabled = false,
}: {
  disabled?: boolean;
  nativeScrollId?: string | number;
  nativeSelection?: boolean;
  onPress?: () => void;
  selectionId?: NativeListSelectionId;
  selectionDisabled?: boolean;
}) {
  const generatedSelectionId = useId();
  const inheritedSelectionId = useContext(NativeListEditRowIdContext);
  const { editMode, isSelected, nativeSelectionEnabled, toggleSelection } =
    useContext(NativeListEditModeContext);
  const resolvedSelectionId =
    selectionId ?? nativeScrollId ?? inheritedSelectionId ?? generatedSelectionId;
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
