import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const NativeListContextMenuContext = createContext(undefined);
export function NativeListContextMenuProvider({ children, contextMenuProps, }) {
    return (_jsx(NativeListContextMenuContext.Provider, { value: contextMenuProps, children: children }));
}
export function resolveNativeListContextMenu(contextMenuProps, inheritedContextMenuProps) {
    if (contextMenuProps === false) {
        return undefined;
    }
    return contextMenuProps ?? inheritedContextMenuProps;
}
export function useResolvedNativeListContextMenu(contextMenuProps) {
    const inheritedContextMenuProps = useContext(NativeListContextMenuContext);
    return resolveNativeListContextMenu(contextMenuProps, inheritedContextMenuProps);
}
