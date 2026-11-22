import { afterAll, expect, mock, test } from "bun:test";
import * as React from "react";
import { Window } from "happy-dom";

const win = new Window({ url: "http://localhost/" });
afterAll(() => win.close());
for (const key of ["window", "document", "navigator", "HTMLElement", "Element", "Node"]) globalThis[key] = key === "window" ? win : win[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let systemScheme = "light";
mock.module("react-native", () => ({ Platform: { OS: "ios" }, useColorScheme: () => systemScheme }));
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
mock.module("../src/core/components/ui/utils/haptics", () => ({ NativeHapticsProvider: ({ children, enabledByDefault }) => <HapticsContext.Provider value={enabledByDefault}>{children}</HapticsContext.Provider> }));
mock.module("../src/core/components/ui/toast/toast", () => ({ ToastDefaultsProvider: ({ children, defaultNative }) => <ToastContext.Provider value={defaultNative}>{children}</ToastContext.Provider> }));
mock.module("../src/core/components/ui/toast/toaster", () => ({ Toaster: () => null }));
const { resolveUiPreferences } = await import("../src/core/components/ui/utils/theme/preferences");
const { resolveColorSchemeSettings } = await import("../src/core/components/ui/utils/theme/settings");
const { resolveAccentThemeName, resolveGeneratedAccentTheme } = await import("../src/core/components/ui/utils/theme/accent_theme");
const { resolveAppBackgroundColors } = await import("../src/core/components/ui/utils/theme/app_background");
const ThemeContext = React.createContext(null);
mock.module("../src/core/components/ui/utils/theme", () => ({
  UiPreferencesProvider: passthrough, UiThemeProvider: ({ children, ...props }) => <ThemeContext.Provider value={props}>{children}</ThemeContext.Provider>,
  AppBackgroundColorsProvider: ({ children, colors }) => <BackgroundContext.Provider value={colors}>{children}</BackgroundContext.Provider>,
  resolveUiPreferences, resolveColorSchemeSettings, resolveAccentThemeName, resolveAppBackgroundColors,
  resolveUiColors: (scheme, accent, theme) => (theme ?? resolveGeneratedAccentTheme(accent))[scheme],
}));
const { UIProvider } = await import("../src/core/components/ui/provider/ui_provider");
const NavigationContext = React.createContext(null);
const navigationBase = { colors: {}, fonts: { regular: { fontFamily: "System" } } };
mock.module("@react-navigation/native", () => ({
  DarkTheme: { ...navigationBase, dark: true }, DefaultTheme: { ...navigationBase, dark: false },
  ThemeProvider: ({ children, value }) => <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>,
}));
mock.module("react-native-gesture-handler", () => ({ GestureHandlerRootView: ({ children, style }) => <div data-gesture-root style={style}>{children}</div> }));
mock.module("react-native-safe-area-context", () => ({ SafeAreaProvider: ({ children, style }) => <div data-safe-area style={style}>{children}</div> }));
mock.module("../src/core/components/ui/sheet/provider", () => ({ SheetProvider: passthrough }));
const { RootProvider } = await import("../src/core/components/ui/provider/root_provider");
function SheetContextProbe() {
  const manager = React.useContext(TeleportContext);
  if (!manager) throw new Error("usePortalContext must be used within PortalProvider");
  return <p>{JSON.stringify({ manager, haptics: React.useContext(HapticsContext), nativeToast: React.useContext(ToastContext), background: React.useContext(BackgroundContext) })}</p>;
}

test("shared RootProvider keeps navigation, UI theme and container backgrounds synchronized", async () => {
  const mount = document.createElement("div"); document.body.append(mount);
  const root = createRoot(mount);
  const preferences = { appearance: { themeMode: "system", accentColor: "ruby" } };
  const backgrounds = { light: { screen: "#eeeeee", header: "#dddddd" }, dark: { screen: "#111111", header: "#222222" } };
  function Probe() {
    return <pre>{JSON.stringify({ ui: React.useContext(ThemeContext), navigation: React.useContext(NavigationContext) })}</pre>;
  }
  const read = () => JSON.parse(mount.querySelector("pre").textContent);
  try {
    const render = props => root.render(<RootProvider preferences={preferences} appBackgroundColors={backgrounds} {...props}><Probe /></RootProvider>);
    await React.act(() => render({}));
    expect(read().ui).toMatchObject({ colorScheme: "light", followsSystem: true, accentThemeName: "ruby" });
    expect(read().navigation.colors).toMatchObject({ primary: resolveGeneratedAccentTheme("ruby").light.accent, background: "#eeeeee", card: "#dddddd" });
    expect(mount.querySelector("[data-gesture-root]").style.backgroundColor).toBe("#eeeeee");
    systemScheme = "dark";
    await React.act(() => render({}));
    expect(read().ui).toMatchObject({ colorScheme: "dark", followsSystem: true });
    expect(read().navigation).toMatchObject({ dark: true, colors: { background: "#111111", card: "#222222", primary: resolveGeneratedAccentTheme("ruby").dark.accent } });
    expect(mount.querySelector("[data-safe-area]").style.backgroundColor).toBe("#111111");
    const theme = resolveGeneratedAccentTheme("forest");
    await React.act(() => render({ colorScheme: "light", theme }));
    expect(read().ui).toMatchObject({ colorScheme: "light", followsSystem: false });
    expect(read().navigation.colors.primary).toBe(theme.light.accent);
    expect(preferences.appearance.themeMode).toBe("system");
    const customNavigation = { ...navigationBase, dark: true, colors: { primary: "custom" } };
    await React.act(() => render({ navigationTheme: customNavigation }));
    expect(read().navigation).toEqual(customNavigation);
  } finally { systemScheme = "light"; await React.act(() => root.unmount()); mount.remove(); }
});

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
