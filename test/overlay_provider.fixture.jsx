import { expect, mock, test } from "bun:test";
import * as React from "react";
import { Window } from "happy-dom";

const win = new Window({ url: "http://localhost/" });
for (const key of ["window", "document", "navigator", "HTMLElement", "Element", "Node"]) globalThis[key] = key === "window" ? win : win[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
mock.module("react-native", () => ({ Platform: { OS: "ios" }, useColorScheme: () => "light" }));
const { Portal, PortalHost } = await import("../node_modules/heroui-native/src/primitives/portal/portal.tsx");
const { createRoot } = await import("react-dom/client");
const passthrough = ({ children }) => children;
const TeleportContext = React.createContext(null);
const HapticsContext = React.createContext(false);
const ToastContext = React.createContext(undefined);
const BackgroundContext = React.createContext(null);
mock.module("react-native-teleport", () => ({ PortalProvider: ({ children }) => <TeleportContext.Provider value="shared-teleport-manager">{children}</TeleportContext.Provider> }));
mock.module("react-native-keyboard-controller", () => ({ KeyboardProvider: passthrough }));
mock.module("@rn-primitives/portal", () => ({ PortalHost: () => null }));
mock.module("../src/core/components/ui/provider/font_provider", () => ({ TextFontProvider: passthrough }));
// Use HeroUI's actual store-backed portal: rendering at the host must not
// accidentally preserve contexts that only surround the caller.
mock.module("../src/core/components/ui/provider/heroui_provider", () => ({ HeroUIProvider: ({ children }) => <>{children}<PortalHost /></> }));
mock.module("../src/core/components/ui/native_dialog", () => ({ NativeDialogProvider: passthrough }));
mock.module("../src/core/components/ui/utils", () => ({ NativeHapticsProvider: ({ children, enabledByDefault }) => <HapticsContext.Provider value={enabledByDefault}>{children}</HapticsContext.Provider> }));
mock.module("../src/core/components/ui/toast/toast", () => ({ ToastDefaultsProvider: ({ children, defaultNative }) => <ToastContext.Provider value={defaultNative}>{children}</ToastContext.Provider> }));
mock.module("../src/core/components/ui/toast/toaster", () => ({ Toaster: () => null }));
mock.module("../src/core/components/ui/utils/theme", () => ({
  UiPreferencesProvider: passthrough, UiThemeProvider: passthrough,
  AppBackgroundColorsProvider: ({ children, colors }) => <BackgroundContext.Provider value={colors}>{children}</BackgroundContext.Provider>,
  resolveUiPreferences: () => ({ appearance: { themeMode: "light" } }),
  resolveColorSchemeSettings: () => "light", resolveAccentThemeName: () => "ocean",
}));
const { UIProvider } = await import("../src/core/components/ui/provider/ui_provider");
function SheetContextProbe() {
  const manager = React.useContext(TeleportContext);
  if (!manager) throw new Error("usePortalContext must be used within PortalProvider");
  return <p>{JSON.stringify({ manager, haptics: React.useContext(HapticsContext), nativeToast: React.useContext(ToastContext), background: React.useContext(BackgroundContext) })}</p>;
}
test("HeroUI portal content keeps the same Teleport manager, haptics, Toast defaults and app backgrounds", async () => {
  const mount = document.createElement("div"); document.body.append(mount);
  const root = createRoot(mount);
  try {
    const render = nativeToast => root.render(<UIProvider defaultNativeHapticsEnabled toasterProps={{ defaultNative: nativeToast }} appBackgroundColors={{ screen: "#123456" }}>
      <Portal name="dialog-sheet-test"><SheetContextProbe /></Portal>
    </UIProvider>);
    await React.act(() => render(false));
    expect(JSON.parse(mount.querySelector("p").textContent)).toEqual({ manager: "shared-teleport-manager", haptics: true, nativeToast: false, background: { screen: "#123456" } });
    await React.act(() => render(true));
    expect(JSON.parse(mount.querySelector("p").textContent).nativeToast).toBe(true);
  } finally { await React.act(() => root.unmount()); win.close(); }
});
