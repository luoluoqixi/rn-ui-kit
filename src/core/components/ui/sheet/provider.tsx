import { TrueSheetProvider } from "@lodev09/react-native-true-sheet";
import type { ReactNode } from "react";

export function SheetProvider({ children }: { children: ReactNode }) {
  return <TrueSheetProvider>{children}</TrueSheetProvider>;
}
