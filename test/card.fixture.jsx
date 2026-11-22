import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";

// Device mocks stay in a subprocess; both paths exercise real HeroUI Cards.
const win = new Window({ url: "http://localhost/" });
for (const key of [
  "window", "document", "navigator", "HTMLElement", "HTMLButtonElement", "HTMLInputElement",
  "HTMLTextAreaElement", "SVGElement", "Element", "Node", "Event", "MouseEvent",
  "KeyboardEvent", "PointerEvent", "ShadowRoot", "MutationObserver", "ResizeObserver",
]) globalThis[key] = key === "window" ? win : win[key];
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import("react");
const { act } = React;
const RNW = await import("react-native-web");
const textRenders = [];
function interop(Component) {
  return React.forwardRef(function Interop({ className, style, ...props }, ref) {
    if (Component === RNW.Text) textRenders.push(props);
    return <Component {...props} ref={ref} style={[
      className === undefined ? {} : { $$css: true, tailwind: className }, style,
    ]} />;
  });
}
const NativeView = interop(RNW.View);
mock.module("react-native", () => ({ ...RNW, View: NativeView, Text: interop(RNW.Text) }));

const native = process.env.CARD_TEST_PLATFORM === "native";
let SurfaceProbe;
if (native) {
  const { createContext } = await import("../node_modules/heroui-native/src/helpers/internal/utils/create-context");
  mock.module("../node_modules/heroui-native/src/helpers/internal/utils", () => ({ createContext, combineStyles: styles => styles }));
  mock.module("../node_modules/heroui-native/src/helpers/external/hooks", () => ({
    useTextComponent: () => ({ textProps: { allowFontScaling: false, maxFontSizeMultiplier: 1.5 } }),
  }));
  const { HeroText } = await import("../node_modules/heroui-native/src/helpers/internal/components/hero-text");
  mock.module("../node_modules/heroui-native/src/helpers/internal/components", () => ({
    HeroText, ThemeBackground: NativeView, useHasDefaultThemeBackground: () => false,
  }));
  mock.module("../node_modules/heroui-native/src/helpers/internal/contexts", () => ({
    AnimationSettingsProvider: ({ children }) => children,
  }));
  mock.module("../node_modules/heroui-native/src/components/surface/surface.animation", () => ({
    useSurfaceRootAnimation: () => ({ isAllAnimationsDisabled: false }),
  }));
  const { useSurface } = await import("../node_modules/heroui-native/src/components/surface/surface.context");
  SurfaceProbe = () => <span id="surface-context">{useSurface()?.variant}</span>;
  const { default: Card } = await import("../node_modules/heroui-native/src/components/card/card");
  mock.module("heroui-native/card", () => ({ Card }));
  const implementation = await import("../src/core/components/ui/card/card_heroui.native");
  mock.module("../src/core/components/ui/card/card_heroui", () => implementation);
} else {
  const { SurfaceContext } = await import("../node_modules/@heroui/react/dist/components/surface/surface.js");
  SurfaceProbe = () => <span id="surface-context">{React.use(SurfaceContext)?.variant}</span>;
}
const { Card } = await import("../src/core/components/ui/card");
const { Text } = await import("../src/core/components/ui/text");
const { TextFontProvider } = await import("../src/core/components/ui/provider/font_provider");
const { createRoot } = await import("react-dom/client");
const extension = props => native ? { herouiNativeProps: props } : { herouiWebProps: props };
const id = value => native ? { nativeID: value } : { id: value };
const node = value => document.getElementById(value);
let root;
async function render(props, wrap = value => value) {
  if (!root) {
    const mount = document.createElement("div");
    document.body.append(mount);
    root = createRoot(mount);
  }
  await act(() => root.render(wrap(<Card {...extension(id("root"))} {...props} />)));
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  textRenders.length = 0;
  document.body.replaceChildren();
});

test("single entry renders ordered real slots and forwards each ref", async () => {
  const refs = Object.fromEntries(["root", "header", "title", "description", "content", "footer"].map(key => [key, React.createRef()]));
  const slot = key => extension({ ...id(key), ref: refs[key] });
  await render({
    ...slot("root"), headerProps: slot("header"), titleProps: slot("title"), descriptionProps: slot("description"),
    contentProps: slot("content"), footerProps: slot("footer"),
    title: "Title", description: "Description", content: "Content",
    children: <>Child {0}</>, footer: "Footer",
  });
  expect(node("root").textContent).toBe("TitleDescriptionContentChild 0Footer");
  for (const [key, ref] of Object.entries(refs)) expect(ref.current).toBe(node(key));
  if (native) {
    expect(node("root").className).toContain("surface");
    expect(node("title").className).toContain("card__label");
    expect(node("description").className).toContain("card__description");
  } else {
    expect(node("root").getAttribute("data-slot")).toBe("card");
    expect(node("title").tagName).toBe("H3");
    expect(node("description").tagName).toBe("P");
    expect(node("content").getAttribute("data-slot")).toBe("card-content");
  }
});

