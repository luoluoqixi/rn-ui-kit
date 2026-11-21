import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
import { plugin } from "bun";

// A subprocess isolates RN/animation mocks from the rest of the library tests.
const win = new Window({ url: "http://localhost/" });
for (const key of [
  "window", "document", "navigator", "HTMLElement", "HTMLButtonElement", "HTMLInputElement",
  "HTMLTextAreaElement", "SVGElement", "Element", "Node", "Event", "MouseEvent",
  "KeyboardEvent", "PointerEvent", "ShadowRoot", "MutationObserver", "ResizeObserver",
]) globalThis[key] = key === "window" ? win : win[key];
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.requestAnimationFrame = callback => setTimeout(() => callback(performance.now()), 0);
globalThis.cancelAnimationFrame = clearTimeout;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import("react");
const { act } = React;
const RNW = await import("react-native-web");
// Match Uniwind's RNW adapter: className is carried in a $$css style object.
// RNW is only a DOM test host for Native; bridge RN accessibilityState as well.
function interop(Component) {
  return React.forwardRef(function Interop({ className, style, accessibilityState, ...props }, ref) {
    return <Component {...props} ref={ref}
      aria-expanded={accessibilityState?.expanded ?? props["aria-expanded"]}
      aria-disabled={accessibilityState?.disabled ?? props["aria-disabled"]}
      style={[className === undefined ? {} : { $$css: true, tailwind: className }, style]} />;
  });
}
const NativeView = interop(RNW.View);
mock.module("react-native", () => ({
  ...RNW, View: NativeView, Text: interop(RNW.Text), Pressable: interop(RNW.Pressable),
}));
plugin({
  name: "accordion-rnw-text",
  setup(build) {
    build.onLoad({ filter: /@rn-primitives[\\/].*\.mjs$/ }, async ({ path }) => ({
      contents: await Bun.file(path).text(), loader: "jsx",
    }));
  },
});
const native = process.env.ACCORDION_TEST_PLATFORM === "native";
const feedback = [];
const pressFeedbackEvents = [];

if (native) {
  // Run actual HeroUI Native Accordion components AND primitives. Only the
  // device theme, SVG and Reanimated environment are replaced in this DOM test.
  const { createContext } = await import("../node_modules/heroui-native/src/helpers/internal/utils/create-context");
  const { useControllableState } = await import("../node_modules/heroui-native/src/helpers/internal/hooks/use-controllable-state");
  const [AnimationProvider, useAnimation] = createContext();
  const AnimatedView = React.forwardRef(function AnimatedView({ entering, exiting, layout, ...props }, ref) {
    return <NativeView {...props} ref={ref}
      dataSet={{ ...props.dataSet, ...(layout ? { layoutTransition: "enabled" } : {}) }} />;
  });
  const animation = {};
  for (const method of ["springify", "damping", "stiffness", "mass", "duration", "easing", "reduceMotion"]) animation[method] = () => animation;
  mock.module("react-native-reanimated", () => ({
    default: { View: AnimatedView, createAnimatedComponent: component => component },
    FadeIn: animation, FadeOut: animation, LinearTransition: animation,
    ReduceMotion: { System: "system" },
    Easing: { in: value => value, out: value => value, ease: value => value },
  }));
  mock.module("../node_modules/heroui-native/src/helpers/internal/utils", () => ({
    createContext, combineStyles: styles => styles,
  }));
  mock.module("../node_modules/heroui-native/src/helpers/internal/hooks", () => ({ useControllableState }));
  mock.module("../node_modules/heroui-native/src/helpers/internal/components", () => ({
    ChevronDownIcon: ({ size }) => <svg data-native-indicator-size={size} />,
    ThemeBackground: NativeView, useHasDefaultThemeBackground: () => false,
  }));
  mock.module("../node_modules/heroui-native/src/helpers/external/hooks", () => ({ useThemeColor: () => "#18181b" }));
  mock.module("../node_modules/heroui-native/src/helpers/internal/contexts", () => ({
    AnimationSettingsProvider: ({ children }) => children,
  }));
  mock.module("../node_modules/heroui-native/src/components/accordion/accordion.animation", () => ({
    AccordionAnimationProvider: AnimationProvider, useAccordionAnimation: useAnimation,
    useAccordionRootAnimation: () => ({}), useAccordionIndicatorAnimation: () => ({}),
    useAccordionContentAnimation: () => ({}),
  }));
  // Keep the real feedback components, Slot and press handlers. This records
  // their animation entry points, not device animation frames.
  const [PressFeedbackProvider] = createContext();
  mock.module("../node_modules/heroui-native/src/components/pressable-feedback/pressable-feedback.animation", () => ({
    PressableFeedbackRootAnimationProvider: PressFeedbackProvider,
    usePressableFeedbackRootAnimation: () => ({
      isPressed: {}, containerWidth: { set() {} }, containerHeight: { set() {} },
      animationOnPressIn: () => pressFeedbackEvents.push("in"),
      animationOnPressOut: () => pressFeedbackEvents.push("out"),
    }),
    usePressableFeedbackScaleAnimation: () => ({}),
    usePressableFeedbackHighlightAnimation: () => ({}),
    usePressableFeedbackRippleAnimation: () => ({}),
  }));
  const { default: RealNativeAccordion } = await import("../node_modules/heroui-native/src/components/accordion/accordion");
  mock.module("heroui-native/accordion", () => ({ Accordion: RealNativeAccordion }));
  const { default: RealNativePressFeedback } = await import("../node_modules/heroui-native/src/components/pressable-feedback/pressable-feedback");
  mock.module("heroui-native/pressable-feedback", () => ({ PressableFeedback: RealNativePressFeedback }));
  mock.module("../src/core/components/ui/utils/haptics", () => ({
    useResolvedNativeHaptics: value => value, triggerNativeHaptics: value => feedback.push(value),
  }));
}

