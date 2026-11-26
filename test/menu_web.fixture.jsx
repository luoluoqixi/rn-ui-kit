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
  "Event", "CustomEvent", "FocusEvent", "Document", "HTMLFormElement", "HTMLSelectElement", "DOMRect", "Range",
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
const { I18nProvider } = await import("react-aria-components/I18nProvider");
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

mock.module("uniwind", () => ({ withUniwind: c => c, ScopedVariables: ({children}) => children, Uniwind: { updateCSSVariables() {}, setTheme() {} }, useUniwind: () => ({ theme: "light" }), useCSSVariable: () => "#123456" }));
mock.module("@lodev09/react-native-true-sheet", () => ({ TrueSheetProvider: ({ children }) => children }));
const scope = await import("../src/core/components/ui/utils/overlay/overlay_portal_scope.web");
mock.module("../src/core/components/ui/utils/overlay/overlay_portal_scope", () => scope);
const modalScope = await import("../src/core/components/ui/utils/overlay/modal_content_scope.web");
mock.module("../src/core/components/ui/utils/overlay/modal_content_scope", () => modalScope);
const toastAdapter = await import("../src/core/components/ui/toast/toast_heroui");
mock.module("../src/core/components/ui/toast/toast_basic", () => toastAdapter);
mock.module("../src/core/components/ui/button/button_loading_icon", () => ({ ButtonLoadingIcon: ({ children }) => children }));
// Record adapter placement props while retaining the real HeroUI / React Aria
// components and their existing interaction/portal tests below.
const menuPopoverProps = {};
for (const [name, path, exported] of [["dropdown", "@heroui/react/dropdown", "Dropdown"], ["select", "@heroui/react/select", "Select"]]) {
  const source = await import(path);
  const HeroRoot = source[exported];
  const HeroPopover = HeroRoot.Popover;
  const Root = Object.assign(props => React.createElement(HeroRoot, props), HeroRoot, {
    Popover: props => { menuPopoverProps[name] = props; return React.createElement(HeroPopover, props); },
  });
  mock.module(path, () => ({ ...source, [exported]: Root }));
}
const { Button } = await import("../src/core/components/ui/button");
const { Dialog } = await import("../src/core/components/ui/dialog");
const { AlertDialog } = await import("../src/core/components/ui/alert_dialog");
const { Popover } = await import("../src/core/components/ui/popover");
const { Tooltip } = await import("../src/core/components/ui/tooltip");
const { Dropdown } = await import("../src/core/components/ui/dropdown");
const { SelectBasic: Select } = await import("../src/core/components/ui/select/select_basic");
const { ListGroup } = await import("../src/core/components/ui/list_group");
const { toastBridge } = await import("../src/core/components/ui/toast/toast_bridge");
const { createRoot } = await import("react-dom/client");
let root;
const byRole = role => document.querySelector('[role="' + role + '"]');
const byText = text => [...document.querySelectorAll("button,[role=menuitem],[role=menuitemcheckbox],[role=menuitemradio],[role=option]")].find(n => n.textContent.includes(text));
async function settle() { await act(async () => { await new Promise(r => setTimeout(r, 40)); }); }
async function render(content) {
  if (!root) { const mount = document.createElement("div"); document.body.append(mount); root = createRoot(mount); }
  await act(() => root.render(content)); await settle();
}
async function click(node) { expect(node).toBeTruthy(); await act(() => node.click()); await settle(); }
async function pressOverlay() {
  const node = document.querySelector(".test-backdrop");
  expect(node).toBeTruthy();
  await act(() => {
    node.dispatchEvent(new win.PointerEvent("pointerdown", { bubbles: true, button: 0, pointerId: 1, pointerType: "mouse" }));
    node.dispatchEvent(new win.PointerEvent("pointerup", { bubbles: true, button: 0, pointerId: 1, pointerType: "mouse" }));
    node.click();
  });
  await settle();
}
async function key(node, key, options = {}) {
  expect(node).toBeTruthy();
  await act(() => node.dispatchEvent(new win.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...options })));
  await act(() => node.dispatchEvent(new win.KeyboardEvent("keyup", { key, bubbles: true, cancelable: true, ...options })));
  await settle();
}
afterEach(async () => { await act(() => { toastBridge.closeAll(); root?.unmount(); }); root = undefined; await settle(); document.body.replaceChildren(); });

