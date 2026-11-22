import { afterAll, expect, mock, test } from "bun:test";
import * as React from "react";
import { Window } from "happy-dom";

const win = new Window({ url: "http://localhost/" });
afterAll(() => win.close());
for (const key of ["window", "document", "navigator", "HTMLElement", "Element", "Node"]) globalThis[key] = key === "window" ? win : win[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
mock.module("react-native", () => ({ Platform: { OS: "ios" }, useColorScheme: () => "light" }));
const { Portal, PortalHost } = await import("../node_modules/heroui-native/src/primitives/portal/portal.tsx");
mock.module("heroui-native/portal", () => ({ Portal, PortalHost }));
const nativePortal = await import("../src/core/components/ui/utils/overlay/portal_host.native");
mock.module("../src/core/components/ui/utils/overlay/portal_host", () => nativePortal);
const HostContext = React.createContext(undefined);
mock.module("../src/core/components/ui/utils/overlay/screen_overlay_portal", () => ({ useScopedOverlayPortalHostName: () => React.useContext(HostContext) }));
const { OverlayScopedPortal } = await import("../src/core/components/ui/utils/overlay/overlay_scoped_portal");
const { createRoot } = await import("react-dom/client");
const passthrough = ({ children }) => children;
const TeleportContext = React.createContext(null);
const HapticsContext = React.createContext(false);
const ToastContext = React.createContext(undefined);
const BackgroundContext = React.createContext(null);
mock.module("react-native-teleport", () => ({ PortalProvider: ({ children }) => <TeleportContext.Provider value="shared-teleport-manager">{children}</TeleportContext.Provider> }));
mock.module("react-native-keyboard-controller", () => ({ KeyboardProvider: passthrough }));
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
  } finally { await React.act(() => root.unmount()); mount.remove(); }
});

test("scoped HeroUI portals isolate root/sheet/dialog hosts, update and unregister without duplicating the default host", async () => {
  const mount = document.createElement("div"); document.body.append(mount);
  const root = createRoot(mount);
  let nextInstance = 0;
  function Sheet({ id, text }) {
    const [instance] = React.useState(() => ++nextInstance);
    return <div data-sheet={id} data-instance={instance}>{text}<SheetContextProbe /></div>;
  }
  function Screen({ host, active, text, sibling }) {
    return <UIProvider defaultNativeHapticsEnabled>
      <Portal name="ordinary-heroui-popup"><span data-default-popup>HeroUI 默认弹层</span></Portal>
      <div data-host="sheet"><nativePortal.OverlayPortalHost name="sheet" /></div>
      <div data-host="dialog"><nativePortal.OverlayPortalHost name="dialog" /></div>
      <HostContext.Provider value={host}>
        <OverlayScopedPortal name="color-picker" active={active}><Sheet id="color-picker" text={text} /></OverlayScopedPortal>
        <OverlayScopedPortal name="explicit-host" hostName="dialog"><span data-explicit-host /></OverlayScopedPortal>
        {sibling && <OverlayScopedPortal name="sibling"><Sheet id="sibling" text="相邻 Sheet" /></OverlayScopedPortal>}
      </HostContext.Provider>
    </UIProvider>;
  }
  const picker = () => mount.querySelector('[data-sheet="color-picker"]');
  try {
    await React.act(() => root.render(<Screen active text="根颜色" sibling />));
    expect(mount.querySelectorAll('[data-default-popup]')).toHaveLength(1);
    expect(mount.querySelectorAll('[data-sheet="color-picker"]')).toHaveLength(1);
    expect(picker().closest('[data-host]')).toBeNull();
    expect(mount.querySelector('[data-explicit-host]').closest('[data-host]').dataset.host).toBe("dialog");
    const siblingInstance = mount.querySelector('[data-sheet="sibling"]').dataset.instance;
    const pickerInstance = picker().dataset.instance;
    await React.act(() => root.render(<Screen active text="更新颜色" sibling />));
    expect(picker().textContent).toContain("更新颜色"); expect(picker().dataset.instance).toBe(pickerInstance);
    await React.act(() => root.render(<Screen active={false} text="关闭" sibling />));
    expect(picker()).toBeNull();
    expect(mount.querySelector('[data-sheet="sibling"]').dataset.instance).toBe(siblingInstance);
    for (const host of ["sheet", "dialog", undefined]) {
      await React.act(() => root.render(<Screen host={host} active text="窗口颜色" />));
      expect(mount.querySelectorAll('[data-sheet="color-picker"]')).toHaveLength(1);
      expect(picker().closest('[data-host]')?.dataset.host).toBe(host);
      expect(mount.querySelectorAll('[data-default-popup]')).toHaveLength(1);
    }
    await React.act(() => root.unmount());
    expect(mount.textContent).toBe("");
  } finally { if (mount.textContent) await React.act(() => root.unmount()); mount.remove(); }
});
