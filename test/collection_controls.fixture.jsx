import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
const win = new Window({ url: "http://localhost/" });
for (const key of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLButtonElement",
  "HTMLAnchorElement",
  "HTMLInputElement",
  "HTMLTextAreaElement",
  "SVGElement",
  "Element",
  "Node",
  "NodeFilter",
  "HTMLLabelElement",
  "Event",
  "InputEvent",
  "MouseEvent",
  "KeyboardEvent",
  "PointerEvent",
  "ShadowRoot",
  "MutationObserver",
  "ResizeObserver",
  "CSSRuleList",
  "CSS",
])
  globalThis[key] = key === "window" ? win : win[key];
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
globalThis.cancelAnimationFrame = clearTimeout;
const React = await import("react");
const { act } = React;
const RNW = await import("react-native-web");
const platform = process.env.BATCH_TEST_PLATFORM ?? "web";
const native = platform !== "web";
const nativeProps = [];
const openedURLs = [];
function interop(Component) {
  return React.forwardRef(function Interop(
    { className, style, ...props },
    ref,
  ) {
    nativeProps.push({ ...props, className, style });
    return (
      <Component
        {...props}
        ref={ref}
        style={[
          className === undefined ? {} : { $$css: true, tailwind: className },
          style,
        ]}
      />
    );
  });
}
const NativeView = interop(RNW.View);
mock.module("react-native", () => ({
  ...RNW,
  Platform: { ...RNW.Platform, OS: platform, constants: { reactNativeVersion: { major: 0, minor: 83, patch: 9 } } },
  Text: interop(RNW.Text),
  View: NativeView,
  Pressable: interop(RNW.Pressable),
  TextInput: interop(RNW.TextInput),
  Linking: { openURL: async (url) => openedURLs.push(url) },
}));
mock.module("uniwind", () => ({ withUniwind: (component) => component, useCSSVariable: () => "#123456" }));
const haptics = [];
mock.module("../src/core/components/ui/utils/haptics", () => ({
  useResolvedNativeHaptics: (value) => value ?? true,
  triggerNativeHaptics: (value) => { if (native && value) haptics.push(value); },
}));

const sharedValue = value => ({ value, get() { return this.value; }, set(v) { this.value = v; } });
const scrollCallbacks = [], shadowLayouts = [], scheduled = [];
const rootAnimations = [], highlightAnimations = [], rippleAnimations = [];
const highlightInstances = [], rippleInstances = [];
const feedbackContext = React.createContext(null);
function useFeedbackInstance(animation, instances) {
  const press = React.useContext(feedbackContext);
  const instance = React.useRef({ residualOpacity: 0, mounted: false }).current;
  instance.animation = animation; instance.press = press; instances.push(instance);
  React.useLayoutEffect(() => { instance.mounted = true; return () => { instance.mounted = false; }; }, [instance]);
  return instance;
}
const mountedFeedback = () => [...new Set([...highlightInstances, ...rippleInstances])].filter(instance => instance.mounted);
function hasVisibleAncestors(node) {
  for (let current = node; current; current = current.parentElement)
    if (current.style.opacity === "0" || current.style.display === "none") return false;
  return true;
}
const visibleFeedback = () => [...document.querySelectorAll('.pressable-feedback__highlight, .pressable-feedback__ripple-container')]
  .filter(node => hasVisibleAncestors(node) && (node.className.includes("__highlight")
    || [...node.querySelectorAll('.pressable-feedback__ripple')].some(layer => hasVisibleAncestors(layer))));
// Reanimated can retain opacity on its own native view after animated styles
// are detached. Model that retained paint separately from HappyDOM's static
// style precedence; opacity on an ordinary ancestor still composites normally.
function retainedNativeFeedbackIsVisible(button, instance) {
  return instance.mounted && instance.residualOpacity > 0
    && [...button.querySelectorAll('.pressable-feedback__highlight, .pressable-feedback__ripple')]
      .some(layer => layer.style.display !== "none" && hasVisibleAncestors(layer.parentElement));
}
let accentSoftHover = "#d1478c33";
const themeColor = key => key === "accent-soft-hover" ? accentSoftHover : key === "default-hover" ? "#e0e0e0" : "#123456";
const useThemeColor = keys => Array.isArray(keys) ? keys.map(themeColor) : themeColor(keys);
mock.module("react-native-worklets", () => ({ scheduleOnRN: (fn, ...args) => { scheduled.push(args); fn(...args); } }));
const svg = {};
for (const name of ["Svg", "Path", "Circle", "G", "Defs", "LinearGradient", "Stop", "Rect", "Line", "Polyline", "Polygon", "Ellipse", "ClipPath", "Mask", "Text", "TSpan", "Use", "Symbol", "Pattern", "Image", "RadialGradient"])
  svg[name] = React.forwardRef(({ children, ...props }, ref) => React.createElement(name === "Svg" ? "svg" : name.toLowerCase(), { ...props, ref }, children));
