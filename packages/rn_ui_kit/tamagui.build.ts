import type { TamaguiBuildOptions } from "tamagui";

export default {
  components: ["tamagui", "rn_ui_kit"],
  config: "./tamagui.config.ts",
  outputCSS: "./dist/tamagui.generated.css",
} satisfies TamaguiBuildOptions;