const { ContextMenuHeroUI: ContextMenu } = await import("../src/core/components/ui/context_menu/context_menu_heroui");
const { MenubarHeroUI: Menubar } = await import("../src/core/components/ui/menubar/menubar_heroui");
const { Drawer } = await import("../node_modules/@lodev09/react-native-true-sheet/src/web/vaul/index");
const { SheetContentScope } = await import("../src/core/components/ui/sheet/native_sheet/true_sheet/sheet_content_scope.web");

test("ContextMenu uses real HeroUI context trigger, retains short press, choices and keyboard focus", async () => {
  let pressed = 0, chosen = 0;
  const changes = [];
  function Example() {
    const [checked, setChecked] = React.useState(false);
    return <ContextMenu native={false} onOpenChange={open => changes.push(open)}
      trigger={<Button onPress={() => pressed++}>右键目标</Button>}
      items={[
        { value: "details", label: "详细资料", checked, onCheckedChange: setChecked },
        { value: "rename", label: "重新命名", shortcut: "F2", onSelect: () => chosen++ },
        { value: "disabled", label: "已禁用", disabled: true },
      ]} />;
  }
  await render(<Example />);
  const trigger = byText("右键目标");
  await click(trigger); expect(pressed).toBe(1); expect(byRole("menu")).toBeNull();
  await act(() => trigger.dispatchEvent(new win.MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 62, clientY: 81 })));
  await settle(); expect(byRole("menu")).toBeTruthy();
  await click(byText("详细资料")); expect(byText("详细资料").getAttribute("aria-checked")).toBe("true");
  await click(byText("重新命名")); expect(chosen).toBe(1); expect(byRole("menu")).toBeNull();
  await act(() => trigger.focus());
  await key(trigger, "F10", { shiftKey: true });
  // Browsers dispatch contextmenu for Shift+F10; HappyDOM needs that native event.
  await act(() => trigger.dispatchEvent(new win.MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 0, clientY: 0 })));
  await settle(); expect(byRole("menu")).toBeTruthy();
  await key(document.activeElement, "Escape"); expect(byRole("menu")).toBeNull();
  expect(document.activeElement === trigger).toBe(true); expect(changes).toEqual([true, false, true, false]);
});

test("ContextMenu submenu inside actual Drawer remains scoped and Escape preserves the Sheet", async () => {
  function ContextSheet() {
    const container = scope.useOverlayPortalContainer();
    if (!container) return null;
    return <Drawer.Root open modal detached>
    <Drawer.Portal container={container}><Drawer.Content aria-describedby={undefined}><Drawer.Title>右键 Sheet</Drawer.Title>
      <SheetContentScope><ContextMenu trigger={<Button>Sheet右键目标</Button>} items={[
        { value: "more", label: "右键更多", subMenu: [{ value: "child", label: "右键子项" }] },
      ]} /></SheetContentScope>
    </Drawer.Content></Drawer.Portal>
  </Drawer.Root>;
  }
  await render(<Dialog defaultOpen title="右键菜单外层" content={<ContextSheet />} />);
  const trigger = byText("Sheet右键目标");
  await act(() => trigger.focus());
  await act(() => trigger.dispatchEvent(new win.MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 62, clientY: 81 })));
  await settle(); await act(() => byText("右键更多").focus()); await key(byText("右键更多"), "ArrowRight");
  expect(document.querySelectorAll('[role="menu"]').length).toBe(2);
  const child = byText("右键子项");
  expect(child.closest('[role="dialog"]') !== null).toBe(true);
  expect(child.closest('[aria-hidden="true"]') === null).toBe(true);
  await act(() => child.focus()); await key(document.activeElement, "Escape"); expect(document.querySelectorAll('[role="menu"]').length).toBe(1);
  await key(document.activeElement, "Escape"); expect(byRole("menu")).toBeNull();
  expect(document.body.textContent).toContain("右键 Sheet"); expect(document.activeElement === trigger).toBe(true);
});

