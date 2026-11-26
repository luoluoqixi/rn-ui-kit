import type { PropsWithChildren } from "react";
import { HeroUINativeProvider } from "heroui-native";

const config = { toast: false, devInfo: { stylingPrinciples: false } } as const;

export function HeroUIProvider({ children }: PropsWithChildren) {
  // The project mounts its routed ToastProvider separately from HeroUI's portal host.
  return <HeroUINativeProvider config={config}>{children}</HeroUINativeProvider>;
}