mock.module("react-native-svg", () => ({ default: svg.Svg, ...svg }));
if (native) {
  const transition = { duration() { return this; }, easing() { return this; } };
  mock.module("react-native-reanimated", () => ({
    default: { View: NativeView, Text: interop(RNW.Text), createAnimatedComponent: component => component },
    FadeIn: transition, FadeOut: transition, Easing: { linear: x => x, out: x => x, ease: x => x },
    useSharedValue: value => React.useRef(sharedValue(value)).current,
    useAnimatedStyle: () => ({}), useReducedMotion: () => true, withTiming: x => x, withRepeat: x => x, cancelAnimation() {},
    useAnimatedScrollHandler: callback => {
      const fn = event => callback(event.nativeEvent ?? event); scrollCallbacks.push(fn); return fn;
    },
    useComposedEventHandler: handlers => event => { for (const fn of handlers) fn(event); },
  }));
  const { createContext } = await import("../node_modules/heroui-native/src/helpers/internal/utils/create-context");
  const { childrenToString } = await import("../node_modules/heroui-native/src/helpers/internal/utils/children-to-string");
  const { getElementWithDefault } = await import("../node_modules/heroui-native/src/helpers/internal/utils/get-element-with-default");
  const animationUtils = await import("../node_modules/heroui-native/src/helpers/internal/utils/animation");
  mock.module("../node_modules/heroui-native/src/helpers/internal/utils", () => ({ ...animationUtils, createContext, childrenToString, getElementWithDefault, combineStyles: styles => styles, easeGradient: () => ({ colors: ["#123456", "#12345600"], locations: [0, 1] }) }));
  const { useControllableState } = await import("../node_modules/heroui-native/src/helpers/internal/hooks/use-controllable-state");
  mock.module("../node_modules/heroui-native/src/helpers/internal/hooks", () => ({ useControllableState, useIsRTL: () => false }));
  const FieldContext = React.createContext(null);
  const SurfaceContext = React.createContext(false);
  mock.module("../node_modules/heroui-native/src/helpers/internal/contexts", () => ({
    AnimationSettingsProvider: ({ children }) => children, FormFieldProvider: FieldContext.Provider, useFormField: () => React.useContext(FieldContext),
    useLayoutDirectionContext: () => null, SurfaceProvider: SurfaceContext.Provider, useSurface: () => React.useContext(SurfaceContext),
  }));
  const { HeroText } = await import("../node_modules/heroui-native/src/helpers/internal/components/hero-text");
  const { HeroTextInput } = await import("../node_modules/heroui-native/src/helpers/internal/components/hero-text-input");
  mock.module("../node_modules/heroui-native/src/helpers/internal/components", () => ({ HeroText, HeroTextInput, CloseIcon: () => <svg />, ThemeBackground: NativeView, useHasDefaultThemeBackground: () => false }));
  mock.module("../node_modules/heroui-native/src/helpers/external/hooks", () => ({
    useTextInputComponent: () => ({ textInputProps: {} }), useTextComponent: () => ({ textProps: {} }), useIsOnSurface: () => false,
    useThemeColor,
  }));
  mock.module("heroui-native/hooks", () => ({ useThemeColor }));
  mock.module("heroui-native/theme-background", () => ({ useHasDefaultThemeBackground: () => false }));
  for (const [name, hook] of [["label", "useLabelRootAnimation"], ["description", "useDescriptionAnimation"], ["field-error", "useFieldErrorRootAnimation"], ["tag-group", "useTagGroupRootAnimation"], ["surface", "useSurfaceRootAnimation"], ["search-field", "useSearchFieldRootAnimation"]])
    mock.module("../node_modules/heroui-native/src/components/" + name + "/" + name + ".animation", () => ({ [hook]: () => ({}) }));
  mock.module("../node_modules/heroui-native/src/components/pressable-feedback/pressable-feedback.animation", () => ({
    PressableFeedbackRootAnimationProvider: feedbackContext.Provider,
    usePressableFeedbackRootAnimation: ({ animation }) => {
      rootAnimations.push(animation);
      const press = React.useRef({ isPressed: sharedValue(false), containerWidth: sharedValue(0), containerHeight: sharedValue(0) }).current;
      return { ...press, animationOnPressIn() { press.isPressed.set(true); }, animationOnPressOut() { press.isPressed.set(false); } };
    },
    usePressableFeedbackScaleAnimation: () => ({}), usePressableFeedbackHighlightAnimation: ({ animation }) => {
      // Keep an in-flight animation across renders, as a real UI-thread fade would.
      useFeedbackInstance(animation, highlightInstances); highlightAnimations.push(animation); return {};
    },
    usePressableFeedbackRippleAnimation: ({ animation }) => {
      const instance = useFeedbackInstance(animation, rippleInstances); rippleAnimations.push(animation);
      return { animationOnTouchStart(event) { instance.lastTouch = event.nativeEvent; }, animationOnTouchEnd() {} };
    },
  }));
  mock.module("../node_modules/heroui-native/src/components/scroll-shadow/scroll-shadow.animation", () => ({
    useScrollShadowRootAnimation: () => ({ contentSize: { set(v) { shadowLayouts.push(["content", v]); } }, containerSize: { set(v) { shadowLayouts.push(["viewport", v]); } }, localScrollHandler: () => {}, topShadowStyle: {}, bottomShadowStyle: {} }),
  }));
  const Scroll = React.forwardRef((props, ref) => { scrollCallbacks.push(props); return <RNW.ScrollView {...props} ref={ref} />; });
  mock.module("../src/core/components/ui/scroll_view", () => ({ ScrollView: Scroll }));
  for (const [name, exportName] of [["text", "Typography"], ["label", "Label"], ["description", "Description"], ["field-error", "FieldError"], ["button", "Button"], ["close-button", "CloseButton"], ["pressable-feedback", "PressableFeedback"], ["surface", "Surface"], ["tag-group", "TagGroup"], ["scroll-shadow", "ScrollShadow"], ["search-field", "SearchField"]]) {
    const part = await import("../node_modules/heroui-native/src/components/" + name + "/" + name);
    mock.module("heroui-native/" + name, () => ({ [exportName]: part.default }));
  }
  const parts = await import("../src/core/components/ui/utils/field_parts_heroui.native");
  mock.module("../src/core/components/ui/utils/field_parts_heroui", () => parts);
  for (const name of ["text", "label", "close_button", "toggle", "toggle_group", "tag_group", "surface", "pressable_feedback", "search_field", "scroll_shadow"]) {
    const adapter = await import("../src/core/components/ui/" + name + "/" + name + "_heroui.native");
    mock.module("../src/core/components/ui/" + name + "/" + name + "_heroui", () => adapter);
  }

}
const { CloseButton } = await import("../src/core/components/ui/close_button");
const { Toggle } = await import("../src/core/components/ui/toggle");
const { ToggleGroup } = await import("../src/core/components/ui/toggle_group");
const { TagGroup } = await import("../src/core/components/ui/tag_group");
const { Surface } = await import("../src/core/components/ui/surface");
const { PressableFeedback } = await import("../src/core/components/ui/pressable_feedback");
const { ScrollShadow } = await import("../src/core/components/ui/scroll_shadow");
const { SearchField } = await import("../src/core/components/ui/search_field");
const { Text } = await import("../src/core/components/ui/text");
const { TextFontProvider } = await import("../src/core/components/ui/provider/font_provider");
const { createRoot } = await import("react-dom/client");
let root;
const ext = props => native ? { herouiNativeProps: props } : { herouiWebProps: props };
const byLabel = label => [...document.querySelectorAll("[aria-label]")].find(node => node.getAttribute("aria-label") === label);
const selected = node => (node.getAttribute("aria-pressed") ?? node.getAttribute("aria-checked") ?? node.getAttribute("aria-selected")) === "true";
async function settle() { await act(async () => { await new Promise(resolve => setTimeout(resolve, 30)); }); }
async function render(content) {
  if (!root) { const mount = document.createElement("div"); document.body.append(mount); root = createRoot(mount); }
  await act(() => root.render(content)); await settle();
}
async function click(node) { expect(node).toBeTruthy(); await act(() => node.click()); await settle(); }
async function key(node, key) {
  await act(() => node.dispatchEvent(new win.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })));
  await act(() => node.dispatchEvent(new win.KeyboardEvent("keyup", { key, bubbles: true, cancelable: true })));
  await settle();
}
async function input(value) {
  const node = document.querySelector("input");
  await act(() => {
    Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, "value").set.call(node, value);
    node.dispatchEvent(new win.Event("input", { bubbles: true }));
    node.dispatchEvent(new win.Event("change", { bubbles: true }));
  }); await settle();
}
afterEach(async () => { await act(() => root?.unmount()); root = undefined; document.body.replaceChildren(); nativeProps.length=0; haptics.length=0; scrollCallbacks.length=0; shadowLayouts.length=0; scheduled.length=0; rootAnimations.length=0; highlightAnimations.length=0; rippleAnimations.length=0; highlightInstances.length=0; rippleInstances.length=0; accentSoftHover="#d1478c33"; });

