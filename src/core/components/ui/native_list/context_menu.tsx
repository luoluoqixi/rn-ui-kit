import { createContext, type ReactNode, useContext } from "react";

import type { NativeListContextMenuProps } from "./types";

const NativeListContextMenuContext = createContext<NativeListContextMenuProps | undefined>(
  undefined,
);

export function NativeListContextMenuProvider({
  children,
  contextMenuProps,
}: {
  children: ReactNode;
  contextMenuProps?: NativeListContextMenuProps;
}) {
  return (
    <NativeListContextMenuContext.Provider value={contextMenuProps}>
      {children}
    </NativeListContextMenuContext.Provider>
  );
}

export function resolveNativeListContextMenu(
  contextMenuProps?: NativeListContextMenuProps | false,
  inheritedContextMenuProps?: NativeListContextMenuProps,
) {
  if (contextMenuProps === false) {
    return undefined;
  }

  return contextMenuProps ?? inheritedContextMenuProps;
}

export function useResolvedNativeListContextMenu(
  contextMenuProps?: NativeListContextMenuProps | false,
) {
  const inheritedContextMenuProps = useContext(NativeListContextMenuContext);

  return resolveNativeListContextMenu(contextMenuProps, inheritedContextMenuProps);
}