function menuBarItems(action = () => {}) {
  return [
    { value: "file", title: "测试文件", items: [
      { value: "new", label: "测试新建", onSelect: action },
      { value: "more", label: "测试子菜单", subMenu: [{ value: "child", label: "测试子项", onSelect: action }] },
      { value: "last", label: "测试最后项", onSelect: action },
    ] },
    { value: "disabled", title: "测试禁用", disabled: true, items: [] },
    { value: "edit", title: "测试编辑", items: [{ value: "undo", label: "测试撤销", onSelect: action }] },
  ];
}

test("Menubar aligns menus to the trigger start and preserves bar, item and platform overrides", async () => {
  const cases = [
    [undefined, undefined, "bottom start"],
    [{ side: "top" }, undefined, "top start"],
    [{ align: "center" }, undefined, "bottom"],
    [{ align: "center" }, { align: "end" }, "bottom end"],
    [{ side: "right" }, undefined, "right top"],
    [{ align: "end", herouiWebProps: { placement: "top" } }, undefined, "top"],
    [undefined, { herouiWebProps: { placement: "left bottom" } }, "left bottom"],
  ];
  for (const [index, [contentProps, itemContentProps, placement]] of cases.entries()) {
    await render(<Menubar key={index} defaultValue="file" contentProps={contentProps} items={[{
      value: "file", title: "对齐菜单", contentProps: itemContentProps, items: [{ value: "new", label: "对齐操作" }],
    }]} />);
    expect(byRole("menu")).toBeTruthy();
    expect(menuPopoverProps.dropdown.placement).toBe(placement);
  }
});

test("Menubar dismisses on outside pointer and second mouse press, keeping submenu pointers inside", async () => {
  await render(<><Menubar items={menuBarItems()} /><button>外部目标</button></>);
  const file = byText("测试文件");
  await click(file);
  const pointer = async node => {
    await act(() => node.dispatchEvent(new win.PointerEvent("pointerdown", { bubbles: true, pointerType: "mouse", pointerId: 1, button: 0 })));
    await settle();
  };
  await pointer(byText("测试新建"));
  expect(byRole("menu")).toBeTruthy();
  await pointer(byText("外部目标"));
  expect(byRole("menu")).toBeNull();
  await click(file);
  await pointer(file);
  await click(file);
  expect(byRole("menu")).toBeNull();
});

test("Menubar roves triggers, enters first/last, switches menus and preserves submenu keys", async () => {
  const changes = []; let chosen = 0;
  await render(<><button>之前</button><Menubar items={menuBarItems(() => chosen++)} onValueChange={v => changes.push(v)} /><button>之后</button></>);
  const file = byText("测试文件"), edit = byText("测试编辑");
  expect(file.getAttribute("role")).toBe("menuitem");
  expect(file.tabIndex).toBe(0); expect(edit.tabIndex).toBe(-1);
  await act(() => file.focus()); await key(file, "ArrowRight");
  expect(document.activeElement === edit).toBe(true); expect(byRole("menu")).toBeNull();
  await key(edit, "Home"); expect(document.activeElement === file).toBe(true);
  await key(file, "ArrowUp"); expect(document.activeElement === byText("测试最后项")).toBe(true);
  await key(document.activeElement, "ArrowRight");
  expect(document.activeElement === byText("测试撤销")).toBe(true); expect(document.body.textContent).not.toContain("测试新建");
  await key(document.activeElement, "ArrowLeft"); expect(document.activeElement === byText("测试新建")).toBe(true);
  await key(document.activeElement, "Escape"); expect(byRole("menu")).toBeNull(); expect(document.activeElement === file).toBe(true);
  await click(file); await click(byText("测试新建")); expect(chosen).toBe(1); expect(byRole("menu")).toBeNull();
  expect(changes).toContain("edit");
});