test("CloseButton is a real close action, ref and disabled behavior", async () => {
  const ref = React.createRef(); let count = 0;
  await render(<CloseButton {...ext({ ref })} onPress={() => count++} />);
  expect(ref.current).toBeTruthy(); expect(byLabel("关闭").querySelector("svg")).toBeTruthy();
  await click(byLabel("关闭")); expect(count).toBe(1); expect(haptics.length).toBe(native ? 1 : 0);
  await render(<CloseButton isDisabled onPress={() => count++} />); await click(byLabel("关闭")); expect(count).toBe(1);
  await render(null); expect(ref.current).toBeNull();
});

test("Toggle controlled/uncontrolled selection, render title and disabled", async () => {
  const changes=[];
  await render(<Toggle accessibilityLabel="粗体" defaultSelected title={s => s.isSelected ? "开启" : "关闭"} onSelectedChange={v => changes.push(v)} />);
  expect(selected(byLabel("粗体"))).toBe(true); expect(document.body.textContent).toContain("开启");
  await click(byLabel("粗体")); expect(selected(byLabel("粗体"))).toBe(false); expect(changes).toEqual([false]);
  await render(<Toggle accessibilityLabel="粗体" isSelected title="选中" onSelectedChange={v=>changes.push(v)} />);
  await click(byLabel("粗体")); expect(selected(byLabel("粗体"))).toBe(true); expect(changes).toEqual([false,false]);
  await render(<Toggle accessibilityLabel="粗体" isDisabled isSelected onSelectedChange={v=>changes.push(v)} />);
  await click(byLabel("粗体")); expect(changes).toHaveLength(2);
});

const items=[{id:"a",title:"第一项",accessibilityLabel:"第一项"},{id:"b",title:"第二项",accessibilityLabel:"第二项"},{id:"c",title:"第三项",accessibilityLabel:"第三项",isDisabled:true}];
if (platform === "android") test("Android connected ToggleGroup clears the inline edges using unambiguous Native corner props", async () => {
  const { androidCornerProbe } = await import("./toggle_group_android_styles");
  const probe = await androidCornerProbe();
  const buttonStyle = label => RNW.StyleSheet.flatten(nativeProps.findLast(p => p.accessibilityLabel === label).style);
  for (const size of ["sm", "md", "lg"]) {
    for (const orientation of ["horizontal", "vertical"]) {
      for (const gap of [0, 8]) {
        await render(<ToggleGroup accessibilityLabel="安卓圆角" size={size} orientation={orientation} gap={gap} items={items} />);
        for (const [index, item] of items.entries()) {
          const props = nativeProps.findLast(p => p.accessibilityLabel === item.accessibilityLabel);
          const style = { ...probe.style(props.className), ...buttonStyle(item.accessibilityLabel) };
          const radius = style.borderRadius;
          expect(radius).toBeGreaterThan(0);
          for (const direction of [0, 1]) { // LTR and the standard RTL configuration.
            const expected = { topLeft: radius, topRight: radius, bottomLeft: radius, bottomRight: radius };
            if (gap === 0) {
              const start = orientation === "vertical" ? ["topLeft", "topRight"] : direction === 0 ? ["topLeft", "bottomLeft"] : ["topRight", "bottomRight"];
              const end = orientation === "vertical" ? ["bottomLeft", "bottomRight"] : direction === 0 ? ["topRight", "bottomRight"] : ["topLeft", "bottomLeft"];
              if (index > 0) for (const key of start) expected[key] = 0;
              if (index < items.length - 1) for (const key of end) expected[key] = 0;
            }
            expect(probe.resolve(style, direction)).toEqual(expected);
          }
        }
      }
    }
  }
  await render(<ToggleGroup accessibilityLabel="安卓圆角" items={items} />);
  const first = buttonStyle("第一项"), middle = buttonStyle("第二项"), last = buttonStyle("第三项");
  expect(first).toMatchObject({ borderTopEndRadius: 0, borderBottomEndRadius: 0 });
  expect(first.borderTopStartRadius).toBeUndefined();
  expect(first.borderBottomStartRadius).toBeUndefined();
  expect(middle).toMatchObject({ borderTopStartRadius: 0, borderBottomStartRadius: 0, borderTopEndRadius: 0, borderBottomEndRadius: 0 });
  expect(last).toMatchObject({ borderTopStartRadius: 0, borderBottomStartRadius: 0 });
  expect(last.borderTopEndRadius).toBeUndefined();
  expect(last.borderBottomEndRadius).toBeUndefined();
  for (const item of items) {
    expect(byLabel(item.accessibilityLabel).className).not.toMatch(/rounded-[se]-none/);
    expect(buttonStyle(item.accessibilityLabel).borderRadius).toBeUndefined(); // HeroUI still owns the outer radius.
  }
  for (const props of [{ gap: 8 }, { orientation: "vertical" }, { items: [items[0]] }]) {
    await render(<ToggleGroup accessibilityLabel="安卓圆角" items={items} {...props} />);
    for (const key of ["borderTopEndRadius", "borderBottomEndRadius", "borderTopStartRadius", "borderBottomStartRadius"])
      expect(buttonStyle("第一项")[key]).toBeUndefined();
  }
  const ref = React.createRef();
  await render(<ToggleGroup accessibilityLabel="安卓圆角" items={[{ ...items[0], herouiNativeProps: { ref, style: [{ opacity: 0.8 }, { borderTopEndRadius: 7 }] } }, items[1]]} />);
  expect(buttonStyle("第一项")).toMatchObject({ opacity: 0.8, borderTopEndRadius: 7, borderBottomEndRadius: 0 });
  expect(ref.current).toBe(byLabel("第一项"));
});

