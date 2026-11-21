import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
const win = new Window({ url: "http://localhost/" });
for (const key of ["window", "document", "navigator", "HTMLElement", "HTMLButtonElement", "HTMLInputElement", "HTMLTextAreaElement", "SVGElement", "Element", "Node", "Event", "MouseEvent", "KeyboardEvent", "PointerEvent", "ShadowRoot", "MutationObserver", "ResizeObserver", "CSSRuleList", "CSS"])
  globalThis[key] = key === "window" ? win : win[key];
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import("react");
const { act } = React;
const RNW = await import("react-native-web");
const native = process.env.BASIC_TEST_PLATFORM === "native";
const nativeProps = [];
function interop(Component) {
  return React.forwardRef(function Interop({ className, style, ...props }, ref) {
    nativeProps.push(props);
    return <Component {...props} ref={ref} style={[className === undefined ? {} : { $$css: true, tailwind: className }, style]} />;
  });
}
const NativeView = interop(RNW.View);
mock.module("react-native", () => ({ ...RNW, Text: interop(RNW.Text), View: NativeView, Pressable: interop(RNW.Pressable) }));
mock.module("uniwind", () => ({ withUniwind: component => component }));
if (native) {
  const animatedView = React.forwardRef(({ entering, exiting, ...props }, ref) => <NativeView {...props} ref={ref} />);
  const transition = {};
  for (const method of ["duration", "easing", "delay", "reduceMotion"]) transition[method] = () => transition;
  mock.module("react-native-reanimated", () => ({
    default: { View: animatedView, createAnimatedComponent: component => component },
    useSharedValue: value => React.useRef({ value }).current,
    useAnimatedStyle: callback => callback(), useReducedMotion: () => true,
    withTiming: value => value, withRepeat: value => value, cancelAnimation: () => {},
    FadeIn: transition, FadeOut: transition,
    ReduceMotion: { System: "system" }, Easing: { inOut: x => x, out: x => x, ease: x => x, cubic: x => x },
  }));
  const { createContext } = await import("../node_modules/heroui-native/src/helpers/internal/utils/create-context");
  const { childrenToString } = await import("../node_modules/heroui-native/src/helpers/internal/utils/children-to-string");
  const { getElementWithDefault } = await import("../node_modules/heroui-native/src/helpers/internal/utils/get-element-with-default");
  mock.module("../node_modules/heroui-native/src/helpers/internal/utils", () => ({ createContext, childrenToString, getElementWithDefault, combineStyles: styles => styles }));
  mock.module("../node_modules/heroui-native/src/helpers/external/hooks", () => ({ useTextComponent: () => ({ textProps: { allowFontScaling: false } }), useThemeColor: colors => colors.map(() => "#123456") }));
  const { HeroText } = await import("../node_modules/heroui-native/src/helpers/internal/components/hero-text");
  mock.module("../node_modules/heroui-native/src/helpers/internal/components", () => ({ HeroText }));
  mock.module("../node_modules/heroui-native/src/helpers/internal/contexts", () => ({ AnimationSettingsProvider: ({ children }) => children, useFormField: () => null }));
  mock.module("../node_modules/heroui-native/src/components/spinner/spinner.animation", () => ({ useSpinnerRootAnimation: () => ({}), useSpinnerIndicatorAnimation: () => ({}) }));
  mock.module("../node_modules/heroui-native/src/components/label/label.animation", () => ({ useLabelRootAnimation: () => ({}) }));
  mock.module("../node_modules/heroui-native/src/components/skeleton/linear-gradient", () => ({ default: () => <span /> }));
  const SkeletonContext = React.createContext({});
  mock.module("../node_modules/heroui-native/src/components/skeleton/skeleton.animation", () => ({
    SkeletonAnimationProvider: ({ value, children }) => <SkeletonContext.Provider value={value}>{children}</SkeletonContext.Provider>,
    useSkeletonAnimation: () => React.useContext(SkeletonContext),
    useSkeletonRootAnimation: () => ({}), useSkeletonShimmerAnimation: () => ({}), useSkeletonPulseAnimation: () => ({}),
  }));
  const svgExports = {};
  for (const tag of ["Svg", "Path", "G", "Defs", "LinearGradient", "Stop"]) svgExports[tag] = ({ children, ...props }) => React.createElement(tag === "Svg" ? "svg" : tag.toLowerCase(), props, children);
  mock.module("react-native-svg", () => ({ default: svgExports.Svg, ...svgExports }));
  for (const [path, name] of [["text", "Typography"], ["spinner", "Spinner"], ["separator", "Separator"], ["skeleton", "Skeleton"], ["label", "Label"]]) {
    const component = await import("../node_modules/heroui-native/src/components/" + path + "/" + path);
    mock.module("heroui-native/" + path, () => ({ [name]: component.default }));
  }
  for (const name of ["text", "spinner", "separator", "skeleton", "label", "progress"]) {
    const adapter = await import("../src/core/components/ui/" + name + "/" + name + "_heroui.native");
    mock.module("../src/core/components/ui/" + name + "/" + name + "_heroui", () => adapter);
  }
}
const components = {};
for (const name of ["Text", "Spinner", "Separator", "Skeleton", "Label", "Progress"]) components[name] = (await import("../src/core/components/ui/" + name.toLowerCase()))[name];
const { Text, Spinner, Separator, Skeleton, Label, Progress } = components;
const { TextClassContext } = await import("../src/core/components/ui/text");
const { TextFontProvider } = await import("../src/core/components/ui/provider/font_provider");
const { createRoot } = await import("react-dom/client");
const extension = props => native ? { herouiNativeProps: props } : { herouiWebProps: props };
const idProps = id => native ? { nativeID: id } : { id };
const node = id => document.getElementById(id);
let root;
async function render(content) {
  if (!root) { const mount = document.createElement("div"); document.body.append(mount); root = createRoot(mount); }
  await act(() => root.render(content));
}
afterEach(async () => { await act(() => root?.unmount()); root = undefined; document.body.replaceChildren(); nativeProps.length = 0; });