test("Menubar hover switches only while open; Tab exits and controlled undefined stays closed", async () => {
  await render(<><button>前焦点</button><Menubar items={menuBarItems()} /><button>后焦点</button></>);
  const file = byText("测试文件"), edit = byText("测试编辑");
  const hover = async target => { await act(() => target.parentElement.dispatchEvent(new win.PointerEvent("pointerover", { bubbles: true, pointerType: "mouse" }))); await settle(); };
  await hover(edit); expect(byRole("menu")).toBeNull();
  await click(file); await hover(edit); expect(byText("测试撤销")).toBeTruthy();
  await key(document.activeElement, "Tab"); await settle(); expect(byRole("menu")).toBeNull(); expect(document.activeElement.textContent).toBe("后焦点");
  const changes = [];
  await render(<Menubar value={undefined} items={menuBarItems()} onValueChange={value => changes.push(value)} />);
  await click(byText("测试文件")); expect(changes).toEqual(["file"]); expect(byRole("menu")).toBeNull();
});

test("Menubar respects RTL movement and disabled menus", async () => {
  await render(<I18nProvider locale="ar"><Menubar items={menuBarItems()} /></I18nProvider>);
  const file = byText("测试文件"), edit = byText("测试编辑");
  await act(() => file.focus()); await key(file, "ArrowLeft"); expect(document.activeElement === edit).toBe(true);
  await key(edit, "End"); expect(document.activeElement === edit).toBe(true);
  expect(byText("测试禁用").disabled).toBe(true);
});


test("Menubar submenu retains its own Escape and Tab leaves the whole bar", async () => {
  await render(<><button>前焦点</button><Menubar items={menuBarItems()} /><button>后焦点</button></>);
  const file = byText("测试文件");
  await act(() => file.focus()); await key(file, "ArrowDown");
  await act(() => byText("测试子菜单").focus()); await key(document.activeElement, "ArrowRight");
  expect(document.querySelectorAll('[role="menu"]').length).toBe(2);
  await act(() => byText("测试子项").focus());
  await key(document.activeElement, "Escape");
  expect(document.querySelectorAll('[role="menu"]').length).toBe(1);
  await key(document.activeElement, "Tab"); await settle();
  expect(byRole("menu")).toBeNull(); expect(document.activeElement.textContent).toBe("后焦点");
});


test("ContextMenu supports a focusable RN View region and keeps nested context events scoped", async () => {
  await render(<ContextMenu trigger={<NativeView testID="outer-region"><ContextMenu trigger={<NativeView testID="inner-region"><RNW.Text>区域内容</RNW.Text></NativeView>}
    items={[{ value: "inner", label: "内层区域操作" }]} /></NativeView>} items={[{ value: "outer", label: "外层区域操作" }]} />);
  const inner = document.querySelector('[data-testid="inner-region"]').parentElement;
  expect(inner.tabIndex).toBe(0); expect(inner.getAttribute("role")).toBe("button");
  await act(() => inner.focus());
  await act(() => inner.dispatchEvent(new win.MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 32, clientY: 48 })));
  await settle(); expect(document.querySelectorAll('[role="menu"]').length).toBe(1);
  expect(document.body.textContent).toContain("内层区域操作"); expect(document.body.textContent).not.toContain("外层区域操作");
  await key(document.activeElement, "Escape");
});

test("Shared menu uses HeroUI dot indicators and hides unselected custom indicators", async () => {
  await render(<Menubar items={[{ value: "view", title: "指示器菜单", items: [
    { value: "first", label: "当前选项", selected: true, selectionIndicatorVariant: "dot" },
    { value: "second", label: "其他选项", selected: false, selectionIndicatorVariant: "dot" },
    { value: "custom", label: "自定义图标", selected: false, indicator: <span>自定义标识</span> },
  ] }]} />);
  await click(byText("指示器菜单"));
  expect(byText("当前选项").querySelector('[data-slot="menu-item-indicator--dot"]')).toBeTruthy();
  expect(byText("其他选项").querySelector('[data-type="dot"]').hasAttribute("data-visible")).toBe(false);
  expect(byText("自定义图标").querySelector('[data-slot="menu-item-indicator"] > span').style.visibility).toBe("hidden");
});