test("ToggleGroup attached edges, short noninteractive dividers and gap-driven scaling", async () => {
  await render(<ToggleGroup accessibilityLabel="工具组" items={items} />);
  const group = byLabel("工具组");
  expect(parseFloat(group.style.gap)).toBe(0);
  expect(group.querySelectorAll('[role="button"], [role="radio"], button')).toHaveLength(3);
  if (native) {
    if (platform === "ios") {
      expect(byLabel("第一项").className).toContain("rounded-e-none");
      expect(byLabel("第一项").className).not.toContain("rounded-s-none");
      expect(byLabel("第二项").className).toContain("rounded-s-none");
      expect(byLabel("第二项").className).toContain("rounded-e-none");
      expect(byLabel("第三项").className).not.toContain("rounded-e-none");
    }
    expect(rootAnimations.slice(-3)).toEqual([false, false, false]);
    expect(highlightAnimations.length).toBeGreaterThanOrEqual(3);
    const dividers = group.querySelectorAll('.opacity-15');
    expect(dividers).toHaveLength(2);
    expect(dividers[0].style.height).toBe("50%");
    expect(dividers[0].style.width).toBe("1px");
    expect(nativeProps.findLast(p => p.className?.includes("opacity-15")).pointerEvents).toBe("none");
    expect(nativeProps.findLast(p => p.className?.includes("opacity-15")).accessible).toBe(false);
  } else {
    expect(group.querySelectorAll('[data-slot="toggle-button-group-separator"]')).toHaveLength(2);
    expect(byLabel("第一项").className).toContain("data-[pressed=true]:transform-none!");
  }
  await render(<ToggleGroup accessibilityLabel="工具组" gap={6} items={items} />);
  expect(byLabel("工具组").style.gap).toBe("6px");
  expect(document.querySelectorAll(native ? '.opacity-15' : '[data-slot="toggle-button-group-separator"]')).toHaveLength(0);
  if (native) {
    expect(byLabel("第一项").className).not.toContain("rounded-e-none");
    expect(rootAnimations.slice(-3)).toEqual([undefined, undefined, undefined]);
  } else {
    expect(byLabel("工具组").className).toContain("toggle-button-group--detached");
    expect(byLabel("第一项").className).toContain("data-[pressed=true]:transform-[scale(0.97)]!");
  }
});

test("ToggleGroup explicit group/item scaling overrides gap in both directions", async () => {
  await render(<ToggleGroup accessibilityLabel="工具组" gap={0} isScaleDisabled={false} items={[items[0], { ...items[1], isScaleDisabled: true }]} />);
  if (native) expect(rootAnimations.slice(-2)).toEqual([undefined, false]);
  else {
    expect(byLabel("第一项").className).toContain("data-[pressed=true]:transform-[scale(0.97)]!");
    expect(byLabel("第二项").className).toContain("data-[pressed=true]:transform-none!");
  }
  await render(<ToggleGroup accessibilityLabel="工具组" gap={12} isScaleDisabled items={[items[0], { ...items[1], isScaleDisabled: false }]} />);
  if (native) expect(rootAnimations.slice(-2)).toEqual([false, undefined]);
  else {
    expect(byLabel("第一项").className).toContain("data-[pressed=true]:transform-none!");
    expect(byLabel("第二项").className).toContain("data-[pressed=true]:transform-[scale(0.97)]!");
  }
});

test("ToggleGroup dividers stay outside scaling buttons in both orientations", async () => {
  for (const orientation of ["horizontal", "vertical"]) {
    await render(<ToggleGroup accessibilityLabel="固定分割线" orientation={orientation} fullWidth isScaleDisabled={false} items={items} />);
    const group = byLabel("固定分割线");
    const dividers = group.querySelectorAll(native ? '.opacity-15' : '[data-slot="toggle-button-group-separator"]');
    expect(dividers).toHaveLength(2);
    for (const [index, divider] of [...dividers].entries()) {
      const button = byLabel(items[index + 1].accessibilityLabel);
      expect(button.contains(divider)).toBe(false);
      expect(divider.parentElement).toBe(button.parentElement);
      expect(divider.parentElement.parentElement).toBe(group);
      if (!native) expect(button.nextElementSibling).toBeNull(); // Keep HeroUI's last-child outer radius.
    }
  }
});

test("ToggleGroup vertical/single edges, detached shorthand and explicit zero gap", async () => {
  await render(<ToggleGroup accessibilityLabel="工具组" orientation="vertical" fullWidth size="lg" items={items} />);
  if (native) {
    expect(byLabel("第一项").className).toContain("rounded-b-none");
    expect(byLabel("第一项").className).not.toContain("rounded-t-none");
    expect(byLabel("第一项").className).toContain("self-stretch");
    expect(byLabel("第一项").className).not.toContain("flex-1");
    const divider = document.querySelector('.opacity-15');
    expect(divider.style.width).toBe("50%"); expect(divider.style.height).toBe("1px");
  }
  await render(<ToggleGroup accessibilityLabel="工具组" items={[items[0]]} />);
  expect(document.querySelectorAll(native ? '.opacity-15' : '[data-slot="toggle-button-group-separator"]')).toHaveLength(0);
  if (native) expect(byLabel("第一项").className).not.toContain("rounded-");
  await render(<ToggleGroup accessibilityLabel="工具组" isDetached items={items} />);
  expect(byLabel("工具组").style.gap).toBe("8px");
  await render(<ToggleGroup accessibilityLabel="工具组" isDetached gap={0} items={items} />);
  expect(parseFloat(byLabel("工具组").style.gap)).toBe(0);
  for (const gap of [-1, NaN, Infinity]) {
    await render(<ToggleGroup accessibilityLabel="工具组" gap={gap} items={items} />);
    expect(parseFloat(byLabel("工具组").style.gap)).toBe(0);
  }
});

