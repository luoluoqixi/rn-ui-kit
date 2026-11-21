import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
const win = new Window({ url: "http://localhost/" });
for (const key of ["window", "document", "navigator", "HTMLElement", "HTMLButtonElement", "HTMLInputElement", "HTMLAnchorElement", "SVGElement", "Element", "Node", "NodeFilter", "Event", "MouseEvent", "KeyboardEvent", "PointerEvent", "ShadowRoot", "MutationObserver", "ResizeObserver", "CSSRuleList", "CSS"])
  globalThis[key] = key === "window" ? win : win[key];
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
globalThis.cancelAnimationFrame = clearTimeout;
const React = await import("react");
const { act } = React;
const RNW = await import("../node_modules/react-native-web/dist/index.js");
const platform = process.env.BUTTON_TEST_PLATFORM ?? "web";
const native = platform !== "web";
mock.module("react-native-web", () => RNW);
const nativeProps = [];
function interop(Component) {
  return React.forwardRef(function Interop({ className, style, ...props }, ref) {
    nativeProps.push({ ...props, className, style });
    return <Component {...props} ref={ref} style={[className === undefined ? {} : { $$css: true, tailwind: className }, style]} />;
  });
}
const NativeView = interop(RNW.View);
mock.module("react-native", () => ({ ...RNW, Platform: { ...RNW.Platform, OS: platform }, Text: interop(RNW.Text), View: NativeView, Pressable: interop(RNW.Pressable) }));
mock.module("uniwind", () => ({ withUniwind: (component) => component }));
const haptics = [];
mock.module("../src/core/components/ui/utils/haptics", () => ({ useResolvedNativeHaptics: (value) => value, triggerNativeHaptics: (value) => { if (native && value) haptics.push(value); } }));
const theme = { accent: "#2563eb", accentForeground: "#ffffff", default: "#f4f4f5", defaultForeground: "#18181b", danger: "#dc2626", dangerForeground: "#ffffff" };
mock.module("../src/core/components/ui/utils/theme", () => ({ useUiTheme: () => theme }));
const sharedValue = (value) => ({ value, get() { return this.value; }, set(next) { this.value = next; } });
const rotations = [];
const transition = { duration() { return this; }, easing() { return this; } };
mock.module("react-native-reanimated", () => ({
  default: { View: NativeView, Text: interop(RNW.Text), createAnimatedComponent: (component) => component },
  FadeIn: transition, FadeOut: transition,
  Easing: { linear: (x) => x, out: (x) => x, ease: (x) => x }, useAnimatedStyle: () => ({}),
  cancelAnimation() {}, withTiming: (x) => { rotations.push(x); return x; }, withRepeat: (x) => x,
  useSharedValue: (value) => React.useRef(sharedValue(value)).current,
}));
const svgExports = {};
for (const name of ["Svg", "Path", "Circle", "G", "Defs", "LinearGradient", "Stop", "Rect", "Line", "Polyline", "Polygon", "Ellipse", "ClipPath", "Mask", "Text", "TSpan", "Use", "Symbol", "Pattern", "Image", "RadialGradient"])
  svgExports[name] = React.forwardRef(({ children, ...props }, ref) => React.createElement(name === "Svg" ? "svg" : name.toLowerCase(), { ...props, ref }, children));
