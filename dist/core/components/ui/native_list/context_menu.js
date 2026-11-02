import { jsx as _jsx } from "react/jsx-runtime";
import { useMenuConfig } from "../context_menu/menu_provider";
import { createContext, useContext } from "react";
const NativeListContextMenuContext = createContext(undefined);
const NativeListDisabledStyleContext = createContext(true);
export function NativeListContextMenuProvider({ children, contextMenuProps, disabledStyle, }) {
    const inheritedContextMenuProps = useContext(NativeListContextMenuContext);
    const inheritedDisabledStyle = useContext(NativeListDisabledStyleContext);
    const resolvedContextMenuProps = contextMenuProps === undefined
        ? inheritedContextMenuProps
        : contextMenuProps === false
            ? undefined
            : contextMenuProps;
    return (_jsx(NativeListContextMenuContext.Provider, { value: resolvedContextMenuProps, children: _jsx(NativeListDisabledStyleContext.Provider, { value: disabledStyle ?? inheritedDisabledStyle, children: children }) }));
}
export function useResolvedNativeListDisabledStyle(disabledStyle) {
    const inheritedDisabledStyle = useContext(NativeListDisabledStyleContext);
    return resolveNativeListDisabledStyle(disabledStyle, inheritedDisabledStyle);
}
export function resolveNativeListDisabledStyle(disabledStyle, inherited = true) {
    return disabledStyle ?? inherited;
}
export function resolveNativeListContextMenu(contextMenuProps, inheritedContextMenuProps, disabled = false) {
    if (disabled || contextMenuProps === false) {
        return undefined;
    }
    return contextMenuProps ?? inheritedContextMenuProps;
}
export function useResolvedNativeListContextMenu(contextMenuProps, disabled = false) {
    const inheritedContextMenuProps = useContext(NativeListContextMenuContext);
    const config = useMenuConfig();
    const resolved = resolveNativeListContextMenu(contextMenuProps, inheritedContextMenuProps, disabled);
    return resolved && config.native !== undefined
        ? { native: config.native, ...resolved }
        : resolved;
}