test("Typography preserves semantic presets, inline text, fonts, code and platform refs", async () => {
  const ref = React.createRef();
  await render(<TextFontProvider family="Project Font"><Text nativeID="body" style={{ lineHeight: 24 }} {...extension({ ref })}>Hello <Text nativeID="inline" weight="bold">world</Text></Text>
    <Text type="h3" nativeID="heading">Heading</Text><Text type="body-sm" color="muted" nativeID="paragraph">Paragraph</Text><Text type="code" nativeID="code">code</Text>
    <Text nativeID="explicit" style={{ fontFamily: "Explicit Font", paddingHorizontal: 8, fontVariant: ["tabular-nums"], transform: [{ translateX: 2 }, { scale: 1.2 }] }}>Override</Text></TextFontProvider>);
  expect(ref.current).toBe(node("body"));
  expect(node("body").style.fontFamily).toContain("Project Font");
  expect(node("body").style.lineHeight).toBe("24px");
  expect(node("explicit").style.fontFamily).toContain("Explicit Font");
  expect(node("code").style.fontFamily).not.toContain("Project Font");
  if (native) {
    expect(node("heading").getAttribute("role")).toBe("heading");
    expect(node("paragraph").className).toContain("type-body-sm");
  } else {
    expect(node("explicit").style.paddingInline).toBe("8px");
    const { textWebStyle } = await import("../src/core/components/ui/text/text_style_web");
    expect(textWebStyle({ fontVariant: ["tabular-nums"] }).fontVariant).toBe("tabular-nums");
    expect(node("explicit").style.transform).toBe("translateX(2px) scale(1.2)");
    expect(node("body").tagName).toBe("SPAN"); expect(node("inline").tagName).toBe("SPAN");
    expect(node("heading").tagName).toBe("H3"); expect(node("paragraph").tagName).toBe("P");
    expect(node("code").tagName).toBe("CODE");
    expect(node("body").querySelector("p,div")).toBeNull();
  }
  await render(<TextClassContext.Provider value="text-success"><Text nativeID="inherited" truncate>Long</Text></TextClassContext.Provider>);
  expect(node("inherited").className).toContain("text-success");
  if (native) expect(nativeProps.findLast(props => props.nativeID === "inherited").numberOfLines).toBe(1);
  await render(<TextClassContext.Provider value="text-foreground text-sm font-medium text-center">
    <Text nativeID="priority" type="h2" color="muted" weight="bold" align="end">Explicit</Text>
  </TextClassContext.Provider>);
  expect(node("priority").className).toContain("text-muted");
  expect(node("priority").className).toContain("text-3xl");
  expect(node("priority").className).toContain("font-bold");
  expect(node("priority").className).not.toContain("text-foreground");
  expect(node("priority").className).not.toContain("font-medium");
  expect(node("priority").className).not.toContain("text-sm");
});

test("Spinner uses the real SVG, presets, numeric dimensions, raw color and loading lifecycle", async () => {
  const ref = React.createRef();
  await render(<Spinner size={18} color="#aabbcc" {...extension({ ...idProps("spinner"), ref })} />);
  expect(ref.current).toBe(node("spinner"));
  expect(node("spinner").querySelector("svg")).not.toBeNull();
  expect(node("spinner").style.width).toBe("18px");
  expect(node("spinner").getAttribute(native ? "aria-label" : "aria-label")).toBe("加载中");
  await render(<Spinner isLoading={false} {...extension(idProps("spinner"))} />);
  expect(node("spinner")).toBeNull();
  await render(<Spinner size="lg" color="success" {...extension(idProps("spinner"))} />);
  expect(node("spinner").className).toContain(native ? "size-lg" : "spinner--lg");
});

