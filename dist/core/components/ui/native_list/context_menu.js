import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const NativeListContextMenuContext = createContext(undefined);
export function NativeListContextMenuProvider({ children, contextMenuProps, }) {
    return (_jsx(NativeListContextMenuContext.Provider, { value: contextMenuProps, children: children }));
}
export function resolveNativeListContextMenu(contextMenuProps, inheritedContextMenuProps, disabled = false) {
    if (disabled || contextMenuProps === false) {
        return undefined;
    }
    return contextMenuProps ?? inheritedContextMenuProps;
}
export function useResolvedNativeListContextMenu(contextMenuProps, disabled = false) {
    const inheritedContextMenuProps = useContext(NativeListContextMenuContext);
    return resolveNativeListContextMenu(contextMenuProps, inheritedContextMenuProps, disabled);
}