test("standalone Toggle scales by default; scale opt-out keeps highlight and platform animation settings", async () => {
  await render(<Toggle title="独立切换" accessibilityLabel="独立切换" />);
  if (native) expect(rootAnimations.at(-1)).toBeUndefined();
  else expect(byLabel("独立切换").className).toContain("data-[pressed=true]:transform-[scale(0.97)]!");
  await render(<Toggle title="独立切换" accessibilityLabel="独立切换" isScaleDisabled
    herouiNativeProps={{ animation: { scale: { value: 0.9 }, highlight: { opacity: { value: [0, 0.2] } } } }} />);
  if (native) {
    expect(rootAnimations.at(-1)).toBe(false);
    expect(highlightAnimations.at(-1).opacity.value).toEqual([0, 0.2]);
    await render(<Toggle isScaleDisabled={false} herouiNativeProps={{ animation: { scale: { value: 0.9 } } }} />);
    expect(rootAnimations.at(-1)).toEqual({ scale: { value: 0.9 } });
    await render(<Toggle isScaleDisabled={false} herouiNativeProps={{ animation: { scale: false } }} />);
    expect(rootAnimations.at(-1)).toBeUndefined();
    await render(<Toggle isScaleDisabled={false} herouiNativeProps={{ animation: false }} />);
    expect(rootAnimations.at(-1)).toBe("disable-all");
    await render(<Toggle isScaleDisabled={false} herouiNativeProps={{ feedbackVariant: "none" }} />);
    expect(rootAnimations.at(-1)).toBe(false);
  } else expect(byLabel("独立切换").className).toContain("data-[pressed=true]:transform-none!");
});

