import { createContext, type ReactNode, useContext } from "react";

const NativeListDisabledContext = createContext(false);

export function NativeListDisabledProvider({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  const inheritedDisabled = useContext(NativeListDisabledContext);
  const resolvedDisabled = resolveNativeListDisabled(
    disabled,
    inheritedDisabled,
  );

  return (
    <NativeListDisabledContext.Provider value={resolvedDisabled}>
      {children}
    </NativeListDisabledContext.Provider>
  );
}

export function useResolvedNativeListDisabled(disabled?: boolean) {
  const inheritedDisabled = useContext(NativeListDisabledContext);

  return resolveNativeListDisabled(disabled, inheritedDisabled);
}

export function resolveNativeListDisabled(
  disabled?: boolean,
  inherited = false,
) {
  return inherited || disabled === true;
}
