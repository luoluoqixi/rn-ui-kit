import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const NativeListDisabledContext = createContext(false);
export function NativeListDisabledProvider({ children, disabled, }) {
    const inheritedDisabled = useContext(NativeListDisabledContext);
    const resolvedDisabled = resolveNativeListDisabled(disabled, inheritedDisabled);
    return (_jsx(NativeListDisabledContext.Provider, { value: resolvedDisabled, children: children }));
}
export function useResolvedNativeListDisabled(disabled) {
    const inheritedDisabled = useContext(NativeListDisabledContext);
    return resolveNativeListDisabled(disabled, inheritedDisabled);
}
export function resolveNativeListDisabled(disabled, inherited = false) {
    return inherited || disabled === true;
}