if (native) {
  test("long-held required single selection clears retained native feedback without changing the selected item", async () => {
    for (const feedbackVariant of ["scale-highlight", "scale-ripple"]) {
      for (const gap of [0, 8]) {
        await render(null);
        const changes = [], boundaries = [], ref = React.createRef();
        await render(<ToggleGroup accessibilityLabel="长按单选" gap={gap} disallowEmptySelection defaultSelectedKeys={["a"]}
          onSelectionChange={keys => changes.push([...keys])} items={[{ ...items[0], herouiNativeProps: { feedbackVariant, ref,
            onPressIn: () => boundaries.push("in"), onPressOut: () => boundaries.push("out") } }, items[1]]} />);
        const button = byLabel("第一项"); await act(() => button.focus());
        const pressable = () => nativeProps.findLast(p => p.accessibilityLabel === "第一项" && typeof p.onPress === "function");
        const instance = (feedbackVariant === "scale-ripple" ? rippleInstances : highlightInstances)
          .find(instance => instance.mounted);
        for (let attempt = 0; attempt < 2; attempt++) {
          if (feedbackVariant === "scale-ripple") {
            const touch = { nativeEvent: { locationX: 8 + attempt, locationY: 12 } };
            await act(() => nativeProps.findLast(p => p.className?.includes("__ripple-container") && p.onTouchStart).onTouchStart(touch));
            expect(instance.lastTouch).toBe(touch.nativeEvent);
          }
          await act(() => pressable().onPressIn({}));
          instance.residualOpacity = 1; // The held animation has reached its pressed value.
          expect(retainedNativeFeedbackIsVisible(button, instance)).toBe(true);
          expect(selected(button)).toBe(true);
          // A held press exceeds Pressability's minimum: out is delivered first.
          await act(() => pressable().onPressOut({}));
          expect(instance.press.isPressed.get()).toBe(false);
          await act(() => pressable().onPress({}));
          expect(changes).toEqual([]); expect(selected(button)).toBe(true);
          expect(retainedNativeFeedbackIsVisible(button, instance)).toBe(false);
          expect(instance.mounted).toBe(true);
          expect(ref.current).toBe(button); expect(document.activeElement).toBe(button);
        }
        expect(boundaries).toEqual(["in", "out", "in", "out"]);
      }
    }
  });

  test("Toggle short press commits before delayed press-out without inheriting pressed feedback", async () => {
    for (const feedbackVariant of ["scale-highlight", "scale-ripple"]) {
      await render(null);
      const changes = [], boundaries = [], ref = React.createRef();
      const pressable = () => nativeProps.findLast(p => p.accessibilityLabel === "短按切换" && typeof p.onPress === "function");
      await render(<Toggle accessibilityLabel="短按切换" title="切换" onSelectedChange={v => changes.push(v)}
        herouiNativeProps={{ feedbackVariant, ref, onPressIn: () => boundaries.push("in"), onPressOut: () => boundaries.push("out") }} />);
      const button = ref.current; await act(() => button.focus());
      for (const next of [true, false, true]) {
        const before = mountedFeedback()[0];
        if (feedbackVariant === "scale-ripple") {
          const touch = { nativeEvent: { locationX: 7, locationY: 9 } };
          await act(() => nativeProps.findLast(p => p.className?.includes("__ripple-container") && p.onTouchStart).onTouchStart(touch));
          expect(before.lastTouch).toBe(touch.nativeEvent);
        }
        await act(() => pressable().onPressIn({}));
        expect(mountedFeedback()).toHaveLength(1);
        const held = mountedFeedback()[0];
        expect(held).toBe(before); expect(visibleFeedback()).toHaveLength(1);
        expect(held.press.isPressed.get()).toBe(true);
        const delayedPressOut = pressable().onPressOut;
        // Pressability's 130ms minimum can deliver onPress BEFORE onPressOut.
        await act(() => pressable().onPress({}));
        expect(selected(button)).toBe(next);
        expect(held.press.isPressed.get()).toBe(true);
        expect(visibleFeedback()).toHaveLength(0);
        expect(ref.current).toBe(button); expect(document.activeElement).toBe(button);
        await act(() => delayedPressOut({}));
        expect(visibleFeedback()).toHaveLength(0);
      }
      expect(changes).toEqual([true, false, true]);
      expect(boundaries).toEqual(["in", "out", "in", "out", "in", "out"]);
      // A canceled gesture never activates: its original overlay can fade out.
      await act(() => pressable().onPressIn({}));
      const canceled = mountedFeedback()[0];
      await act(() => pressable().onPressOut({}));
      expect(mountedFeedback()).toEqual([canceled]);
      expect(canceled.press.isPressed.get()).toBe(false);
      expect(changes).toHaveLength(3);
    }
  });

  test("Toggle selection clears a fading overlay without remounting the button, ref or focus", async () => {
    for (const feedbackVariant of ["scale-highlight", "scale-ripple"]) {
      await render(null);
      const refs = [], changes = [];
      const ref = value => refs.push(value);
      const instances = feedbackVariant === "scale-highlight" ? highlightInstances : rippleInstances;
      await render(<Toggle accessibilityLabel="松手切换" title="切换" onSelectedChange={value => changes.push(value)}
        herouiNativeProps={{ feedbackVariant, ref }} />);
      const button = byLabel("松手切换"); await act(() => button.focus());
      const pressable = () => nativeProps.findLast(p => p.accessibilityLabel === "松手切换" && typeof p.onPress === "function");
      for (const next of [true, false, true]) {
        await act(() => pressable().onPressIn({}));
        const fading = instances.at(-1); fading.residualOpacity = 0.8;
        await act(() => { pressable().onPressOut({}); pressable().onPress({}); });
        expect(selected(button)).toBe(next);
        expect(fading.mounted).toBe(false); expect(visibleFeedback()).toHaveLength(0);
        expect(byLabel("松手切换")).toBe(button);
        expect(document.activeElement).toBe(button); expect(refs).toEqual([button]);
      }
      expect(changes).toEqual([true, false, true]);
      await act(() => pressable().onPressIn({}));
      const fading = instances.at(-1); fading.residualOpacity = 0.8;
      await act(() => pressable().onPressOut({}));
      expect(instances.at(-1)).toBe(fading);
      expect(fading.mounted).toBe(true);
      expect(selected(button)).toBe(true); expect(changes).toEqual([true, false, true]);
    }
  });

  test("controlled Toggle ends feedback on activation while waiting for its actual selection", async () => {
    const ref = React.createRef(), changes = [];
    const props = { accessibilityLabel: "受控切换", onSelectedChange: value => changes.push(value), herouiNativeProps: { ref } };
    await render(<Toggle {...props} isSelected={false} />);
    const button = ref.current, fading = highlightInstances.at(-1); fading.residualOpacity = 0.8;
    await click(byLabel("受控切换"));
    expect(changes).toEqual([true]); expect(fading.mounted).toBe(true);
    expect(selected(button)).toBe(false); expect(visibleFeedback()).toHaveLength(0);
    await render(<Toggle {...props} isSelected />);
    expect(selected(button)).toBe(true); expect(visibleFeedback()).toHaveLength(0);
    expect(fading.mounted).toBe(false);
    expect(ref.current).toBe(button);
    await act(() => nativeProps.findLast(p => p.accessibilityLabel === "受控切换" && p.onPressIn).onPressIn({}));
    expect(mountedFeedback()).toHaveLength(1);
    expect(mountedFeedback()[0].animation.backgroundColor.value).toBe(accentSoftHover);
  });

  test("ToggleGroup clears both old and new selected items' fading overlays", async () => {
    for (const gap of [0, 8]) {
      await render(null);
      await render(<ToggleGroup accessibilityLabel="互斥切换" items={items.slice(0, 2)} gap={gap} defaultSelectedKeys={["a"]} />);
      const buttons = [byLabel("第一项"), byLabel("第二项")];
      const old = mountedFeedback();
      for (const feedback of old) feedback.residualOpacity = 0.8;
      await click(buttons[1]);
      expect(old.every(instance => !instance.mounted)).toBe(true);
      expect(mountedFeedback().map(instance => instance.residualOpacity)).toEqual([0, 0]);
      expect(buttons.map(selected)).toEqual([false, true]);
      expect(byLabel("第一项")).toBe(buttons[0]); expect(byLabel("第二项")).toBe(buttons[1]);
    }
  });

  test("selected Toggle highlight follows the selected theme color in default and ghost variants", async () => {
    for (const variant of ["default", "ghost"]) {
      await render(<Toggle isSelected variant={variant} title="选中" />);
      expect(highlightAnimations.at(-1).backgroundColor.value).toBe(accentSoftHover);
      expect(highlightAnimations.at(-1).opacity.value).toEqual([0, 1]);
      expect(rootAnimations.at(-1)).toBeUndefined();
    }
    accentSoftHover = "#70aaff33";
    await render(<Toggle isSelected title="主题切换" />);
    expect(highlightAnimations.at(-1).backgroundColor.value).toBe(accentSoftHover);
    await render(<Toggle isSelected={false} title="未选中" />);
    expect(highlightAnimations.at(-1).backgroundColor.value).toBe(themeColor("default-hover"));
  });

  test("selected Toggle keeps its state through press-in/out and only changes after activation", async () => {
    const changes = [];
    const currentPressable = () => nativeProps.findLast(p => p.accessibilityLabel === "保持选中" && typeof p.onPress === "function");
    await render(<Toggle accessibilityLabel="保持选中" defaultSelected onSelectedChange={v => changes.push(v)} />);
    await act(() => currentPressable().onPressIn({}));
    expect(selected(byLabel("保持选中"))).toBe(true);
    expect(highlightAnimations.at(-1).backgroundColor.value).toBe(accentSoftHover);
    // A canceled gesture ends without onPress. Neither boundary changes selection.
    await act(() => currentPressable().onPressOut({}));
    expect(changes).toEqual([]); expect(haptics).toEqual([]);
    expect(byLabel("保持选中").className).toContain("bg-accent-soft");
    await act(() => { currentPressable().onPressIn({}); currentPressable().onPressOut({}); currentPressable().onPress({}); });
    expect(changes).toEqual([false]); expect(selected(byLabel("保持选中"))).toBe(false);
    expect(visibleFeedback()).toHaveLength(0);
    await act(() => currentPressable().onPressIn({}));
    expect(mountedFeedback()[0].animation.backgroundColor.value).toBe(themeColor("default-hover"));
    await render(<Toggle accessibilityLabel="保持选中" isSelected onSelectedChange={v => changes.push(v)} />);
    await act(() => currentPressable().onPress({}));
    expect(changes).toEqual([false, false]); expect(selected(byLabel("保持选中"))).toBe(true);
    expect(visibleFeedback()).toHaveLength(0);
  });

  test("ToggleGroup selected feedback respects selection and gap-driven scaling", async () => {
    for (const gap of [0, 8]) {
      await render(null);
      await render(<ToggleGroup accessibilityLabel="工具组" items={items.slice(0, 2)} gap={gap} defaultSelectedKeys={["a"]} />);
      expect(highlightAnimations.slice(-2).map(a => a.backgroundColor.value)).toEqual([accentSoftHover, themeColor("default-hover")]);
      expect(rootAnimations.slice(-2)).toEqual(gap === 0 ? [false, false] : [undefined, undefined]);
      await click(byLabel("第二项"));
      expect(mountedFeedback().map(instance => instance.animation.backgroundColor.value)).toEqual([themeColor("default-hover"), accentSoftHover]);
      expect(visibleFeedback()).toHaveLength(1);
      await act(() => nativeProps.findLast(p => p.accessibilityLabel === "第二项" && p.onPressIn).onPressIn({}));
      expect(mountedFeedback().map(instance => instance.animation.backgroundColor.value)).toEqual([themeColor("default-hover"), accentSoftHover]);
    }
  });

  test("selected highlight/ripple preserve custom colors, animation config and explicit opt-outs", async () => {
    const highlight = { opacity: { value: [0, 0.2], timingConfig: { duration: 75 } } };
    await render(<Toggle isSelected isScaleDisabled herouiNativeProps={{ animation: { highlight } }} />);
    expect(rootAnimations.at(-1)).toBe(false);
    expect(highlightAnimations.at(-1)).toEqual({ ...highlight, backgroundColor: { value: accentSoftHover } });
    await render(<Toggle isSelected herouiNativeProps={{ animation: { scale: { value: 0.9 }, highlight: { ...highlight, backgroundColor: { value: "#ff0000" } } } }} />);
    expect(rootAnimations.at(-1)).toEqual({ scale: { value: 0.9 } });
    expect(highlightAnimations.at(-1).backgroundColor.value).toBe("#ff0000");
    for (const disabled of [false, "disabled"]) {
      const count = highlightAnimations.length;
      await render(<Toggle isSelected herouiNativeProps={{ animation: { highlight: disabled } }} />);
      expect(highlightAnimations).toHaveLength(count);
    }
    const ripple = { opacity: { value: [0, 0.3, 0], timingConfig: { duration: 50 } }, scale: { value: [0, 0.9, 1] }, progress: { baseDuration: 450 } };
    await render(<Toggle isSelected isScaleDisabled herouiNativeProps={{ feedbackVariant: "scale-ripple", animation: { ripple } }} />);
    expect(rootAnimations.at(-1)).toBe(false);
    expect(rippleAnimations.at(-1)).toEqual({ ...ripple, backgroundColor: { value: accentSoftHover } });
    await render(<Toggle isSelected herouiNativeProps={{ feedbackVariant: "scale-ripple", animation: { ripple: { backgroundColor: { value: "#00ff00" } } } }} />);
    expect(rippleAnimations.at(-1).backgroundColor.value).toBe("#00ff00");
    for (const disabled of [false, "disabled"]) {
      const count = rippleAnimations.length;
      await render(<Toggle isSelected herouiNativeProps={{ feedbackVariant: "scale-ripple", animation: { ripple: disabled } }} />);
      expect(rippleAnimations).toHaveLength(count);
    }
    for (const animation of [false, "disabled", "disable-all", { state: false }, { state: "disabled" }, { state: "disable-all" }]) {
      await render(<Toggle isSelected isScaleDisabled={false} herouiNativeProps={{ animation }} />);
      expect(rootAnimations.at(-1)).toBe("disable-all");
    }
    const counts = [highlightAnimations.length, rippleAnimations.length];
    await render(<Toggle isSelected isScaleDisabled={false} herouiNativeProps={{ feedbackVariant: "none" }} />);
    expect(rootAnimations.at(-1)).toBe(false);
    await render(<Toggle isSelected herouiNativeProps={{ feedbackVariant: "scale", animation: { scale: { value: 0.92 } } }} />);
    expect(rootAnimations.at(-1)).toEqual({ scale: { value: 0.92 } });
    expect([highlightAnimations.length, rippleAnimations.length]).toEqual(counts);
  });
}

