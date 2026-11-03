import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { NATIVE_LIST_TRAILING_TRIGGER_FONT_WEIGHT } from "./constants";
const NativeListTriggerFontWeightContext = createContext(undefined);
export function NativeListTriggerFontWeightProvider({ children, nativeTriggerFontWeight, }) {
    const inherited = useContext(NativeListTriggerFontWeightContext);
    return (_jsx(NativeListTriggerFontWeightContext.Provider, { value: nativeTriggerFontWeight ?? inherited, children: children }));
}
export function useResolvedNativeListTriggerFontWeight(nativeTriggerFontWeight) {
    const inherited = useContext(NativeListTriggerFontWeightContext);
    return nativeTriggerFontWeight ?? inherited ?? NATIVE_LIST_TRAILING_TRIGGER_FONT_WEIGHT;
}