mock.module("react-native-svg", () => ({ default: svgExports.Svg, ...svgExports }));
if (native) {
  const { createContext } = await import("../node_modules/heroui-native/src/helpers/internal/utils/create-context");
  const { childrenToString } = await import("../node_modules/heroui-native/src/helpers/internal/utils/children-to-string");
  const { getElementWithDefault } = await import("../node_modules/heroui-native/src/helpers/internal/utils/get-element-with-default");
  mock.module("../node_modules/heroui-native/src/helpers/internal/utils", () => ({ createContext, childrenToString, getElementWithDefault, combineStyles: (styles) => styles }));
  mock.module("../node_modules/heroui-native/src/helpers/external/hooks", () => ({
    useTextComponent: () => ({ textProps: { allowFontScaling: false } }),
    useThemeColor: (colors) => Array.isArray(colors) ? colors.map(() => "#123456") : "#123456",
  }));
  const { HeroText } = await import("../node_modules/heroui-native/src/helpers/internal/components/hero-text");
  mock.module("../node_modules/heroui-native/src/helpers/internal/components", () => ({ HeroText, ThemeBackground: NativeView, useHasDefaultThemeBackground: () => false }));
  mock.module("../node_modules/heroui-native/src/helpers/internal/contexts", () => ({ AnimationSettingsProvider: ({ children }) => children }));
  mock.module("../node_modules/heroui-native/src/components/pressable-feedback/pressable-feedback.animation", () => ({
    PressableFeedbackRootAnimationProvider: ({ children }) => children,
    usePressableFeedbackRootAnimation: () => ({ isPressed: sharedValue(false), containerWidth: sharedValue(0), containerHeight: sharedValue(0), animationOnPressIn() {}, animationOnPressOut() {} }),
    usePressableFeedbackScaleAnimation: () => ({}), usePressableFeedbackHighlightAnimation: () => ({}),
    usePressableFeedbackRippleAnimation: () => ({ animationOnTouchStart() {}, animationOnTouchEnd() {} }),
  }));
  mock.module("../node_modules/heroui-native/src/components/spinner/spinner.animation", () => ({ useSpinnerRootAnimation: () => ({}), useSpinnerIndicatorAnimation: () => ({}) }));
  for (const [name, exportName] of [["text", "Typography"], ["button", "Button"], ["spinner", "Spinner"]]) {
    const component = await import("../node_modules/heroui-native/src/components/" + name + "/" + name);
    mock.module("heroui-native/" + name, () => ({ [exportName]: component.default }));
  }
  for (const name of ["text", "spinner", "button"]) {
    const adapter = await import("../src/core/components/ui/" + name + "/" + name + "_heroui.native");
    mock.module("../src/core/components/ui/" + name + "/" + name + "_heroui", () => adapter);
  }
}
// System renderers stay real. Only the Expo UI native-view boundary is substituted.
const systems = [];
function systemPart(name) {
  return ({ children, ...props }) => { systems.push({ name, ...props }); return <div data-system={name}>{children}</div>; };
}
if (native) {
  const parts = ["Button", "FilledTonalButton", "Host", "OutlinedButton", "Text", "TextButton", "HStack", "Image", "Label"];
  const expo = Object.fromEntries(parts.map((name) => [name, systemPart(name)]));
  mock.module("@luoluoqixi/expo-ui-55/swift-ui", () => expo);
  mock.module("@luoluoqixi/expo-ui-55/jetpack-compose", () => expo);
  const modifiers = Object.fromEntries(["height", "width", "size", "frame", "accessibilityLabel", "buttonStyle", "disabled", "foregroundStyle"].map((name) => [name, (...args) => ({ type: name, args })]));
  mock.module("@luoluoqixi/expo-ui-55/swift-ui/modifiers", () => modifiers);
  mock.module("@luoluoqixi/expo-ui-55/jetpack-compose/modifiers", () => modifiers);
  const renderer = await import("../src/core/components/ui/button/button_native." + platform);
  mock.module("../src/core/components/ui/button/button_native", () => renderer);
}
const { Button } = await import("../src/core/components/ui/button");
const { Text } = await import("../src/core/components/ui/text");
const { Icon } = await import("../src/core/components/ui/icon");
const { Mail } = await import("lucide-react-native");
const { TextFontProvider } = await import("../src/core/components/ui/provider/font_provider");
const { createRoot } = await import("react-dom/client");
let root;
const node = (id) => document.getElementById(id);
const latest = (name) => systems.findLast((props) => props.name === name);
async function settle() { await act(async () => { await new Promise((resolve) => setTimeout(resolve, 90)); }); }
async function render(content) {
  if (!root) { const mount = document.createElement("div"); document.body.append(mount); root = createRoot(mount); }
  await act(() => root.render(content)); await settle();
}
async function click(element) { await act(() => element.click()); await settle(); }
async function mouse(type, element, extra = {}) {
  await act(() => element.dispatchEvent(new win.MouseEvent(type, { bubbles: true, cancelable: true, button: 0, buttons: type === "mousedown" ? 1 : 0, ...extra })));
  await settle();
}
afterEach(async () => { await act(() => root?.unmount()); root = undefined; document.body.replaceChildren(); nativeProps.length = 0; systems.length = 0; haptics.length = 0; });

