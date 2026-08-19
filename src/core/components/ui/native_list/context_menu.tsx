import { createContext, type ReactNode, useContext } from "react";

import type { NativeListContextMenuProps } from "./types";

const NativeListContextMenuContext = createContext<NativeListContextMenuProps | undefined>(
  undefined,
);
const NativeListDisabledStyleContext = createContext(true);

export function NativeListContextMenuProvider({
  children,
  contextMenuProps,
  disabledStyle,
}: {
  children: ReactNode;
  contextMenuProps?: NativeListContextMenuProps;
  disabledStyle?: boolean;
}) {
  const inheritedDisabledStyle = useContext(NativeListDisabledStyleContext);

  return (
    <NativeListContextMenuContext.Provider value={contextMenuProps}>
      <NativeListDisabledStyleContext.Provider value={disabledStyle ?? inheritedDisabledStyle}>
        {children}
      </NativeListDisabledStyleContext.Provider>
    </NativeListContextMenuContext.Provider>
  );
}

export function useResolvedNativeListDisabledStyle(disabledStyle?: boolean) {
  const inheritedDisabledStyle = useContext(NativeListDisabledStyleContext);

  return resolveNativeListDisabledStyle(disabledStyle, inheritedDisabledStyle);
}

export function resolveNativeListDisabledStyle(disabledStyle?: boolean, inherited = true) {
  return disabledStyle ?? inherited;
}

export function resolveNativeListContextMenu(
  contextMenuProps?: NativeListContextMenuProps | false,
  inheritedContextMenuProps?: NativeListContextMenuProps,
  disabled = false,
) {
  if (disabled || contextMenuProps === false) {
    return undefined;
  }

  return contextMenuProps ?? inheritedContextMenuProps;
}

export function useResolvedNativeListContextMenu(
  contextMenuProps?: NativeListContextMenuProps | false,
  disabled = false,
) {
  const inheritedContextMenuProps = useContext(NativeListContextMenuContext);

  return resolveNativeListContextMenu(contextMenuProps, inheritedContextMenuProps, disabled);
}