if (native) {
  const implementation = await import("../src/core/components/ui/accordion/accordion_heroui.native");
  mock.module("../src/core/components/ui/accordion/accordion_heroui", () => implementation);
}
const { Accordion } = await import("../src/core/components/ui/accordion/accordion");
const { Text } = await import("../src/core/components/ui/text");
const { TextFontProvider } = await import("../src/core/components/ui/provider/font_provider");
const { createRoot } = await import("react-dom/client");
let root;
const items = [
  { value: "a", title: "Alpha", content: "Content A" },
  { value: "b", title: "Beta", content: "Content B" },
  { value: "c", title: "Gamma", content: 0 },
];
const idProps = id => native ? { nativeID: id } : { id };
const platformProps = props => native ? { herouiNativeProps: props } : { herouiWebProps: props };
const buttons = () => [...document.querySelectorAll('[role="button"], button')];
const expanded = () => buttons().map(button => button.getAttribute("aria-expanded") === "true");
async function render(props, wrap = node => node) {
  if (!root) {
    const mount = document.createElement("div");
    document.body.append(mount);
    root = createRoot(mount);
  }
  await act(() => root.render(wrap(<Accordion items={items} {...props} />)));
}
async function click(index) {
  await act(() => buttons()[index].dispatchEvent(new win.MouseEvent("click", { bubbles: true })));
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  feedback.length = 0;
  pressFeedbackEvents.length = 0;
  document.body.replaceChildren();
});

test("single defaults, switch and collapse emit exactly once without mount feedback", async () => {
  const changes = [];
  await render({ defaultValue: "a", nativeHaptics: true, onValueChange: value => changes.push(value) });
  expect(expanded()).toEqual([true, false, false]);
  expect(changes).toEqual([]);
  expect(feedback).toEqual([]);
  await click(1);
  expect(expanded()).toEqual([false, true, false]);
  await click(1);
  expect(expanded()).toEqual([false, false, false]);
  await click(0);
  expect(changes).toEqual(["b", undefined, "a"]);
  if (native) expect(feedback).toEqual([true, true, true]);
});

test("multiple mode expands independently and emits arrays", async () => {
  const changes = [];
  await render({ selectionMode: "multiple", defaultValue: ["a", "b"], onValueChange: value => changes.push(value) });
  expect(expanded()).toEqual([true, true, false]);
  await click(0);
  expect(expanded()).toEqual([false, true, false]);
  await click(2);
  expect(expanded()).toEqual([false, true, true]);
  expect(changes).toEqual([["b"], ["b", "c"]]);
});

test("controlled parent owns state, including external reset to undefined", async () => {
  const changes = [];
  const props = { value: "a", onValueChange: value => changes.push(value) };
  await render(props);
  await click(1);
  expect(expanded()).toEqual([true, false, false]);
  expect(changes).toEqual(["b"]);
  await render({ ...props, value: undefined, defaultValue: "a" });
  expect(expanded()).toEqual([false, false, false]);
  await click(2);
  expect(expanded()).toEqual([false, false, false]);
  expect(changes).toEqual(["b", "c"]);
  await render({ ...props, value: "b" });
  expect(expanded()).toEqual([false, true, false]);
});

