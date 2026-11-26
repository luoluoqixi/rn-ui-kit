import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
const win = new Window({ url: "http://localhost/" });
for (const key of ["window", "document", "navigator", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "ShadowRoot"])
  globalThis[key] = key === "window" ? win : win[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true; globalThis.__DEV__ = false;
globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
const React = await import("react"); const { act } = React;
const { createRoot } = await import("react-dom/client");
const RNW = await import("react-native-web");
function interop(Component) { return React.forwardRef(({ className, style, ...props }, ref) => <Component {...props} ref={ref}
  style={[className ? { $$css: true, tailwind: className } : {}, style]} />); }
const View = interop(RNW.View);
mock.module("react-native", () => ({ ...RNW, View }));
mock.module("@react-navigation/native", () => ({ NavigationContext: React.createContext(undefined) }));
mock.module("lucide-react-native", () => Object.fromEntries(["Check", "CheckCircle2", "ChevronRight", "Circle"].map(name => [name, () => null])));
mock.module("../src/core/components/ui/utils", () => ({ triggerNativeHaptics() {} }));
mock.module("../src/core/components/ui/utils/haptics", () => ({ triggerNativeHaptics() {}, useResolvedNativeHaptics: value => value }));
mock.module("../src/core/components/ui/utils/platform", () => ({ isIos15: () => false }));
mock.module("../src/core/components/ui/utils/theme", () => ({ useUiTheme: () => ({ surface: "white", foreground: "black", muted: "gray", accent: "blue" }), useAppBackgroundColors: () => ({ screen: "gray", card: "white" }) }));
mock.module("../src/core/components/ui/button", () => ({ Button: React.forwardRef(({ children, title, isDisabled, ...props }, ref) => <RNW.Pressable {...props} disabled={props.disabled || isDisabled} accessibilityRole="button" ref={ref}><RNW.Text>{title ?? children}</RNW.Text></RNW.Pressable>) }));
mock.module("../src/core/components/ui/native_trigger", () => ({
  DROPDOWN_TRIGGER_DISABLE_OPACITY: .4, DROPDOWN_TRIGGER_PRESS_OPACITY: .7, DROPDOWN_TRIGGER_WEB_HOVER_OPACITY: .8, DROPDOWN_TRIGGER_WEB_PRESS_OPACITY: .6,
  NativeTrigger: React.forwardRef(({ label, onPress, disabled, active, ...props }, ref) => <RNW.Pressable ref={ref} disabled={disabled} accessibilityRole="button" onPress={onPress} dataSet={{ active: String(active) }}><RNW.Text>{label}</RNW.Text></RNW.Pressable>),
}));
for (const [path, key] of [["select", "Select"], ["switch", "Switch"]])
  mock.module("../src/core/components/ui/" + path, () => ({ [key]: () => null }));
mock.module("../src/core/components/ui/text", () => ({ Text: RNW.Text }));
mock.module("../src/core/components/ui/scroll_view", () => ({ ScrollView: RNW.ScrollView }));
mock.module("../src/core/components/ui/native_list/input_control", () => ({ Input: RNW.TextInput }));
mock.module("../src/core/components/ui/native_list/textarea_control", () => ({ Textarea: RNW.TextInput }));
mock.module("../src/core/components/ui/context_menu/context_menu_heroui", () => ({ ContextMenuHeroUI: ({ trigger }) => trigger }));
mock.module("../src/core/components/ui/dropdown/dropdown_heroui", () => ({ DropdownHeroUI: () => null }));
const contextHost = await import("../src/core/components/ui/context_menu/context_menu_host.web");
const dropdownHost = await import("../src/core/components/ui/dropdown/dropdown_host.web");
mock.module("../src/core/components/ui/context_menu/context_menu_host", () => contextHost);
mock.module("../src/core/components/ui/dropdown/dropdown_host", () => dropdownHost);
const { MenuProvider } = await import("../src/core/components/ui/context_menu/menu_provider");
const { NativeList, NativeListSection, NativeListItem, NativeListCustomItem, NativeListDropdownItem } = await import("../src/core/components/ui/native_list/native_list_basic");
let root;
afterEach(async () => { await act(async () => root?.unmount()); root = undefined; document.body.replaceChildren(); });
async function render(content) { root ??= createRoot(document.body.appendChild(document.createElement("div"))); await act(async () => root.render(content)); }
const textNode = label => [...document.querySelectorAll("span,div")].find(node => node.textContent === label && node.childElementCount === 0);
const rightClick = async label => { await act(async () => textNode(label).dispatchEvent(new win.MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 17, clientY: 29 }))); };

test("NativeList root/section/item/custom menus inherit, override and disable external rendering", async () => {
  const requests = [], localRequests = []; const adapter = { open: request => { requests.push(request); return {}; } };
  const local = { open: request => { localRequests.push(request); return {}; } };
  await render(<MenuProvider value={{ menuAdapter: adapter }}><NativeList scrollable={false} contextMenuProps={{ items: [{ value: "root" }] }}>
    <NativeListSection><NativeListItem title="根继承" /><NativeListCustomItem>自定义行</NativeListCustomItem>
      <NativeListItem title="禁用菜单" contextMenuProps={false} /><NativeListItem title="禁用行" disabled />
      <NativeListItem title="自绘菜单" contextMenuProps={{ native: false, items: [] }} />
      <NativeListItem title="局部适配器" contextMenuProps={{ menuAdapter: local, items: [{ value: "local" }] }} /></NativeListSection>
    <NativeListSection contextMenuProps={{ items: [{ value: "section" }] }}><NativeListItem title="分区继承" /></NativeListSection>
  </NativeList></MenuProvider>);
  await rightClick("根继承"); expect(requests.at(-1).items[0].value).toBe("root");
  await rightClick("自定义行"); expect(requests).toHaveLength(2);
  await rightClick("禁用菜单"); await rightClick("禁用行"); await rightClick("自绘菜单"); expect(requests).toHaveLength(2);
  await rightClick("局部适配器"); expect(localRequests).toHaveLength(1); expect(localRequests[0].items[0].value).toBe("local");
  await rightClick("分区继承"); expect(requests.at(-1).items[0].value).toBe("section");
});

for (const observable of [false, true]) test("NativeList whole-row Dropdown resets its opening guards: observable close=" + observable, async () => {
  const requests = [], ends = []; let selected = 0;
  const adapter = { open: request => {
    requests.push(request); let resolve; const closed = new Promise(yes => { resolve = yes; }); ends.push(resolve);
    return observable ? { closed } : {};
  } };
  const closed = async () => { if (observable) await act(async () => ends.at(-1)()); };
  await render(<MenuProvider value={{ menuAdapter: adapter }}><NativeList scrollable={false}><NativeListSection>
    <NativeListDropdownItem title="整行打开菜单" value="更多操作" dropdownProps={{ items: [{ value: "copy", onSelect: () => selected++ }] }} />
  </NativeListSection></NativeList></MenuProvider>);
  await act(async () => textNode("整行打开菜单").click());
  expect(requests).toHaveLength(1); expect(requests[0]).toMatchObject({ kind: "dropdown", source: "programmatic" });
  await act(async () => requests[0].select(requests[0].items[0].id)); expect(selected).toBe(1); await closed();
  await act(async () => textNode("整行打开菜单").click()); expect(requests).toHaveLength(2); await closed();
  await act(async () => textNode("更多操作").click()); expect(requests).toHaveLength(3); await closed();
  expect(requests[0].isCurrent()).toBe(false);
});
