import type { PropsWithChildren } from "react";

// HeroUI React v3 needs no provider. Never import heroui-native in this entry.
export function HeroUIProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