test("ToggleGroup single/multiple, cannot clear required selection or select disabled items", async () => {
  const changes=[];
  await render(<ToggleGroup accessibilityLabel="工具组" items={items} defaultSelectedKeys={["a"]} disallowEmptySelection onSelectionChange={v=>changes.push([...v])} />);
  await click(byLabel("第一项")); expect(changes).toEqual([]);
  await click(byLabel("第二项")); expect(changes).toEqual([["b"]]);
  expect(selected(byLabel("第二项"))).toBe(true);
  await click(byLabel("第三项")); expect(changes).toHaveLength(1);
  await render(null);
  await render(<ToggleGroup accessibilityLabel="工具组" items={items} selectionMode="multiple" defaultSelectedKeys={["a"]} onSelectionChange={v=>changes.push([...v])} />);
  await click(byLabel("第二项")); expect(changes.at(-1)).toEqual(["a","b"]);
  await click(byLabel("第一项")); expect(changes.at(-1)).toEqual(["b"]);
  await render(null);
  await render(<ToggleGroup accessibilityLabel="工具组" items={items} defaultSelectedKeys={["c"]} onSelectionChange={v=>changes.push([...v])} />);
  await click(byLabel("第一项")); expect(changes.at(-1)).toEqual(["a"]);
  expect(selected(byLabel("第三项"))).toBe(false);
  await render(null);
  await render(<ToggleGroup accessibilityLabel="工具组" items={items} selectionMode="multiple" defaultSelectedKeys={["c"]} onSelectionChange={v=>changes.push([...v])} />);
  await click(byLabel("第一项")); expect(new Set(changes.at(-1))).toEqual(new Set(["a","c"]));
  await click(byLabel("第一项")); expect(changes.at(-1)).toEqual(["c"]);
});

test("TagGroup selection, removal and error/empty state", async () => {
  const changes=[], removals=[];
  const tags=items.map(({accessibilityLabel,...item})=>item);
  await render(<TagGroup label="分类" items={tags} selectionMode="multiple" onSelectionChange={v=>changes.push([...v])} onRemove={v=>removals.push([...v])} isInvalid errorMessage="请选择分类" />);
  expect(document.body.textContent).toContain("请选择分类");
  const first=native ? byLabel("第一项") : document.querySelector('[data-slot="tag"]');
  await click(first); expect(changes).toEqual([["a"]]);
  await click(byLabel(native ? "移除第一项" : "移除")); expect(removals).toEqual([["a"]]); expect(changes).toEqual([["a"]]);
  await render(<TagGroup label="分类" items={[]} emptyContent="空分类" />); expect(document.body.textContent).toContain("空分类");
});

