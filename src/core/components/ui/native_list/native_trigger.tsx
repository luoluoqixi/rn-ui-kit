import { createContext, type ReactNode, useContext } from "react";
import type { TextStyle } from "react-native";

import { NATIVE_LIST_TRAILING_TRIGGER_FONT_WEIGHT } from "./constants";

const NativeListTriggerFontWeightContext = createContext<TextStyle["fontWeight"] | undefined>(
  undefined,
);

export function NativeListTriggerFontWeightProvider({
  children,
  nativeTriggerFontWeight,
}: {
  children: ReactNode;
  nativeTriggerFontWeight?: TextStyle["fontWeight"];
}) {
  const inherited = useContext(NativeListTriggerFontWeightContext);
  return (
    <NativeListTriggerFontWeightContext.Provider
      value={nativeTriggerFontWeight ?? inherited}
    >
      {children}
    </NativeListTriggerFontWeightContext.Provider>
  );
}

export function useResolvedNativeListTriggerFontWeight(
  nativeTriggerFontWeight?: TextStyle["fontWeight"],
) {
  const inherited = useContext(NativeListTriggerFontWeightContext);
  return nativeTriggerFontWeight ?? inherited ?? NATIVE_LIST_TRAILING_TRIGGER_FONT_WEIGHT;
}
