import { afterEach, expect, mock, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { transformSync } from "@babel/core";
import { Window } from "happy-dom";

const win = new Window({ url: "http://localhost/" });
for (const key of ["window", "document", "navigator", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "ShadowRoot"])
  globalThis[key] = key === "window" ? win : win[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.__DEV__ = false;
const React = await import("react");
const { act } = React;
const { createRoot } = await import("react-dom/client");
const RNW = await import("react-native-web");
const platform = process.env.BASIC_LIST_PLATFORM ?? "web";
const pressables = [];
const nativeMenus = [];
function interop(Component, isPressable = false) {
  return React.forwardRef(({ className, style, unstable_pressDelay, ...props }, ref) => {
    if (isPressable) pressables.push({ ...props, unstable_pressDelay });
    const css = className ? { $$css: true, tailwind: className } : {};
    return <Component {...props} ref={ref}
      {...(isPressable ? { delayPressIn: props.delayPressIn ?? unstable_pressDelay } : {})}
      style={typeof style === "function" ? state => [css, style(state)] : [css, style]} />;
  });
}
const View = interop(RNW.View);
mock.module("react-native", () => ({ ...RNW, Platform: { ...RNW.Platform, OS: platform }, View, Pressable: interop(RNW.Pressable, true) }));
mock.module("@react-navigation/native", () => ({ NavigationContext: React.createContext(undefined) }));
mock.module("lucide-react-native", () => Object.fromEntries(["Check", "CheckCircle2", "ChevronRight", "Circle"].map(name => [name, () => null])));
mock.module("../src/core/components/ui/native_list/input_control", () => ({ Input: RNW.TextInput }));
mock.module("../src/core/components/ui/native_list/textarea_control", () => ({ Textarea: RNW.TextInput }));
mock.module("../src/core/components/ui/context_menu", () => ({ ContextMenu: React.forwardRef(({ trigger, __menuRef }, ref) => {
  React.useImperativeHandle(__menuRef ?? ref, () => ({ presentMenu: () => nativeMenus.push("open") }));
  return trigger;
}) }));
mock.module("../src/core/components/ui/dropdown", () => ({ Dropdown: () => null }));
mock.module("../src/core/components/ui/select", () => ({ Select: () => null }));
mock.module("../src/core/components/ui/switch", () => ({ Switch: () => null }));
mock.module("../src/core/components/ui/text", () => ({ Text: RNW.Text }));
mock.module("../src/core/components/ui/scroll_view", () => ({ ScrollView: View }));
mock.module("../src/core/components/ui/utils", () => ({ triggerNativeHaptics() {} }));
mock.module("../src/core/components/ui/utils/platform", () => ({ isIos15: () => false }));
mock.module("../src/core/components/ui/utils/theme", () => ({
  useUiTheme: () => ({ surface: "white", border: "gray", muted: "#71717a", foreground: "black", accent: "blue", accent04: "lightblue", accent03: "lightgray" }),
  useAppBackgroundColors: () => ({ screen: "#f4f4f5", card: "white" }),
}));
const { NativeList, NativeListSection, NativeListItem, NativeListCustomItem } = await import("../src/core/components/ui/native_list/native_list_basic");
const { NATIVE_LIST_BASIC_PRESS_DELAY } = await import("../src/core/components/ui/native_list/constants");
let root;
afterEach(async () => {
  await act(() => root?.unmount()); root = undefined; document.body.replaceChildren(); pressables.length = 0; nativeMenus.length = 0;
});
async function render(props = {}, children = [
  <NativeListItem key="standard" title="标准行" onPress={() => {}} />,
  <NativeListCustomItem key="custom" onPress={() => {}}>自定义行</NativeListCustomItem>,
]) {
  root ??= createRoot(document.body.appendChild(document.createElement("div")));
  pressables.length = 0;
  await act(() => root.render(<NativeList scrollable={false} {...props}><NativeListSection title="分区">{children}</NativeListSection></NativeList>));
}
test("standard and custom rows inherit automatic/immediate feedback without adding long-press handlers", async () => {
  for (const [mode, expected] of [[undefined, platform === "web" ? 0 : NATIVE_LIST_BASIC_PRESS_DELAY], ["immediate", 0], ["automatic", NATIVE_LIST_BASIC_PRESS_DELAY]]) {
    await render({ basicPressFeedback: mode });
    expect(pressables).toHaveLength(2);
    for (const props of pressables) {
      expect(props[platform === "web" ? "delayPressIn" : "unstable_pressDelay"]).toBe(expected);
      expect(props[platform === "web" ? "unstable_pressDelay" : "delayPressIn"]).toBeUndefined();
      expect(props.onLongPress).toBeUndefined();
    }
  }
});
test("rounded/plain/full-width share theme shadows and preserve explicit overrides and divider geometry", async () => {
  for (const listStyle of ["rounded", "plain", "plainFullWidth"]) {
    await render({ listStyle });
    const shadow = document.querySelector(".shadow-surface");
    expect(shadow).not.toBeNull();
    expect(shadow.classList.contains(listStyle === "rounded" ? "rounded-3xl" : "rounded-none")).toBe(true);
    const body = shadow.firstElementChild;
    expect(win.getComputedStyle(body).overflowX).toBe(listStyle === "rounded" ? "hidden" : "visible");
    const section = shadow.parentElement;
    expect(win.getComputedStyle(section).paddingLeft).toBe(listStyle === "plainFullWidth" ? "0px" : "16px");
    const divider = body.lastElementChild.lastElementChild;
    expect(win.getComputedStyle(divider).height).toBe("1px");
    expect(win.getComputedStyle(divider).left).toBe("16px");
    expect(win.getComputedStyle(divider).top).toBe("0px");
  }
  await render({ listStyleOptions: { borderRadius: 9, sectionShadow: false, showBorder: true, borderWidth: 2 } });
  expect(document.querySelector(".shadow-surface")).toBeNull();
  const shadow = document.querySelector(".shadow-none");
  expect(shadow.style.borderRadius).toBe("9px");
  expect(shadow.firstElementChild.style.borderRadius).toBe("9px");
  expect(shadow.firstElementChild.style.borderWidth).toBe("2px");
  await render({ listStyleOptions: { sectionShadow: { boxShadow: "0 1px 5px black" } } });
  expect(document.querySelector(".shadow-none").style.boxShadow).toBe("0 1px 5px black");
});
test("Android long-press menu remains opt-in on both row forms", async () => {
  const contextMenuProps = { items: [{ value: "copy", label: "复制" }] };
  await render({ contextMenuProps });
  if (platform === "android") {
    expect(pressables.every(props => typeof props.onLongPress === "function")).toBe(true);
    pressables.forEach(props => props.onLongPress());
    expect(nativeMenus).toHaveLength(2);
  } else expect(pressables.every(props => props.onLongPress === undefined)).toBe(true);
});

// Exercise the installed responder implementations, not a hand-written
// pressed-state mock. Only the native bridge and deterministic clock are fake.
const require = createRequire(import.meta.url);
let PressResponder;
if (platform === "web") {
  PressResponder = (await import("../node_modules/react-native-web/dist/modules/usePressEvents/PressResponder.js")).default;
} else {
  const source = new URL("../node_modules/react-native/Libraries/Pressability/Pressability.js", import.meta.url);
  const { code } = transformSync(readFileSync(source, "utf8"), {
    filename: source.pathname, configFile: false, babelrc: false,
    presets: [[require.resolve("@react-native/babel-preset"), { disableImportExportTransform: false }]],
  });
  const module = { exports: {} };
  const dependencies = {
    "../../src/private/featureflags/ReactNativeFeatureFlags": { shouldPressibilityUseW3CPointerEventsForHover: () => false },
    "../Components/Sound/SoundManager": { playTouchSound() {} },
    "../ReactNative/UIManager": {},
    "../StyleSheet/Rect": { normalizeRect: rect => ({ top: 0, bottom: 0, left: 0, right: 0, ...rect }) },
    "../Utilities/Platform": { OS: platform },
    "./HoverState": { isHoverEnabled: () => false },
    "./PressabilityPerformanceEventEmitter.js": { emitEvent() {} },
  };
  new Function("require", "module", "exports", code)(name => dependencies[name] ?? require(name), module, module.exports);
  PressResponder = module.exports.default;
}
function withClock(run) {
  const originals = { setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout, now: Date.now };
  let now = 1000, id = 0; const timers = new Map();
  globalThis.setTimeout = (fn, delay = 0) => { timers.set(++id, { fn, due: now + delay }); return id; };
  globalThis.clearTimeout = timer => timers.delete(timer); Date.now = () => now;
  const advance = ms => {
    const end = now + ms;
    while (true) {
      const next = [...timers].filter(([, timer]) => timer.due <= end).sort((a, b) => a[1].due - b[1].due)[0];
      if (!next) break; timers.delete(next[0]); now = next[1].due; next[1].fn();
    }
    now = end;
  };
  try { run(advance); } finally { globalThis.setTimeout = originals.setTimeout; globalThis.clearTimeout = originals.clearTimeout; Date.now = originals.now; }
}
function responder(delay = NATIVE_LIST_BASIC_PRESS_DELAY, onLongPress) {
  const events = [];
  const config = { onPress: () => events.push("press"), onLongPress,
    ...(platform === "web" ? { delayPressStart: delay, onPressStart: () => events.push("in"), onPressEnd: () => events.push("out") }
      : { delayPressIn: delay, onPressIn: () => events.push("in"), onPressOut: () => events.push("out") }),
  };
  const instance = new PressResponder(config), handlers = instance.getEventHandlers();
  const target = { measure: fn => fn(0, 0, 300, 56, 0, 0), tagName: "DIV", getAttribute: () => "button" };
  const event = { currentTarget: target, target, persist() {}, stopPropagation() {}, preventDefault() {}, altKey: false,
    nativeEvent: { type: "touchstart", pageX: 20, pageY: 20, touches: [{ pageX: 20, pageY: 20 }], changedTouches: [{ pageX: 20, pageY: 20 }] } };
  return { events, instance,
    down: () => handlers.onResponderGrant(event),
    cancel: () => handlers.onResponderTerminate(event),
    up: () => { handlers.onResponderRelease(event); if (platform === "web") handlers.onClick(event); },
  };
}
test("scroll cancellation before activation never paints or clicks, including a later new gesture", () => withClock(advance => {
  const press = responder(); press.down(); advance(129); expect(press.events).toEqual([]);
  press.cancel(); advance(1000); expect(press.events).toEqual([]);
  press.down(); advance(130); expect(press.events).toEqual(["in"]);
  press.up(); advance(150); expect(press.events.filter(value => value === "press")).toHaveLength(1);
  expect(press.events).toContain("out"); press.instance.reset();
}));
test("quick release clicks immediately; delay does not defer navigation", () => withClock(advance => {
  const press = responder(); press.down(); advance(20); press.up();
  expect(press.events.filter(value => value === "press")).toHaveLength(1);
  advance(1000); expect(press.events.filter(value => value === "in")).toHaveLength(1); press.instance.reset();
}));
test("held press has no timeout cleanup; scrolling after activation clears it", () => withClock(advance => {
  const press = responder(); press.down(); advance(2000); expect(press.events).toEqual(["in"]);
  press.cancel(); advance(1000); expect(press.events).toEqual(["in", "out"]); press.instance.reset();
}));
test("immediate and unmounted presses leave no delayed activation", () => withClock(advance => {
  const immediate = responder(0); immediate.down(); expect(immediate.events).toEqual(["in"]);
  immediate.cancel(); advance(1000); expect(immediate.events).toEqual(["in", "out"]); immediate.instance.reset();
  const unmounted = responder(); unmounted.down(); unmounted.instance.reset(); advance(1000); expect(unmounted.events).toEqual([]);
}));
test("long hold without menu still clicks, while an actual menu consumes the click", () => withClock(advance => {
  const plain = responder(); plain.down(); advance(2000); plain.up(); advance(150); expect(plain.events).toContain("press"); plain.instance.reset();
  let menus = 0; const menu = responder(NATIVE_LIST_BASIC_PRESS_DELAY, () => menus++);
  menu.down(); advance(1000); expect(menus).toBe(1); menu.up(); advance(150); expect(menu.events).not.toContain("press"); menu.instance.reset();
}));