test("TagGroup none/disabled modes suppress selection and removal", async () => {
  const changes=[];
  await render(<TagGroup accessibilityLabel="tags" items={items} onSelectionChange={v=>changes.push(v)} />);
  await click(native ? byLabel("第一项") : document.querySelector('[data-slot="tag"]')); expect(changes).toEqual([]);
  await render(<TagGroup accessibilityLabel="tags" items={items} isDisabled selectionMode="multiple" onSelectionChange={v=>changes.push(v)} onRemove={v=>changes.push(v)} />);
  await click(native ? byLabel("第一项") : document.querySelector('[data-slot="tag"]')); const remove=byLabel(native ? "移除第一项" : "移除"); if(remove) await click(remove); expect(changes).toEqual([]);
});

if (!native) test("Web feedback ripple starts on keyboard press, cleans up, and respects disabled motion", async () => {
  await render(<PressableFeedback accessibilityLabel="涟漪卡片" feedback="ripple">内容</PressableFeedback>);
  const button = byLabel("涟漪卡片");
  await act(() => button.focus());
  await key(button, "Enter");
  expect(document.querySelectorAll(".ui-pressable-ripple")).toHaveLength(1);
  await act(() => document.querySelector(".ui-pressable-ripple").dispatchEvent(new win.Event("animationend", { bubbles: true })));
  expect(document.querySelector(".ui-pressable-ripple")).toBeNull();
  await render(<PressableFeedback accessibilityLabel="涟漪卡片" feedback="ripple" isAnimationDisabled>内容</PressableFeedback>);
  await key(byLabel("涟漪卡片"), "Enter");
  expect(document.querySelector(".ui-pressable-ripple")).toBeNull();
  await render(<PressableFeedback accessibilityLabel="涟漪卡片" feedback="ripple" isDisabled>内容</PressableFeedback>);
  await click(byLabel("涟漪卡片"));
  expect(document.querySelector(".ui-pressable-ripple")).toBeNull();
});

test("Surface variants, project fonts and feedback activation", async () => {
  const ref=React.createRef(); let count=0;
  await render(<TextFontProvider family="BatchFont"><PressableFeedback {...ext({ ref })} accessibilityLabel="卡片" feedback="highlight" onPress={()=>count++}><Surface variant="secondary"><Text>内容</Text></Surface></PressableFeedback></TextFontProvider>);
  expect(ref.current).toBeTruthy(); expect(document.body.textContent).toContain("内容");
  expect([...document.querySelectorAll("span,div")].some(n=>n.textContent==="内容"&&n.style.fontFamily.includes("BatchFont"))).toBe(true);
  await click(byLabel("卡片")); expect(count).toBe(1);
  await render(<PressableFeedback isDisabled accessibilityLabel="卡片" onPress={()=>count++}>禁用</PressableFeedback>); await click(byLabel("卡片")); expect(count).toBe(1);
});

test("SearchField default value, one change per edit, clear and submission", async () => {
  const changes=[], clears=[], submissions=[];
  const ref=React.createRef();
  await render(<TextFontProvider family="BatchFont"><SearchField label="搜索项目" description="输入项目名称" defaultValue="初始" controlRef={ref} onChangeText={v=>changes.push(v)} onClear={()=>clears.push(true)} onSubmit={v=>submissions.push(v)} /></TextFontProvider>);
  expect(document.querySelector("input").value).toBe("初始"); expect(typeof ref.current.focus).toBe("function");
  expect(document.querySelector("input").style.fontFamily).toContain("BatchFont");
  await input("项目"); expect(changes).toEqual(["项目"]);
  if(native) await act(()=>nativeProps.findLast(p=>p.onSubmitEditing)?.onSubmitEditing({nativeEvent:{text:"项目"}})); else await key(document.querySelector("input"),"Enter");
  expect(submissions).toEqual(["项目"]);
  await click(byLabel("清除搜索")); expect(changes).toEqual(["项目",""]); expect(clears).toEqual([true]); expect(document.querySelector("input").value).toBe("");
  if(native) expect(byLabel("清除搜索")).toBeUndefined();
});

test("SearchField controlled/readonly/disabled state and label association", async () => {
  const changes=[];
  await render(<SearchField label="查找" value="固定" isInvalid errorMessage="请修改" onChangeText={v=>changes.push(v)} />);
  const node=document.querySelector("input"); expect(node.value).toBe("固定"); expect(document.body.textContent).toContain("请修改");
  expect(node.getAttribute("aria-labelledby")).toBeTruthy(); expect(document.getElementById(node.getAttribute("aria-labelledby"))).toBeTruthy();
  await input("新值"); expect(changes).toEqual(["新值"]); expect(node.value).toBe("固定");
  await render(<SearchField label="查找" value="固定" isReadOnly onChangeText={v=>changes.push(v)} />); expect(byLabel("清除搜索")).toBeUndefined();
  await render(<SearchField label="查找" value="固定" isDisabled onChangeText={v=>changes.push(v)} />); await click(byLabel("清除搜索")); expect(changes).toHaveLength(1);
});

test("ScrollShadow uses a single native scroll and composes geometry/events", async () => {
  const ref=React.createRef(), events=[];
  await render(<ScrollShadow {...ext({ ref })} orientation="horizontal" hideScrollBar isEnabled={false} visibility="both" onNativeScroll={e=>events.push(e.contentOffset.x)}><Text>滚动内容</Text></ScrollShadow>);
  expect(ref.current).toBeTruthy();
  if(native){
    const scroll=scrollCallbacks.findLast(p=>typeof p==="object"); expect(scroll.horizontal).toBe(true); expect(scroll.showsHorizontalScrollIndicator).toBe(false);
    await act(()=>scroll.onContentSizeChange(500,90)); await act(()=>scroll.onLayout({nativeEvent:{layout:{width:200,height:90}}}));
    expect(shadowLayouts).toEqual([["content",500],["viewport",200]]);
    await act(()=>scroll.onScroll({contentOffset:{x:25,y:0}})); expect(events).toEqual([25]); expect(scheduled).toHaveLength(1);
  }else{
    expect(document.querySelectorAll('[data-slot="scroll-shadow"]')).toHaveLength(1);
    expect(ref.current.dataset.scrollShadowMode).toBe("manual"); expect(ref.current.dataset.leftRightScroll).toBeUndefined();
  }
});