test("Separator maps thickness without confusing Web color variants and exposes decorative state", async () => {
  const ref = React.createRef();
  await render(<Separator orientation="vertical" thickness={4} {...extension({ ...idProps("separator"), ref })} />);
  expect(ref.current).toBe(node("separator"));
  expect(node("separator").getAttribute("role")).toBe("separator");
  expect(node("separator").style.width).toBe("4px");
  await render(<Separator isDecorative {...extension(idProps("separator"))} />);
  if (native) expect(nativeProps.findLast(props => props.nativeID === "separator")).toMatchObject({ accessible: false, importantForAccessibility: "no-hide-descendants" });
  else expect(node("separator").getAttribute("aria-hidden")).toBe("true");
});

test("Skeleton switches placeholder to actual content without leaking placeholder dimensions", async () => {
  for (const variant of ["shimmer", "pulse", "none"]) {
    await render(<Skeleton variant={variant} className="h-4 w-20" {...extension(idProps("placeholder"))}><Text nativeID="content">Loaded</Text></Skeleton>);
    expect(node("placeholder")).not.toBeNull(); expect(node("content")).toBeNull();
  }
  await render(<Skeleton isLoading={false} className="h-4 w-20"><Text nativeID="content">Loaded</Text></Skeleton>);
  expect(node("content").textContent).toBe("Loaded"); expect(node("placeholder")).toBeNull();
});

test("Label associates and focuses controls, honors disabled state and inherits project fonts", async () => {
  const ref = React.createRef();
  let focused = 0;
  const props = { nativeID: "label", htmlFor: "input", controlRef: { current: { focus: () => focused++ } }, isRequired: true,
    ...extension({ ref, ...idProps("label-root") }) };
  await render(<TextFontProvider family="Project Font"><Label {...props}>Email</Label><input id="input" aria-labelledby="label" /></TextFontProvider>);
  expect(ref.current).toBe(node("label-root"));
  if (native) {
    expect(node("label").textContent).toBe("Email *");
    expect(node("label").style.fontFamily).toContain("Project Font");
    await act(() => node("label-root").dispatchEvent(new win.MouseEvent("click", { bubbles: true })));
    expect(focused).toBe(1);
  } else {
    expect(node("label-root").tagName).toBe("LABEL"); expect(node("label-root").getAttribute("for")).toBe("input");
    expect(node("label-root").style.fontFamily).toContain("Project Font");
  }
  await render(<Label {...props} isDisabled>Email</Label>);
  if (native) {
    await act(() => node("label-root").dispatchEvent(new win.MouseEvent("click", { bubbles: true })));
    expect(focused).toBe(1);
  }
});

test("Progress renders range, zero, custom value label, slots, refs and indeterminate ARIA", async () => {
  const ref = React.createRef();
  await render(<Progress label="Upload" minValue={10} maxValue={20} value={15} showValueLabel
    {...extension({ ...idProps("progress"), ref })} trackProps={{ ...extension(idProps("track")) }}
    indicatorProps={{ ...extension(idProps("fill")) }} />);
  expect(ref.current).toBe(node("progress"));
  expect(node("progress").getAttribute("role")).toBe("progressbar");
  if (native) expect(nativeProps.findLast(props => props.nativeID === "progress").accessibilityValue).toMatchObject({ min: 10, max: 20, now: 15 });
  else {
    expect(node("progress").getAttribute("aria-valuemin")).toBe("10");
    expect(node("progress").getAttribute("aria-valuemax")).toBe("20");
    expect(node("progress").getAttribute("aria-valuenow")).toBe("15");
  }
  expect(node("progress").textContent).toContain("50%");
  expect(node("fill").style.width).toBe("50%");
  await render(<Progress value={0} {...extension(idProps("progress"))} indicatorProps={{ ...extension(idProps("fill")) }} />);
  // Remount so the Native animation stub starts at its initial value.
  await render(<Progress key="zero" value={0} {...extension(idProps("progress"))} indicatorProps={{ ...extension(idProps("fill")) }} />);
  expect(node("fill").style.width).toBe("0%");
  await render(<Progress isIndeterminate valueLabel="Connecting" showValueLabel {...extension(idProps("progress"))} />);
  expect(node("progress").getAttribute("aria-valuenow")).toBeNull();
  expect(node("progress").textContent).toContain("Connecting");
});
