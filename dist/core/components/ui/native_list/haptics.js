import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const NativeListHapticsContext = createContext(undefined);
export function NativeListHapticsProvider({ children, nativeHaptics, }) {
    const inherited = useContext(NativeListHapticsContext);
    return (_jsx(NativeListHapticsContext.Provider, { value: nativeHaptics ?? inherited, children: children }));
}
export function useResolvedNativeListHaptics(nativeHaptics) {
    const inherited = useContext(NativeListHapticsContext);
    return nativeHaptics ?? inherited;
}