test("noncollapsible single allows replacement; multiple only allows additions", async () => {
  const changes = [];
  await render({ defaultValue: "a", isCollapsible: false, nativeHaptics: true, onValueChange: value => changes.push(value) });
  await click(0);
  expect(expanded()).toEqual([true, false, false]);
  expect(changes).toEqual([]);
  expect(feedback).toEqual([]);
  await click(1);
  expect(expanded()).toEqual([false, true, false]);
  await render({ selectionMode: "multiple", value: ["a", "b"], isCollapsible: false, onValueChange: value => changes.push(value) });
  await click(0);
  expect(expanded()).toEqual([true, true, false]);
  await click(2);
  expect(changes).toEqual(["b", ["a", "b", "c"]]);
});

test("root, item and trigger disabled states prevent callbacks and feedback", async () => {
  const changes = [];
  await render({ isDisabled: true, nativeHaptics: true, onValueChange: value => changes.push(value) });
  await click(0);
  expect(expanded()).toEqual([false, false, false]);
  await render({
    nativeHaptics: true, onValueChange: value => changes.push(value),
    items: items.map((item, index) => ({ ...item,
      ...(index === 0 ? { isDisabled: true } : index === 1 ? { triggerProps: { isDisabled: true } } : { itemProps: { isDisabled: true } }),
    })),
  });
  for (let index = 0; index < 3; index++) await click(index);
  expect(changes).toEqual([]);
  expect(feedback).toEqual([]);
});

test("slot classes merge, per-item values win, title styling stays on text, refs and font survive", async () => {
  const rootRef = React.createRef(), triggerRef = React.createRef(), contentRef = React.createRef();
  let globalPress = 0, itemPress = 0;
  await render({
    ...platformProps({ ...idProps("accordion-root"), ref: rootRef }), defaultValue: "a",
    titleClassName: "text-accent", contentClassName: "pb-5",
    headerProps: { ...platformProps(idProps("accordion-heading")), className: "px-1" },
    triggerProps: { className: "px-3", onPress: () => globalPress++ },
    contentProps: { className: "px-3" },
    items: [{
      ...items[0], title: () => <Text>Custom title</Text>,
      content: item => `Rendered ${item.value}`, titleClassName: "text-success",
      contentClassName: "bg-default", "aria-label": "Explicit label",
      triggerProps: { ...platformProps({ ...idProps("custom-trigger"), ref: triggerRef }), className: "px-6", onPress: () => itemPress++ },
      contentProps: { ...platformProps({ ...idProps("custom-content"), ref: contentRef }), className: "pt-2" },
    }, items[1]],
  }, node => <TextFontProvider family="Test Font">{node}</TextFontProvider>);
  const trigger = buttons()[0];
  expect(rootRef.current).toBe(document.querySelector("#accordion-root"));
  expect(triggerRef.current).toBe(trigger);
  expect(contentRef.current).toBe(document.querySelector("#custom-content"));
  expect(trigger.className).toContain("px-6");
  expect(trigger.className).not.toContain("px-3");
  expect(trigger.className).not.toContain("text-success");
  expect(trigger.getAttribute("aria-label")).toBe("Explicit label");
  const title = [...trigger.querySelectorAll("*")].find(node => node.className?.includes?.("text-success"));
  expect(title.textContent).toBe("Custom title");
  expect(getComputedStyle(title).fontFamily.replaceAll('"', '')).toBe("Test Font");
  expect(document.body.textContent).toContain("Rendered a");
  const body = document.querySelector(".bg-default");
  for (const className of ["px-3", "pb-5", "pt-2"]) expect(body.className).toContain(className);
  await click(0);
  await click(1);
  expect(itemPress).toBe(1);
  expect(globalPress).toBe(1);
});

test("HeroUI defaults remain intact and numeric content is normalized", async () => {
  await render({ value: "c" });
  expect(document.body.textContent).toContain("0");
  const indicator = native
    ? document.querySelector("[data-native-indicator-size]")
    : document.querySelector('[data-slot="accordion-indicator"]');
  if (native) expect(indicator.getAttribute("data-native-indicator-size")).toBe("16");
  else expect(indicator.tagName.toLowerCase()).toBe("svg");
});

