import type { InferTamaguiConfig } from "@tamagui/core";
import { defaultConfig } from "@tamagui/config/v5";
import { animations } from "@tamagui/config/v5-css";
import { animations as animationsReanimated } from "@tamagui/config/v5-reanimated";

type Conf = InferTamaguiConfig<typeof defaultConfig> & {
  animations: typeof animations | typeof animationsReanimated;
};

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
