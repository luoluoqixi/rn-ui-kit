import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
import { plugin } from "bun";

// Device hooks are replaced; the actual HeroUI components and primitives run.
const win = new Window({ url: "http://localhost/" });
for (const key of [
  "window", "document", "navigator", "HTMLElement", "HTMLButtonElement", "HTMLInputElement",
  "HTMLTextAreaElement", "SVGElement", "Element", "Node", "Event", "MouseEvent",
  "KeyboardEvent", "PointerEvent", "ShadowRoot", "MutationObserver", "ResizeObserver", "CSSRuleList", "CSS",
]) globalThis[key] = key === "window" ? win : win[key];
globalThis.CSSRuleList ??= Array;
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import("react");
const { act } = React;
const RNW = await import("react-native-web");
const textRenders = [];
const viewRenders = [];
const nativeImages = [];
const webImages = [];
function interop(Component) {
  return React.forwardRef(function Interop({ className, style, ...props }, ref) {
    if (Component === RNW.Text) textRenders.push(props);
    if (Component === RNW.View) viewRenders.push(props);
    return <Component {...props} ref={ref} style={[
      className === undefined ? {} : { $$css: true, tailwind: className }, style,
    ]} />;
  });
}
const NativeView = interop(RNW.View);
const NativeImage = React.forwardRef(function NativeImage({ source, onLoad, onError, ...props }, ref) {
  nativeImages.push({ source, onLoad, onError });
  return <NativeView {...props} ref={ref} />;
});
mock.module("react-native", () => ({
  ...RNW, View: NativeView, Text: interop(RNW.Text), Pressable: interop(RNW.Pressable), Image: NativeImage,
}));
// Radix probes the image before mounting its DOM img; control that network edge.
win.Image = class ImageProbe extends win.EventTarget {
  constructor() { super(); this.complete = false; this.naturalWidth = 0; webImages.push(this); }
  finish(ok) {
    this.complete = true;
    this.naturalWidth = ok ? 80 : 0;
    this.dispatchEvent(new win.Event(ok ? "load" : "error"));
  }
};
plugin({
  name: "display-rnw-text",
  setup(build) {
    build.onLoad({ filter: /@rn-primitives[\\/].*\.mjs$/ }, async ({ path }) => ({
      contents: await Bun.file(path).text(), loader: "jsx",
    }));
  },
});
const svgExports = {};
for (const tag of ["Svg", "Path", "Circle", "Ellipse", "G", "Line", "Polygon", "Polyline", "Rect", "Defs", "ClipPath", "LinearGradient", "Stop", "Text", "TSpan", "Use", "Symbol", "Mask", "Pattern", "Image", "RadialGradient"]) {
  svgExports[tag] = React.forwardRef(({ children, accessibilityElementsHidden, importantForAccessibility, ...props }, ref) =>
    React.createElement(tag === "Svg" ? "svg" : tag[0].toLowerCase() + tag.slice(1), { ...props, ref }, children));
}
mock.module("react-native-svg", () => ({ default: svgExports.Svg, ...svgExports }));
const native = process.env.DISPLAY_TEST_PLATFORM === "native";
if (native) {
  const { createContext } = await import("../node_modules/heroui-native/src/helpers/internal/utils/create-context");
  const { childrenToString } = await import("../node_modules/heroui-native/src/helpers/internal/utils/children-to-string");
  mock.module("../node_modules/heroui-native/src/helpers/internal/utils", () => ({ createContext, childrenToString, combineStyles: styles => styles }));
  mock.module("../node_modules/heroui-native/src/helpers/external/hooks", () => ({
    useTextComponent: () => ({ textProps: { allowFontScaling: false, maxFontSizeMultiplier: 1.5 } }),
    useThemeColor: colors => Array.isArray(colors) ? colors.map(() => "#123456") : "#123456",
  }));
  const { HeroText } = await import("../node_modules/heroui-native/src/helpers/internal/components/hero-text");
  mock.module("../node_modules/heroui-native/src/helpers/internal/components", () => ({
    HeroText, ThemeBackground: NativeView, useHasDefaultThemeBackground: () => false,
  }));
  mock.module("../node_modules/heroui-native/src/helpers/internal/contexts", () => ({
    AnimationSettingsProvider: ({ children }) => children,
  }));
  mock.module("react-native-reanimated", () => ({
    default: { View: NativeView, Image: NativeImage, createAnimatedComponent: component => component },
  }));
  mock.module("../node_modules/heroui-native/src/components/avatar/avatar.animation", () => ({
    useAvatarRootAnimation: () => ({}), useAvatarImageAnimation: () => ({}), useAvatarFallbackAnimation: () => ({}),
  }));
  mock.module("../node_modules/heroui-native/src/components/chip/chip.animation", () => ({ useChipRootAnimation: () => ({}) }));
  for (const [component, exportName] of [["alert", "Alert"], ["avatar", "Avatar"], ["chip", "Chip"]]) {
    const real = await import("../node_modules/heroui-native/src/components/" + component + "/" + component);
    mock.module("heroui-native/" + component, () => ({ [exportName]: real.default }));
  }
  for (const component of ["alert", "avatar", "chip", "badge"]) {
    const implementation = await import("../src/core/components/ui/" + component + "/" + component + "_heroui.native");
    mock.module("../src/core/components/ui/" + component + "/" + component + "_heroui", () => implementation);
  }
}
const { Alert } = await import("../src/core/components/ui/alert");
const { Avatar } = await import("../src/core/components/ui/avatar");
const { Chip } = await import("../src/core/components/ui/chip");
const { Badge } = await import("../src/core/components/ui/badge");
const { TextClassContext } = await import("../src/core/components/ui/text");
const { TextFontProvider } = await import("../src/core/components/ui/provider/font_provider");
const { createRoot } = await import("react-dom/client");
const extension = props => native ? { herouiNativeProps: props } : { herouiWebProps: props };
const id = value => native ? { nativeID: value } : { id: value };
const slot = value => extension(id(value));
const node = value => document.getElementById(value);
let root;
async function render(Component, props, wrap = value => value) {
  if (!root) {
    const mount = document.createElement("div");
    document.body.append(mount);
    root = createRoot(mount);
  }
  await act(() => root.render(wrap(<Component {...slot("root")} {...props} />)));
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  textRenders.length = viewRenders.length = nativeImages.length = webImages.length = 0;
  document.body.replaceChildren();
});