test("HeroUI sizes/variants/icon-only, title precedence, text and Icon context", async () => {
  for (const variant of ["primary", "secondary", "tertiary", "outline", "ghost", "danger", "danger-soft"]) {
    await render(<Button nativeID="button" variant={variant} isIconOnly size="sm" circular><Icon as={Mail} /></Button>);
    expect(node("button").className).toContain(native ? "button__root--variant-" + variant : "button--" + variant);
    expect(node("button").className).toContain(native ? "button__root--is-icon-only" : "button--icon-only");
    expect(node("button").className).toContain("rounded-full");
    expect(node("button").querySelector("svg").getAttribute("class")).toContain(variant.startsWith("danger") ? variant === "danger" ? "text-danger-foreground" : "text-danger-soft-foreground" : variant === "primary" ? "text-accent-foreground" : variant === "secondary" ? "text-accent-soft-foreground" : "text-default-foreground");
  }
  await render(<TextFontProvider family="ButtonTest"><Button nativeID="button" title="Priority" textClassName="font-bold" textStyle={{ fontSize: 19 }} buttonColor="#008800">Hidden</Button></TextFontProvider>);
  expect(node("button").textContent).toBe("Priority");
  const label = node("button").querySelector(native ? ".button__label" : "span");
  expect(["rgb(0, 136, 0)", "#008800", "rgba(0, 136, 0, 1.00)"]).toContain(label.style.color);
  expect(label.style.fontSize).toBe("19px");
  expect(label.style.fontFamily).toContain("ButtonTest");
  expect(label.className).toContain("font-bold");
  if (!native) expect(node("button").tagName).toBe("BUTTON");
});

test("ref, dimensions, RN style and children callbacks retain press state and a single activation", async () => {
  const ref = React.createRef(), platformRef = React.createRef();
  const events = [];
  await render(<Button nativeID="button" ref={ref} {...(native ? { herouiNativeProps: { ref: platformRef } } : { herouiWebProps: { ref: platformRef } })}
    buttonSize={{ width: 173 }} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, paddingHorizontal: 7 })}
    onPressIn={() => events.push("in")} onPressOut={() => events.push("out")}
    onPress={(event) => { expect(event.nativeEvent).toBeDefined(); events.push("press"); }}>
    {({ pressed }) => pressed ? "Pressed" : "Idle"}
  </Button>);
  expect(ref.current).toBe(platformRef.current);
  expect(typeof ref.current.measure).toBe("function");
  expect(typeof ref.current.measureInWindow).toBe("function");
  expect(node("button").style.width).toBe("173px");
  expect(node("button").style.paddingLeft).toBe("7px");
  await mouse("mousedown", node("button"));
  expect(node("button").textContent).toBe("Pressed");
  expect(node("button").style.opacity).toBe("0.6");
  await mouse("mouseup", node("button"));
  await click(node("button"));
  expect(events).toEqual(["in", "out", "press"]);
  expect(node("button").textContent).toBe("Idle");
  await render(null);
  expect(ref.current).toBeNull(); expect(platformRef.current).toBeNull();
});

test("loading and both disabled flags suppress activation and retain visible labels", async () => {
  let presses = 0;
  for (const unavailable of [{ disabled: true }, { isDisabled: true }, { loading: true }]) {
    await render(<Button nativeID="button" {...unavailable} title="Waiting" nativeHaptics onPress={() => presses++} />);
    await click(node("button"));
    expect(presses).toBe(0); expect(haptics).toHaveLength(0);
    expect(node("button").textContent).toContain("Waiting");
  }
  await render(<Button nativeID="button" loading loadingIcon={<span data-custom-spinner="true" />} title="Custom" />);
  expect(node("button").querySelector("[data-custom-spinner]")).not.toBeNull();
  expect(rotations).toContain(360);
  await render(<Button nativeID="button" nativeHaptics onPress={() => presses++} title="Ready" />);
  await click(node("button")); expect(presses).toBe(1); expect(haptics).toEqual(native ? [true] : []);
});

