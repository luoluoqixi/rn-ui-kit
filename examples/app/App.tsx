import "rn_ui_kit/initialize";

import "./tamagui.generated.css";
import { RootProvider, type UiPreferences } from "rn_ui_kit";
import { RnUiKitDebugPanel } from "rn_ui_kit_debug";

import config from "./tamagui.config";
import { accentThemeNames } from "./themes";
import { appDebugPages } from "./debug_pages";

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
      <RnUiKitDebugPanel pages={appDebugPages} />
    </RootProvider>
  );
}