test("Alert uses real status slots, associates optional text, and forwards refs", async () => {
  const refs = Object.fromEntries(["root", "title", "description", "indicator", "content"].map(key => [key, React.createRef()]));
  const refSlot = key => extension({ ...id(key), ref: refs[key] });
  for (const status of ["default", "accent", "success", "warning", "danger"]) {
    await render(Alert, {
      ...refSlot("root"), status, title: "Title", description: "Description", content: "Body",
      titleProps: refSlot("title"), descriptionProps: refSlot("description"),
      indicatorProps: refSlot("indicator"), contentProps: refSlot("content"),
    });
    expect(node("root").getAttribute("role")).toBe("alert");
    expect(node("root").getAttribute("aria-labelledby")).toBe("title");
    expect(node("root").getAttribute("aria-describedby")).toBe("description");
    expect(node("indicator").querySelector("svg")).not.toBeNull();
    expect(node("root").textContent).toBe("TitleDescriptionBody");
    expect(node("title").className).toContain(native ? "status-" + status : "alert__title");
    for (const [key, ref] of Object.entries(refs)) expect(ref.current).toBe(node(key));
  }
  await render(Alert, { title: null, description: false, indicator: null });
  expect(node("root").getAttribute("aria-labelledby")).toBeNull();
  expect(node("root").getAttribute("aria-describedby")).toBeNull();
  expect(node("root").children.length).toBe(0);
});

test("Alert callbacks, zero slots, custom indicator and actions stay functional", async () => {
  let clicks = 0;
  const contexts = [];
  await render(Alert, {
    status: "warning", title: ctx => { contexts.push(ctx); return 0; }, description: 0,
    content: <>Content {0}</>, children: "Child", indicator: () => 0,
    action: <button id="action" onClick={() => clicks++}>Retry</button>,
    indicatorProps: slot("indicator"),
  });
  expect(contexts[0]).toEqual({ status: "warning", icon: undefined });
  expect(node("indicator").textContent).toBe("0");
  expect(node("root").textContent).toBe("000Content 0ChildRetry");
  await act(() => node("action").dispatchEvent(new win.MouseEvent("click", { bubbles: true })));
  expect(clicks).toBe(1);
  await render(Alert, { title: "Only title", indicator: false });
  expect(node("root").querySelector("svg")).toBeNull();
});

