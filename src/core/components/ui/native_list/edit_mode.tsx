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
  isSelected: (selectionId: NativeListSelectionId) => boolean;
  toggleSelection: (selectionId: NativeListSelectionId) => void;
};

const NativeListEditModeContext = createContext<NativeListEditModeContextValue>({
  editMode: false,
  isSelected: () => false,
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
  "defaultSelectedIds" | "editMode" | "onSelectedIdsChange" | "selectedIds"
> & {
  children: ReactNode;
};

export function NativeListEditModeProvider({
  children,
  defaultSelectedIds,
  editMode = false,
  onSelectedIdsChange,
  selectedIds,
}: NativeListEditModeProviderProps) {
  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState<
    NativeListSelectionId[]
  >(() => [...(defaultSelectedIds ?? [])]);
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
    () => ({ editMode, isSelected, toggleSelection }),
    [editMode, isSelected, toggleSelection],
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

export function useNativeListEditRow({
  disabled,
  nativeScrollId,
  onPress,
  selectionId,
}: {
  disabled?: boolean;
  nativeScrollId?: string | number;
  onPress?: () => void;
  selectionId?: NativeListSelectionId;
}) {
  const generatedSelectionId = useId();
  const inheritedSelectionId = useContext(NativeListEditRowIdContext);
  const { editMode, isSelected, toggleSelection } = useContext(NativeListEditModeContext);
  const resolvedSelectionId =
    selectionId ?? nativeScrollId ?? inheritedSelectionId ?? generatedSelectionId;
  const editingSelected = editMode && isSelected(resolvedSelectionId);
  const resolvedOnPress = editMode
    ? disabled
      ? undefined
      : () => toggleSelection(resolvedSelectionId)
    : onPress;

  return { editMode, editingSelected, onPress: resolvedOnPress };
}
