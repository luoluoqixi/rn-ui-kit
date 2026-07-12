import { RootProvider, type UiPreferences } from "rn_ui_kit";
import { RnUiKitDebugPanel } from "rn_ui_kit_debug";
import "rn_ui_kit/initialize";

import config from "./tamagui.config";
import { accentThemeNames } from "./themes";

const preferences = {
  appearance: {
    accentColor: "ocean",
    backgroundFollowsTheme: false,
    themeMode: "system",
  },
} satisfies Partial<UiPreferences>;

export default function App() {
  return (
    <RootProvider
      accentThemeNames={accentThemeNames}
      preferences={preferences}
      tamaguiConfig={config}
    >
      <RnUiKitDebugPanel />
    </RootProvider>
  );
}