test("Avatar renders fallback values, common variants and decorative semantics", async () => {
  await render(Avatar, { fallback: () => 0, alt: "Member", fallbackProps: slot("fallback") });
  expect(node("fallback").textContent).toBe("0");
  expect(node("root").getAttribute("aria-label")).toBe("Member");
  for (const size of ["sm", "md", "lg"]) {
    for (const color of ["default", "accent", "success", "warning", "danger"]) {
      await render(Avatar, { size, color, variant: "soft", fallback: "AB", fallbackProps: slot("fallback") });
      expect(node("root").className).toContain(native ? "size-" + size : "avatar--" + size);
      expect(node("root").className).toContain("soft");
      expect(node("fallback").textContent).toBe("AB");
    }
  }
  await render(Avatar, { alt: "", fallback: false });
  if (native) expect(viewRenders.filter(props => props.nativeID === "root").at(-1)).toMatchObject({
    accessible: false, accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants",
  });
  else expect(node("root").getAttribute("aria-hidden")).toBe("true");
  expect(node("root").textContent).toBe("");
  await render(Avatar, {});
  expect(node("root").querySelector("svg")).not.toBeNull();
});

test("Avatar delegates load/error/source removal to HeroUI and recovers fallback", async () => {
  const states = [];
  const imageRef = React.createRef();
  const fallbackRef = React.createRef();
  const props = src => ({ src, alt: "Photo", fallback: "AB",
    imageProps: extension({ ...id("image"), ref: imageRef, ...(native ? { onLoad: () => states.push("loaded"), onError: () => states.push("error") } : { onLoadingStatusChange: value => states.push(value) }) }),
    fallbackProps: extension({ ...id("fallback"), ref: fallbackRef }),
  });
  await render(Avatar, props("https://example.com/first.jpg"));
  await act(() => native ? nativeImages.at(-1).onLoad({ nativeEvent: {} }) : webImages.at(-1).finish(true));
  expect(node("fallback")).toBeNull();
  expect(imageRef.current).toBe(node("image"));
  expect(fallbackRef.current).toBeNull();
  expect(states).toContain("loaded");
  await render(Avatar, props("https://example.com/second.jpg"));
  await act(() => native ? nativeImages.at(-1).onError({ nativeEvent: { error: "offline" } }) : webImages.at(-1).finish(false));
  expect(node("fallback").textContent).toBe("AB");
  expect(fallbackRef.current).toBe(node("fallback"));
  expect(states).toContain("error");
  await render(Avatar, props("https://example.com/third.jpg"));
  await act(() => native ? nativeImages.at(-1).onLoad({ nativeEvent: {} }) : webImages.at(-1).finish(true));
  await render(Avatar, props(undefined));
  expect(node("fallback").textContent).toBe("AB");
  expect(node("image")).toBeNull();
});

test("Chip keeps real Chip labels, start/end order and hidden callback precedence", async () => {
  let hidden = 0;
  const ref = React.createRef();
  await render(Chip, {
    label: () => { hidden++; return "Hidden"; }, children: 0,
    labelProps: extension({ ...id("label"), ref }), startContent: () => "Start", endContent: () => "End",
  });
  expect(node("root").textContent).toBe("Start0End");
  expect(hidden).toBe(0);
  expect(ref.current).toBe(node("label"));
  expect(node("label").className).toContain("chip__label");
  await render(Chip, { label: "Hidden", children: false, startContent: null, endContent: false });
  expect(node("root").textContent).toBe("");
  for (const size of ["sm", "md", "lg"]) {
    for (const variant of ["primary", "secondary", "tertiary", "soft"]) {
      for (const color of ["default", "accent", "success", "warning", "danger"]) {
        await render(Chip, { size, color, variant, label: context => context.color, labelProps: slot("label") });
        expect(node("root").className).toContain(native ? "size-" + size : "chip--" + size);
        expect(node("label").textContent).toBe(color);
      }
    }
  }
});

