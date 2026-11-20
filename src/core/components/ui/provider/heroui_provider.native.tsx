import type { PropsWithChildren } from "react";
import { HeroUINativeProvider } from "heroui-native";

const config = { toast: false, devInfo: { stylingPrinciples: false } } as const;

export function HeroUIProvider({ children }: PropsWithChildren) {
  // Keep rn-ui-kit's existing Toast and portal system during component migration.
  return <HeroUINativeProvider config={config}>{children}</HeroUINativeProvider>;
}