test("long press keeps RN cancellation; preventDefault suppresses haptics; accessibility maps correctly", async () => {
  let presses = 0, long = 0;
  await render(<Button nativeID="button" testID="test-button" accessibilityLabel="Accessible" accessibilityState={{ expanded: true }} delayLongPress={10}
    onLongPress={() => long++} onPress={() => presses++} title="Hold" />);
  expect(node("button").getAttribute("aria-label")).toBe("Accessible");
  expect(node("button").getAttribute("data-testid")).toBe("test-button");
  // RNW only dispatches long press for touch pointers. Drive the actual responder, no mocked callback.
  await act(() => {
    const event = new win.Event("touchstart", { bubbles: true, cancelable: true });
    const touch = { identifier: 0, target: node("button"), pageX: 10, pageY: 10, clientX: 10, clientY: 10 };
    event.touches = [touch]; event.changedTouches = [touch]; node("button").dispatchEvent(event);
  });
  await settle();
  await act(() => {
    const event = new win.Event("touchend", { bubbles: true, cancelable: true });
    event.touches = []; event.changedTouches = [{ identifier: 0, target: node("button"), pageX: 10, pageY: 10 }]; node("button").dispatchEvent(event);
  });
  await click(node("button"));
  expect(long).toBe(1); expect(presses).toBe(0);
  // A fresh button separates click cancellation from the post-touch emulated
  // mouse suppression window and the completed long-press responder state.
  await render(null);
  let canceledPresses = 0;
  await render(<Button nativeID="button" nativeHaptics onPress={(event) => { canceledPresses++; event.preventDefault(); }} title="Cancel" />);
  await click(node("button")); expect(canceledPresses).toBe(1); expect(haptics).toHaveLength(0);
});

if (native) {
  test("system native mode retains the real renderer, overrides, sizing, symbols and disabled state", async () => {
    let presses = 0;
    const overrides = [{ type: "custom" }];
    await render(<Button native nativeHaptics disabled={platform === "android"} nativeButtonStyle="glassProminent" nativeMatchContents={{ vertical: true, horizontal: false }}
      nativeSystemImage="heart.fill" nativeSystemImageSize={29} buttonSize={{ width: 151, height: 81 }} buttonColor="#ff0000"
      nativeComposeProps={{ colors: { contentColor: "#ffffff" }, modifiers: overrides, enabled: true }}
      nativeSwiftProps={{ modifiers: overrides }} title="Native" onPress={() => presses++} />);
    expect(latest("Host")).toBeDefined();
    expect(document.querySelector(".button,.button__root")).toBeNull();
    if (platform === "ios") {
      expect(latest("Image")).toMatchObject({ systemName: "heart.fill", size: 29 });
      expect(latest("Host").matchContents).toEqual({ vertical: true, horizontal: false });
      expect(latest("HStack").modifiers).toEqual([{ type: "frame", args: [{ width: 151, height: 81 }] }]);
      expect(latest("Button").modifiers).toEqual([
        { type: "buttonStyle", args: ["glassProminent"] }, { type: "disabled", args: [false] },
        { type: "accessibilityLabel", args: ["Native"] }, ...overrides, { type: "foregroundStyle", args: ["#ff0000"] },
      ]);
      latest("Button").onPress();
      await render(<Button native nativeSwiftProps={{ label: "Override", systemImage: "plus", children: <span>Custom Swift</span> }} title="Fallback" disabled />);
      expect(document.body.textContent).toContain("Custom Swift");
      expect(latest("Button").modifiers).toContainEqual({ type: "disabled", args: [true] });
    } else {
      expect(latest("Button")).toMatchObject({ enabled: true, colors: { contentColor: "#ff0000" }, modifiers: overrides });
      latest("Button").onClick();
      await render(<Button native buttonSize={{ width: 123 }} variant="outline" title="Outline" disabled />);
      expect(latest("OutlinedButton")).toMatchObject({ enabled: false, modifiers: [{ type: "width", args: [123] }] });
      for (const [variant, renderer] of [["primary", "Button"], ["secondary", "FilledTonalButton"], ["tertiary", "FilledTonalButton"], ["ghost", "TextButton"], ["danger", "Button"], ["danger-soft", "FilledTonalButton"]]) {
        systems.length = 0;
        await render(<Button native variant={variant} title={variant} />);
        expect(latest(renderer)).toBeDefined();
        if (variant === "danger") expect(latest(renderer).colors.containerColor).toBe(theme.danger);
        if (variant === "danger-soft") expect(latest(renderer).colors.contentColor).toBe(theme.danger);
      }
    }
    expect(presses).toBe(1); expect(haptics).toEqual(native ? [true] : []);
  });
} else {
  test("web native=true falls back to HeroUI; DOM platform callbacks are genuine and fire once", async () => {
    const events = [];
    await render(<Button native nativeID="button" title="Fallback" onPress={() => events.push("rn")}
      herouiWebProps={{ type: "button", onPress: (event) => events.push(event.pointerType), onClick: (event) => { expect(event.currentTarget.tagName).toBe("BUTTON"); } }} />);
    expect(node("button").tagName).toBe("BUTTON");
    await click(node("button"));
    expect(events).toEqual(["virtual", "rn"]);
  });
}

