import { createContext, type ReactNode, useContext } from "react";

import type { NativeHapticsSetting } from "../utils";

const NativeListHapticsContext = createContext<NativeHapticsSetting | undefined>(undefined);

export function NativeListHapticsProvider({
  children,
  nativeHaptics,
}: {
  children: ReactNode;
  nativeHaptics?: NativeHapticsSetting;
}) {
  const inherited = useContext(NativeListHapticsContext);
  return (
    <NativeListHapticsContext.Provider value={nativeHaptics ?? inherited}>
      {children}
    </NativeListHapticsContext.Provider>
  );
}

export function useResolvedNativeListHaptics(nativeHaptics?: NativeHapticsSetting) {
  const inherited = useContext(NativeListHapticsContext);
  return nativeHaptics ?? inherited;
}