test("Badge owns real indicator slots, refs, zero content and placement", async () => {
  const refs = Object.fromEntries(["root", "anchor", "label"].map(key => [key, React.createRef()]));
  const refSlot = key => extension({ ...id(key), ref: refs[key] });
  let context;
  await render(Badge, {
    ...refSlot("root"), anchorProps: refSlot("anchor"), labelProps: refSlot("label"),
    content: value => { context = value; return 0; }, children: <button>Anchor</button>,
  });
  expect(context).toEqual({ size: "md", variant: "primary", color: "default", placement: "top-right" });
  expect(node("root").textContent).toBe("0");
  expect(node("label").className).toContain(native ? "chip__label" : "badge__label");
  expect(node("root").className).toContain(native ? "chip__root" : "badge--md");
  expect(node("anchor").tagName).toBe("DIV");
  for (const [key, ref] of Object.entries(refs)) expect(ref.current).toBe(node(key));
  for (const placement of ["top-right", "top-left", "bottom-right", "bottom-left"]) {
    for (const size of ["sm", "md", "lg"]) {
      for (const variant of ["primary", "secondary", "soft"]) {
        for (const color of ["default", "accent", "success", "warning", "danger"]) {
          await render(Badge, { placement, size, variant, color, content: color, children: <button>Anchor</button> });
          expect(node("root").textContent).toBe(color);
          expect(node("root").className).toContain(native ? "size-" + size : "badge--" + size);
          expect(node("root").className).toContain(native ? (placement.startsWith("top") ? "top-0" : "bottom-0") : "badge--" + placement);
          if (native) expect(node("root").className).toContain(placement.endsWith("right") ? "right-0" : "left-0");
        }
      }
    }
  }
  for (const content of [undefined, null, false]) {
    await render(Badge, { content, accessibilityLabel: "Online", labelProps: slot("label"), children: <button>Anchor</button> });
    expect(node("root").textContent).toBe("");
    expect(node("label")).toBeNull();
    expect(node("root").getAttribute("aria-label")).toBe("Online");
  }
});

test("Badge visibility preserves anchor state, clicks and separate text contexts", async () => {
  let calls = 0;
  function Counter() {
    const [count, setCount] = React.useState(0);
    const textClass = React.useContext(TextClassContext);
    return <button id="counter" data-text-class={textClass} onClick={() => setCount(count + 1)}>{count}</button>;
  }
  function Indicator() {
    return <span id="indicator-context" data-text-class={React.useContext(TextClassContext)}>New</span>;
  }
  const props = { children: <Counter />, color: "danger", content: () => { calls++; return <Indicator />; } };
  const wrap = value => <TextClassContext.Provider value="text-warning">{value}</TextClassContext.Provider>;
  await render(Badge, { ...props, isHidden: true }, wrap);
  const anchor = node("counter");
  expect(calls).toBe(0);
  expect(node("root")).toBeNull();
  await act(() => anchor.dispatchEvent(new win.MouseEvent("click", { bubbles: true })));
  expect(anchor.textContent).toBe("1");
  await render(Badge, props, wrap);
  expect(node("counter")).toBe(anchor);
  expect(anchor.textContent).toBe("1");
  expect(calls).toBe(1);
  expect(anchor.getAttribute("data-text-class")).toBe("text-warning");
  expect(node("indicator-context").getAttribute("data-text-class")).toContain("text-danger-foreground");
  await render(Badge, { ...props, isHidden: true }, wrap);
  expect(calls).toBe(1);
  expect(node("counter")).toBe(anchor);
  await act(() => anchor.dispatchEvent(new win.MouseEvent("click", { bubbles: true })));
  await render(Badge, props, wrap);
  expect(anchor.textContent).toBe("2");
});

test("new text boundaries honor project font, explicit styles and platform isolation", async () => {
  const wrap = value => <TextFontProvider family="Project Font">{value}</TextFontProvider>;
  for (const [Component, textSlot, textProps] of [
    [Alert, "titleProps", { title: "Title" }],
    [Avatar, "fallbackProps", { fallback: "AB" }],
    [Chip, "labelProps", { label: "Chip" }],
    [Badge, "labelProps", { content: "Badge", children: <button>Anchor</button> }],
  ]) {
    const fontSlot = extension({ ...id("text"), ...(native && Component === Avatar ? { textProps: { style: { fontFamily: "Explicit Font" } } } : { style: { fontFamily: "Explicit Font" } }) });
    await render(Component, { ...textProps, [textSlot]: fontSlot,
      herouiNativeProps: { nativeID: "root", accessibilityLabel: "Native only" },
      herouiWebProps: { id: "root", "aria-label": "Web only", title: "Web tooltip" },
    }, wrap);
    const text = native && Component === Avatar ? node("text").firstElementChild : node("text");
    expect(text.style.fontFamily.replaceAll('"', "")).toBe("Explicit Font");
    expect(node("root").getAttribute("aria-label")).toBe(native ? "Native only" : "Web only");
    expect(node("root").getAttribute("title")).toBe(native ? null : "Web tooltip");
    await render(Component, { ...textProps, [textSlot]: slot("text") }, wrap);
    const fallbackText = native && Component === Avatar ? node("text").firstElementChild : node("text");
    expect(fallbackText.style.fontFamily.replaceAll('"', "")).toBe("Project Font");
  }
});