if (!native) test("keyboard presses normalize real DOM events for RN callbacks and activate once", async () => {
  const presses = [];
  await render(<Button nativeID="button" onPressIn={(event) => {
    expect(typeof event.persist).toBe("function");
    expect(event.nativeEvent.type).toBe("keydown");
    expect(event.currentTarget).toBe(node("button"));
    presses.push("in");
  }} onPressOut={(event) => {
    expect(event.nativeEvent.type).toBe("keyup");
    expect(event.currentTarget).toBe(node("button"));
    presses.push("out");
  }} onPress={() => presses.push("press")}>
    {({ pressed }) => pressed ? "Keyboard pressed" : "Idle"}
  </Button>);
  for (const [key, code] of [["Enter", "Enter"], [" ", "Space"]]) {
    presses.length = 0;
    await act(() => { node("button").focus(); node("button").dispatchEvent(new win.KeyboardEvent("keydown", { bubbles: true, cancelable: true, key, code })); });
    await settle();
    expect(node("button").textContent).toBe("Keyboard pressed");
    await act(() => node("button").dispatchEvent(new win.KeyboardEvent("keydown", { bubbles: true, cancelable: true, key, code, repeat: true })));
    expect(presses).toEqual(["in"]);
    await act(() => node("button").dispatchEvent(new win.KeyboardEvent("keyup", { bubbles: true, cancelable: true, key, code })));
    await settle();
    expect(node("button").textContent).toBe("Idle");
    expect(presses).toEqual(["in", "out", "press"]);
  }
});

if (!native) test("scroll, disabling and unmounting end an active Web press without stale state", async () => {
  const events = [];
  const content = (disabled = false) => <Button nativeID="button" disabled={disabled}
    onPressIn={() => events.push("in")} onPressOut={() => events.push("out")}>
    {({ pressed }) => pressed ? "Pressed" : "Idle"}
  </Button>;
  await render(content());
  await mouse("mousedown", node("button"));
  expect(node("button").textContent).toBe("Pressed");
  await act(() => document.dispatchEvent(new win.Event("scroll")));
  await settle();
  expect(node("button").textContent).toBe("Idle");
  expect(events).toEqual(["in", "out"]);
  events.length = 0;
  await mouse("mousedown", node("button"));
  await render(content(true));
  expect(node("button").textContent).toBe("Idle");
  expect(events).toEqual(["in", "out"]);
  await render(content());
  expect(node("button").textContent).toBe("Idle");
  events.length = 0;
  await mouse("mousedown", node("button"));
  await render(null);
  await mouse("mouseup", document);
  expect(events).toEqual(["in", "out"]);
});