test("custom header replaces title/description without invoking hidden callbacks", async () => {
  let hidden = 0;
  await render({ header: () => <>Custom {0}</>, title: () => { hidden++; return "Hidden title"; }, description: () => { hidden++; return "Hidden description"; } });
  expect(node("root").textContent).toBe("Custom 0");
  expect(hidden).toBe(0);
  await render({ header: false, title: () => "Fallback", description: null });
  expect(node("root").textContent).toBe("Fallback");
});

test("zero values and callbacks survive, null/boolean slots create no containers", async () => {
  const contexts = [];
  await render({ title: context => { contexts.push(context); return 0; }, description: false, content: () => 0, footer: () => 0 });
  expect(node("root").textContent).toBe("000");
  expect(contexts).toEqual([{}]);
  await render({ header: null, title: false, description: undefined, content: false, footer: null });
  expect(node("root").children.length).toBe(0);
});

test("slot classes override matching utilities and custom Text gets text context", async () => {
  // Web Title/Description are h3/p: custom content must use inline markup.
  const inline = (key, value) => <Text nativeID={key}>{value}</Text>;
  await render({
    className: "gap-6", title: inline("nested-title", "Styled"),
    titleClassName: "text-accent", titleProps: { ...extension(id("title")), className: "text-success" },
    description: inline("nested-description", "Muted"),
    content: "Content", contentClassName: "px-2", contentProps: { ...extension(id("content")), className: "px-6" },
    footer: "Footer", footerClassName: "flex-col", footerProps: extension(id("footer")),
  });
  expect(node("title").className).toContain("text-success");
  expect(node("title").className).not.toContain("text-accent");
  expect(node("nested-title").className).toContain("text-success");
  expect(node("nested-description").className).toContain("text-muted");
  expect(node("content").className).toContain("px-6");
  expect(node("content").className).not.toContain("px-2");
  expect(node("footer").className).toContain("flex-col");
  expect(node("root").className).toContain("gap-6");
  expect(node("root").className).not.toContain("gap-3");
});

test("project fonts, explicit slot styles and monospace overrides survive", async () => {
  const titleProps = extension({ ...id("title"), style: { fontFamily: "Explicit Font" }, ...(native ? { allowFontScaling: true } : {}) });
  const descriptionProps = extension(id("description"));
  const wrap = value => <TextFontProvider family="Project Font">{value}</TextFontProvider>;
  await render({ title: "Title", description: "Description", content: "Body", titleProps, descriptionProps }, wrap);
  expect(node("title").style.fontFamily.replaceAll('"', "")).toBe("Explicit Font");
  expect(node("description").style.fontFamily.replaceAll('"', "")).toBe("Project Font");
  if (native) {
    expect(textRenders.find(props => props.nativeID === "title").allowFontScaling).toBe(true);
    expect(textRenders.find(props => props.nativeID === "description")).toMatchObject({ allowFontScaling: false, maxFontSizeMultiplier: 1.5 });
  }
  expect(node("root").textContent).toBe("TitleDescriptionBody");
  await render({ title: "Code", titleProps: extension(id("title")), titleClassName: "font-mono" }, wrap);
  expect(node("title").style.fontFamily).toBe("");
  expect(node("title").className).toContain("font-mono");
});

test("all four variants retain the real Surface context", async () => {
  for (const variant of ["default", "secondary", "tertiary", "transparent"]) {
    await render({ variant, content: <SurfaceProbe /> });
    expect(node("root").className).toContain(native ? `surface__root--variant-${variant}` : `card--${variant}`);
    expect(node("surface-context").textContent).toBe(!native && variant === "transparent" ? "" : variant);
  }
});

test("platform props stay isolated and a footer action stays interactive", async () => {
  let clicks = 0;
  await render({
    herouiNativeProps: { nativeID: "root", accessibilityLabel: "Native card" },
    herouiWebProps: { id: "root", "aria-label": "Web card", title: "Web tooltip" },
    footer: <button id="action" onClick={() => clicks++}>Save</button>,
  });
  expect(node("root").getAttribute("aria-label")).toBe(native ? "Native card" : "Web card");
  expect(node("root").getAttribute("title")).toBe(native ? null : "Web tooltip");
  await act(() => node("action").dispatchEvent(new win.MouseEvent("click", { bubbles: true })));
  expect(clicks).toBe(1);
});