test("custom indicators follow real expansion/disabled state and per-item overrides", async () => {
  await render({
    defaultValue: "a",
    indicator: ({ item, isExpanded, isDisabled }) => <Text nativeID={"indicator-" + item.value}>{item.value}:{isExpanded ? "open" : "closed"}:{isDisabled ? "disabled" : "enabled"}</Text>,
    items: [items[0], { ...items[1], isDisabled: true }, { ...items[2], indicator: null }],
  });
  expect(document.getElementById("indicator-a").textContent).toBe("a:open:enabled");
  expect(document.getElementById("indicator-b").textContent).toBe("b:closed:disabled");
  expect(document.getElementById("indicator-c")).toBeNull();
  await click(0);
  expect(document.getElementById("indicator-a").textContent).toBe("a:closed:enabled");
  await click(1);
  expect(document.getElementById("indicator-b").textContent).toBe("b:closed:disabled");
  await render({ value: "b", indicator: false, items: [{ ...items[0], indicator: () => <Text nativeID="local-indicator">Local</Text> }, items[1]] });
  expect(document.getElementById("local-indicator").textContent).toBe("Local");
  if (!native) expect(document.querySelectorAll('[data-slot="accordion-indicator"]')).toHaveLength(1);
});

test.skipIf(!native)("native default feedback preserves a single trigger, press lifecycle, ref and disabled state", async () => {
  const triggerRef = React.createRef();
  const pressEvents = [], changes = [];
  await render({
    onValueChange: value => changes.push(value),
    items: [items[0]],
    triggerProps: { herouiNativeProps: {
      ref: triggerRef,
      onPressIn: () => pressEvents.push("in"),
      onPressOut: () => pressEvents.push("out"),
    } },
  });
  const trigger = buttons()[0];
  expect(buttons()).toHaveLength(1);
  expect(triggerRef.current).toBe(trigger);
  expect(trigger.querySelector(".pressable-feedback__highlight")).not.toBeNull();
  await act(async () => {
    trigger.dispatchEvent(new win.MouseEvent("mousedown", { bubbles: true, button: 0, buttons: 1 }));
    // RNW's responder waits 50ms before activating a mouse press.
    await new Promise(resolve => setTimeout(resolve, 60));
  });
  expect(pressFeedbackEvents).toEqual(["in"]);
  expect(pressEvents).toEqual(["in"]);
  await act(() => trigger.dispatchEvent(new win.MouseEvent("mouseup", { bubbles: true, button: 0 })));
  await click(0);
  expect(pressFeedbackEvents).toEqual(["in", "out"]);
  expect(pressEvents).toEqual(["in", "out"]);
  expect(changes).toEqual(["a"]);
  await render({ items: [items[0]], isDisabled: true });
  pressFeedbackEvents.length = 0;
  await act(() => buttons()[0].dispatchEvent(new win.MouseEvent("mousedown", { bubbles: true, button: 0, buttons: 1 })));
  expect(pressFeedbackEvents).toEqual([]);
  await render({ items: [items[0]], variant: "surface" });
  expect(buttons()).toHaveLength(1);
  expect(document.querySelector(".pressable-feedback__highlight")).toBeNull();
});

test.skipIf(!native)("native example labels and accordions share stable layout-animated sections", async () => {
  const sectionView = await import("../src/debug/pages/component_examples/example_section_view.native");
  mock.module("../src/debug/pages/component_examples/example_section_view", () => sectionView);
  // Keep this fixture limited to Accordion and the actual example section,
  // without loading unrelated system-native components from the UI barrel.
  mock.module("../src/core/components/ui", () => ({
    Card: NativeView, Input: NativeView, NativeList: NativeView,
    NativeListNavigationItem: NativeView, NativeListSection: NativeView, Text, Textarea: NativeView,
  }));
  const { ExampleSection, ExampleStack } = await import("../src/debug/pages/component_examples/shared");
  await render({ items: [items[0]] }, accordion => (
    <ExampleStack>
      <ExampleSection title="First demo">{accordion}</ExampleSection>
      <ExampleSection title="Following demo"><Accordion items={[items[1]]} /></ExampleSection>
    </ExampleStack>
  ));
  const sections = [...document.querySelectorAll('[data-layout-transition="enabled"]')];
  expect(sections).toHaveLength(2);
  expect(sections[0].textContent).toContain("First demo");
  expect(sections[0].contains(buttons()[0])).toBe(true);
  expect(sections[1].textContent).toContain("Following demo");
  const followingTrigger = buttons()[1];
  expect(sections[1].contains(followingTrigger)).toBe(true);
  await click(0);
  expect(document.body.textContent).toContain("Content A");
  await click(0);
  expect(document.body.textContent).not.toContain("Content A");
  expect(buttons()[1]).toBe(followingTrigger);
  expect([...document.querySelectorAll('[data-layout-transition="enabled"]')]).toEqual(sections);
});
