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
const dropdownHost = await import("../src/core/components/ui/dropdown/dropdown_host.web");
mock.module("../src/core/components/ui/dropdown/dropdown_host", () => dropdownHost);
const contextHost = await import("../src/core/components/ui/context_menu/context_menu_host.web");
mock.module("../src/core/components/ui/context_menu/context_menu_host", () => contextHost);
const { MenuProvider } = await import("../src/core/components/ui/context_menu/menu_provider");
const { ContextMenu } = await import("../src/core/components/ui/context_menu");
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
  await act(async () => root.render(content)); await settle();
}
async function click(node) { expect(node).toBeTruthy(); await act(async () => node.click()); await settle(); }
async function pressOverlay() {
  const node = document.querySelector(".test-backdrop");
  expect(node).toBeTruthy();
  await act(async () => {
    node.dispatchEvent(new win.PointerEvent("pointerdown", { bubbles: true, button: 0, pointerId: 1, pointerType: "mouse" }));
    node.dispatchEvent(new win.PointerEvent("pointerup", { bubbles: true, button: 0, pointerId: 1, pointerType: "mouse" }));
    node.click();
  });
  await settle();
}
async function key(node, key) {
  expect(node).toBeTruthy();
  await act(async () => node.dispatchEvent(new win.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })));
  await act(async () => node.dispatchEvent(new win.KeyboardEvent("keyup", { key, bubbles: true, cancelable: true })));
  await settle();
}
afterEach(async () => { await act(async () => { toastBridge.closeAll(); root?.unmount(); }); root = undefined; await settle(); document.body.replaceChildren(); });

test("Dialog trigger, title, actions, Escape, controlled open and focus return", async () => {
  const changes=[]; let saved=0;
  await render(<Dialog trigger="编辑资料" title="资料" description="编辑说明" content={<input aria-label="姓名" />}
    actionLabel="保存" actionProps={{ onPress: () => saved++ }} cancelLabel="取消" onOpenChange={v => changes.push(v)} />);
  const trigger=byText("编辑资料"); await act(async () => trigger.focus()); await click(trigger);
  expect(byRole("dialog")).toBeTruthy(); expect(document.body.textContent).toContain("编辑说明");
  await click(byText("保存")); expect(saved).toBe(1); expect(byRole("dialog")).toBeTruthy();
  await key(document.activeElement, "Escape"); expect(byRole("dialog")).toBeNull(); expect(changes).toEqual([true,false]);
  expect(document.activeElement).toBe(trigger);
  await render(<Dialog open title="受控" content="内容" onOpenChange={v => changes.push(v)} />);
  await click(document.querySelector('[aria-label="关闭"]')); expect(byRole("dialog")).toBeTruthy(); expect(changes.at(-1)).toBe(false);
});

test("AlertDialog protects dismissal and closes only after action unless prevented", async () => {
  const changes=[];
  await render(<AlertDialog trigger="删除项目" title="确定删除？" description="不可恢复" destructiveLabel="确认删除" cancelLabel="返回" overlayProps={{ className: "test-backdrop" }} onOpenChange={v=>changes.push(v)} />);
  await click(byText("删除项目")); expect(byRole("alertdialog")).toBeTruthy();
  await key(document.activeElement, "Escape"); expect(byRole("alertdialog")).toBeTruthy();
  await pressOverlay(); expect(byRole("alertdialog")).toBeTruthy(); expect(changes).toEqual([true]);
  await click(byText("确认删除")); expect(byRole("alertdialog")).toBeNull(); expect(changes).toEqual([true,false]);
  await render(<AlertDialog key="prevent" defaultOpen title="阻止关闭" actionLabel="保留" actionProps={{ onPress: e => e.preventDefault() }} />);
  await click(byText("保留")); expect(byRole("alertdialog")).toBeTruthy();
});

test("Dialog and AlertDialog overlay dismissal can be explicitly controlled independently of Escape", async () => {
  const overlayProps = { className: "test-backdrop" };
  await render(<Dialog key="default" defaultOpen title="默认可关闭" overlayProps={overlayProps} />);
  await pressOverlay(); expect(byRole("dialog")).toBeNull();
  await render(<Dialog key="protected" defaultOpen title="遮罩保护" dismissOnOverlayPress={false} overlayProps={overlayProps} />);
  await pressOverlay(); expect(byRole("dialog")).toBeTruthy();
  await key(document.activeElement, "Escape"); expect(byRole("dialog")).toBeNull();
  await render(<AlertDialog key="allow-overlay" defaultOpen title="允许遮罩" dismissOnOverlayPress overlayProps={overlayProps} />);
  await key(document.activeElement, "Escape"); expect(byRole("alertdialog")).toBeTruthy();
  await pressOverlay(); expect(byRole("alertdialog")).toBeNull();
  await render(<AlertDialog key="allow-escape" defaultOpen title="允许 Escape" dismissOnBackPress overlayProps={overlayProps} />);
  await pressOverlay(); expect(byRole("alertdialog")).toBeTruthy();
  await key(document.activeElement, "Escape"); expect(byRole("alertdialog")).toBeNull();
});

test("Dialog scope contains Popover, Dropdown, Select and nested AlertDialog", async () => {
  await render(<Dialog defaultOpen title="外层" content={<>
    <Popover title="弹出内容" content={<input aria-label="详细内容" />}><Button>更多信息</Button></Popover>
    <Dropdown native={false} triggerLabel="操作菜单" items={[{ value:"rename", label:"重命名" }]} />
    <Select native={false} accessibilityLabel="选城市" items={[{value:"a",label:"北京"},{value:"b",label:"上海"}]} />
    <AlertDialog trigger="内层确认" title="确认操作" cancelLabel="返回上层" />
  </>} />);
  await click(byText("更多信息")); expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2);
  expect(document.querySelector('[data-ui-overlay-scope] [role="dialog"]')).toBeTruthy();
  await key(document.activeElement,"Escape"); expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
  await click(byText("操作菜单")); expect(byRole("menu")).toBeTruthy(); await key(document.activeElement,"Escape");
  await click(document.querySelector('button[aria-label="选城市"]')); expect(byRole("listbox")).toBeTruthy(); await key(document.activeElement,"Escape");
  await click(byText("内层确认")); expect(byRole("alertdialog")).toBeTruthy(); await click(byText("返回上层")); expect(byRole("dialog")).toBeTruthy();
});

for (const [name, Component] of [["dropdown", Dropdown], ["select", Select]]) {
  test(name + ": Web vertical menus default to start and explicit alignment/placement remains configurable", async () => {
    const cases = [
      [undefined, "bottom start"],
      [{ side: "top" }, "top start"],
      [{ side: "left" }, "left"],
      [{ side: "right" }, "right"],
      [{ align: "start" }, "bottom start"],
      [{ align: "center" }, "bottom"],
      [{ align: "end" }, "bottom end"],
      [{ side: "top", align: "center" }, "top"],
      [{ side: "right", align: "start" }, "right top"],
      [{ side: "left", align: "end" }, "left bottom"],
      [{ align: "center", herouiWebProps: { placement: "top end" } }, "top end"],
    ];
    for (const [index, [contentProps, placement]] of cases.entries()) {
      await render(<Component key={index} native={false} defaultOpen contentProps={contentProps} items={[{ value: "a", label: "菜单项" }]} />);
      expect(menuPopoverProps[name].placement).toBe(placement);
      expect(byRole(name === "select" ? "listbox" : "menu")).not.toBeNull();
    }
  });
}

test("Dropdown mixes actions, selected checkbox, disabled, submenu and single callback dispatch", async () => {
  const actions=[];
  await render(<Dropdown native={false} triggerLabel="菜单触发器" items={[
    {value:"action", label:"执行操作", onSelect:()=>actions.push("action")},
    {value:"checked", label:"选中条目", selected:true, checkbox:true, onSelect:()=>actions.push("checked")},
    {value:"disabled",label:"禁用条目",disabled:true,onPress:()=>actions.push("disabled")},
    {value:"sub",label:"子菜单",subMenu:[{value:"child",label:"子操作",onPress:()=>actions.push("child")}]},
  ]} />);
  await click(byText("菜单触发器")); expect(byRole("menu")).toBeTruthy();
  expect(byText("选中条目").getAttribute("aria-checked")).toBe("true");
  expect(byText("执行操作").getAttribute("role")).toBe("menuitem");
  await click(byText("禁用条目")); expect(actions).toEqual([]);
  await click(byText("选中条目")); expect(actions).toEqual(["checked"]); expect(byRole("menu")).toBeTruthy();
  await click(byText("执行操作")); expect(actions).toEqual(["checked","action"]); expect(byRole("menu")).toBeNull();
  await click(byText("菜单触发器")); await key(byText("子菜单"), "ArrowRight");
  expect(document.querySelectorAll('[role="menu"]')).toHaveLength(2);
  await click(byText("子操作")); expect(actions.at(-1)).toBe("child");
});

test("Dropdown editor menu renders separators/shortcuts and persistent radio/checkbox selection", async () => {
  function Editor() {
    const [alignment, setAlignment] = React.useState("left");
    const [bold, setBold] = React.useState(false);
    return <Dropdown native={false} triggerLabel="编辑菜单" contentProps={{ maxHeight: 280 }} items={[
      { value: "left", label: "左对齐", shortcut: "⌘ L", selected: alignment === "left", selectionIndicatorVariant: "dot", shouldCloseOnSelect: false, onSelect: () => setAlignment("left") },
      { value: "thin", separator: true },
      { value: "right", label: "右对齐", selected: alignment === "right", selectionIndicatorVariant: "dot", shouldCloseOnSelect: false, onSelect: () => setAlignment("right") },
      { value: "thick", separator: true, separatorVariant: "thick" },
      { value: "bold", label: "粗体", shortcut: "⌘ B", checkbox: true, selected: bold, onSelect: () => setBold(!bold) },
    ]} />;
  }
  await render(<Editor />); await click(byText("编辑菜单"));
  expect(document.querySelectorAll('[data-slot="separator"]')).toHaveLength(2);
  expect(document.querySelector('[data-slot="separator"][style*="6px"]')).not.toBeNull();
  expect(document.body.textContent).toContain("⌘ B");
  expect(byText("左对齐").getAttribute("role")).toBe("menuitemradio");
  expect(byText("左对齐").getAttribute("aria-checked")).toBe("true");
  await click(byText("右对齐"));
  expect(byText("右对齐").getAttribute("aria-checked")).toBe("true");
  expect(byText("左对齐").getAttribute("aria-checked")).toBe("false");
  await click(byText("粗体"));
  expect(byText("粗体").getAttribute("aria-checked")).toBe("true");
  expect(byRole("menu")).not.toBeNull();
  expect(document.querySelector('[data-slot="dropdown-popover"]')?.style.maxHeight).toBe("280px");
});

test("Select updates uncontrolled value, handles controlled null and imperative open/close", async () => {
  const ref=React.createRef(); const values=[];
  const items=[{value:"one",label:"第一项"},{value:"two",label:"第二项"},{value:"disabled",label:"不可选",isDisabled:true}];
  await render(<Select ref={ref} items={items} defaultValue="one" onValueChange={v=>values.push(v)} />);
  expect(document.querySelector('button').textContent).toContain("第一项");
  await act(()=>ref.current.open()); await settle(); await click(byText("第二项"));
  expect(document.querySelector('button').textContent).toContain("第二项"); expect(values).toEqual(["two"]);
  await render(<Select ref={ref} items={items} value={null} onValueChange={v=>values.push(v)} />);
  await act(()=>ref.current.open()); await settle(); await click(byText("第一项"));
  expect(values.at(-1)).toBe("one"); expect(document.querySelector('button').textContent).not.toContain("第一项");
  await act(()=>ref.current.open()); await settle(); await act(()=>ref.current.close()); await settle(); expect(byRole("listbox")).toBeNull();
});

test("Select NativeTrigger keeps visual content without nested buttons or row click bubbling", async () => {
  let rows=0;
  await render(<div onClick={()=>rows++}><Select nativeTrigger nativeTriggerContent={<span>定制触发器</span>} items={[{value:"a",label:"一"}]} /></div>);
  expect(document.querySelector('button button')).toBeNull(); await click(byText("定制触发器"));
  expect(rows).toBe(0); expect(byRole("listbox")).toBeTruthy();
});

test("ListGroup supports sections, action, selection and disabled rows", async () => {
  const selection=[];let actions=0;
  await render(<ListGroup selectionMode="single" defaultSelectedKeys={["a"]} onSelectionChange={v=>selection.push([...v])}
    sections={[{id:"s",title:"分区",items:[{id:"a",title:"列表甲"},{id:"b",title:"列表乙",description:"说明",onPress:()=>actions++},{id:"c",title:"列表禁用",isDisabled:true}]}]} />);
  expect(byText("列表甲").getAttribute("aria-selected")).toBe("true"); await key(byText("列表乙"), " ");
  expect(selection).toEqual([["b"]]); await key(byText("列表乙"), "Enter"); expect(actions).toBe(1); await click(byText("列表禁用")); expect(selection).toHaveLength(1);
});

test("ListGroup preserves platform styles and React Aria style callbacks", async () => {
  const items = [{ id: "styled", title: "样式条目" }];
  await render(<ListGroup items={items} herouiWebProps={{ style: { paddingTop: 17, fontFamily: "Explicit" } }} />);
  expect(byRole("listbox").style.paddingTop).toBe("17px");
  expect(byRole("listbox").style.fontFamily).toBe("Explicit");
  await render(<ListGroup items={items} herouiWebProps={{ style: ({ isEmpty }) => ({ paddingTop: isEmpty ? 5 : 11 }) }} />);
  expect(byRole("listbox").style.paddingTop).toBe("11px");
  await render(<ListGroup items={[]} herouiWebProps={{ style: ({ isEmpty }) => ({ paddingTop: isEmpty ? 5 : 11 }) }} />);
  expect(byRole("listbox").style.paddingTop).toBe("5px");
});

test("Tooltip Web uses real accessible HeroUI hint and disabled state", async () => {
  await render(<Tooltip open content="补充提示"><Button>操作</Button></Tooltip>); expect(byRole("tooltip")).toBeTruthy();
  await render(<Tooltip isDisabled content="不会显示"><Button>禁用提示</Button></Tooltip>); expect(byRole("tooltip")).toBeNull();
});

test("HeroUI Toast keeps rich content, same ID update, numeric custom IDs and closes", async () => {
  await render(<toastAdapter.BasicToaster />);
  let id;
  await act(()=>{id=toastAdapter.showBasicToast(<span>通知标题</span>,"success",{id:17,duration:Infinity,description:<span>通知详情</span>});}); await settle();
  expect(id).toBe(17); expect(document.querySelector('[data-slot="toast"]')).toBeTruthy(); expect(document.body.textContent).toContain("通知详情");
  await act(()=>toastAdapter.showBasicToast("更新通知","warning",{id:17,duration:Infinity})); await settle();
  expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(1); expect(document.body.textContent).toContain("更新通知");
  await act(()=>toastAdapter.showBasicCustom(id=><span>自定义 {id}</span>,{id:18,duration:Infinity})); await settle(); expect(document.body.textContent).toContain("自定义 18");
  await act(()=>toastAdapter.dismissAllBasicToasts()); await act(()=>new Promise(r=>setTimeout(r,350))); expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(0);
});


test("HeroUI nested submenu remains inside its Dialog and keeps keyboard focus", async () => {
  await render(<Dialog defaultOpen title="外层窗口" content={<Dialog trigger="编辑窗口" title="内层窗口" content={
    <Dropdown native={false} triggerLabel="内层操作" items={[{value:"sub",label:"更多选项",subMenu:[{value:"child",label:"执行子操作"}]}]} />
  } />} />);
  await click(byText("编辑窗口"));
  const inner = byText("内层操作").closest('[role="dialog"]');
  await click(byText("内层操作"));
  await act(async () => byText("更多选项").focus());
  await key(byText("更多选项"), "ArrowRight");
  const menus = document.querySelectorAll('[role="menu"]');
  expect(menus.length).toBe(2); expect(inner.contains(menus[1])).toBe(true);
  expect(menus[0].parentElement.parentElement.contains(menus[1])).toBe(true);
  expect(menus[1].closest('[inert]') === null).toBe(true);
  expect(menus[1].parentElement.contains(document.activeElement)).toBe(true);
  await key(document.activeElement, "Escape");
  expect(document.querySelectorAll('[data-slot="modal-dialog"]').length).toBe(2);
  expect(document.querySelectorAll('[role="menu"]').length).toBe(1);
  await key(document.activeElement, "Escape");
  expect(document.querySelectorAll('[role="menu"]').length).toBe(0);
  expect(document.activeElement === byText("内层操作")).toBe(true);
});

test("Toast legacy actions, callbacks, top placement, defaults and named hosts remain effective", async () => {
  const events=[];
  await render(<toastAdapter.BasicToaster offset={36} closeButton sonnerProps={{position:"top-left",toastOptions:{className:"legacy-toast"}}} />);
  await act(()=>toastAdapter.showBasicToast("操作通知","info",{id:"action",duration:Infinity,sonnerOptions:{action:{label:"撤销变更",onClick:()=>events.push("action")},onDismiss:()=>events.push("dismiss"),onAutoClose:()=>events.push("auto")}})); await settle();
  const region=document.querySelector('[data-slot="toast-region"]');
  expect(region.className).toContain("toast-region--top-start"); expect(region.style.top).toBe("36px"); expect(region.style.bottom).toBe("");
  expect(document.querySelector('.legacy-toast') !== null).toBe(true);
  await click(byText("撤销变更")); expect(events).toEqual(["action","dismiss"]);
  await act(()=>toastAdapter.showBasicToast("到期通知","info",{duration:20,sonnerOptions:{onAutoClose:()=>events.push("auto"),onDismiss:()=>events.push("unexpected")}})); await settle(); expect(events.at(-1)).toBe("auto"); expect(events).not.toContain("unexpected");
  await render(<div id="named-host"><toastAdapter.BasicToaster viewportName="local" /></div>);
  await act(()=>toastAdapter.showBasicToast("局部通知","info",{toasterId:"local",duration:Infinity})); await settle();
  expect(document.querySelector('#named-host [data-slot="toast"]') !== null).toBe(true);
});

const { Drawer } = await import("../node_modules/@lodev09/react-native-true-sheet/src/web/vaul/index");
const { SheetContentScope } = await import("../src/core/components/ui/sheet/native_sheet/true_sheet/sheet_content_scope.web");
let sheetCloses = 0, outerCloses = 0;
function RealSheet() {
  const container = scope.useOverlayPortalContainer();
  const [open, setOpen] = React.useState(true);
  if (!container) return null;
  return <Drawer.Root open={open} onOpenChange={next => { if (!next) sheetCloses++; setOpen(next); }} modal detached>
    <Drawer.Portal container={container}><Drawer.Overlay /><Drawer.Content aria-describedby={undefined}>
      <Drawer.Title>真实 Sheet</Drawer.Title>
      <SheetContentScope>
        <Dropdown native={false} triggerLabel="Sheet 菜单" items={[{ value: "more", label: "Sheet 更多", subMenu: [{ value: "child", label: "Sheet 子项" }] }]} />
        <Select native={false} accessibilityLabel="Sheet 选择" items={[{ value: "a", label: "Sheet 甲" }]} />
        <Popover content={<input placeholder="Sheet Popover 输入" />}><Button>Sheet Popover</Button></Popover>
        <Dialog trigger="Sheet 内窗口" title="最内层窗口" content={<input placeholder="内层输入" />} />
        <AlertDialog trigger="Sheet 内确认" title="最内层确认" cancelLabel="返回 Sheet" />
      </SheetContentScope>
    </Drawer.Content></Drawer.Portal>
  </Drawer.Root>;
}
async function renderRealSheet() {
  sheetCloses = 0; outerCloses = 0;
  await render(<Dialog defaultOpen title="真实 Sheet 的外层 Dialog" onOpenChange={next => { if (!next) outerCloses++; }} content={<RealSheet />} />);
}
function expectSheetStillOpen() {
  expect(sheetCloses).toBe(0); expect(outerCloses).toBe(0);
  expect(document.querySelector('[data-vaul-drawer]') !== null).toBe(true);
}
test("actual TrueSheet Drawer: submenu and root menu Escape preserve Sheet and outer HeroUI Dialog", async () => {
  await renderRealSheet();
  await click(byText("Sheet 菜单"));
  await act(async () => byText("Sheet 更多").focus()); await key(byText("Sheet 更多"), "ArrowRight");
  expect(document.querySelectorAll('[role="menu"]').length).toBe(2);
  await act(async () => byText("Sheet 子项").focus());
  await key(document.activeElement, "Escape"); expectSheetStillOpen();
  expect(document.querySelectorAll('[role="menu"]').length).toBe(1);
  await key(document.activeElement, "Escape"); expectSheetStillOpen();
  expect(document.querySelectorAll('[role="menu"]').length).toBe(0);
});
test("actual TrueSheet Drawer: Select, Popover, Dialog and protected AlertDialog own their dismissal", async () => {
  await renderRealSheet();
  await click(document.querySelector('[data-slot="select-trigger"]'));
  await key(document.activeElement, "Escape"); expectSheetStillOpen();
  await click(byText("Sheet Popover"));
  const input = document.querySelector('[placeholder="Sheet Popover 输入"]');
  await act(async () => input.focus()); await key(input, "Escape"); expectSheetStillOpen();
  await click(byText("Sheet 内窗口"));
  const dialog = [...document.querySelectorAll('[data-slot="modal-dialog"]')].at(-1);
  await key(dialog, "Escape"); expectSheetStillOpen();
  await click(byText("Sheet 内确认"));
  const alert = document.querySelector('[role="alertdialog"]');
  await key(alert, "Escape"); expectSheetStillOpen(); expect(alert.isConnected).toBe(true);
  await click(byText("返回 Sheet")); expectSheetStillOpen();
});

const menuDeferred = () => { let resolve; const promise = new Promise(yes => { resolve = yes; }); return { promise, resolve }; };
test("external Dropdown uses the real generated Button and NativeTrigger, keyboard and imperative row handle", async () => {
  const requests = [], changes = []; let pressed = 0, selected = 0; const ref = { current: null }; const sessions = [];
  const adapter = { open: request => { requests.push(request); const closed = menuDeferred(); sessions.push(closed); return { closed: closed.promise }; } };
  await render(<MenuProvider value={{ menuAdapter: adapter }}><Dropdown __menuRef={ref} triggerLabel="宿主下拉"
    onOpenChange={next => changes.push(next)} triggerProps={{ onPress: () => pressed++ }}
    contentProps={{ side: "top", align: "center", sideOffset: 6 }} menuAdapterOptions={{ theme: "test" }}
    items={[{ value: "copy", label: "复制", onSelect: () => selected++ }]} /></MenuProvider>);
  const trigger = byText("宿主下拉"); trigger.getBoundingClientRect = () => ({ left: 10, top: 40, width: 120, height: 44 });
  await click(trigger); expect(pressed).toBe(1); expect(requests).toHaveLength(1); expect(byRole("menu")).toBeNull();
  expect(requests[0]).toMatchObject({ kind: "dropdown", x: 70, y: 34, options: { theme: "test" }, placement: { side: "top", align: "center", sideOffset: 6 }, anchor: { rect: { x: 10, y: 40, width: 120, height: 44 } } });
  expect(changes).toEqual([true]); await act(async () => requests[0].select(requests[0].items[0].id)); expect(selected).toBe(1);
  await act(async () => sessions[0].resolve()); await settle(); expect(changes).toEqual([true, false]);
  await key(trigger, "ArrowDown"); expect(requests[1].source).toBe("keyboard");
  await act(async () => sessions[1].resolve()); await settle();
  await act(async () => ref.current.presentMenu()); await settle(); expect(requests[2].source).toBe("programmatic");
  await act(async () => sessions[2].resolve()); await settle();
  await render(<MenuProvider value={{ menuAdapter: adapter }}><Dropdown key="native-face" nativeTrigger nativeTriggerIcon="none" triggerLabel="系统风格触发器"
    onOpenChange={next => changes.push(next)} items={[{ value: "copy" }]} /></MenuProvider>);
  await click(byText("系统风格触发器")); expect(requests).toHaveLength(4); expect(changes.at(-1)).toBe(true);
  await act(async () => sessions[3].resolve()); await settle(); expect(changes.at(-1)).toBe(false);
});

test("external menu dispatch honors per-component adapters, native=false, local opt-out and legacy provider behavior", async () => {
  const calls = []; const globalAdapter = { open: () => { calls.push("global"); return {}; } };
  const localAdapter = { open: () => { calls.push("local"); return {}; } };
  const items = [{ value: "action", label: "操作" }];
  for (const [index, props, expected] of [[0, {}, "global"], [1, { menuAdapter: localAdapter }, "local"],
    [2, { native: false }, null], [3, { menuAdapter: false }, null]]) {
    await render(<MenuProvider value={{ menuAdapter: globalAdapter }}><Dropdown key={index} {...props} triggerLabel="渲染入口" items={items} /></MenuProvider>);
    const count = calls.length; await click(byText("渲染入口"));
    if (expected) { expect(calls.at(-1)).toBe(expected); expect(byRole("menu")).toBeNull(); }
    else { expect(calls).toHaveLength(count); expect(byRole("menu")).not.toBeNull(); await key(document.activeElement, "Escape"); }
  }
  // 旧 native/showNativeMenu 配置不会突然改变原有 Web Dropdown。
  await render(<MenuProvider value={{ native: true, showNativeMenu: async () => calls.push("legacy") }}><Dropdown key="legacy" triggerLabel="旧配置" items={items} /></MenuProvider>);
  await click(byText("旧配置")); expect(byRole("menu")).not.toBeNull(); expect(calls).not.toContain("legacy");
  await key(document.activeElement, "Escape");
  await render(<MenuProvider value={{ menuAdapter: globalAdapter, native: false }}><Dropdown key="local-overrides-default" native menuAdapter={localAdapter} triggerLabel="局部启用" items={items} /></MenuProvider>);
  await click(byText("局部启用")); expect(calls.at(-1)).toBe("local");
});

test("external Dropdown preserves user cancellation and disabled props; controlled false closes host resources", async () => {
  const requests = [], changes = []; let closed = 0;
  const adapter = { open: request => { requests.push(request); return { closed: new Promise(() => {}), close: () => closed++ }; } };
  for (const [index, props] of [[0, { disabled: true }], [1, { triggerProps: { isDisabled: true } }],
    [2, { triggerProps: { onPress: e => e.preventDefault() } }],
    [3, { trigger: <button onClick={e => e.preventDefault()}>禁止打开</button> }]]) {
    await render(<Dropdown key={index} menuAdapter={adapter} triggerLabel="禁止打开" items={[]} {...props} />);
    await click(byText("禁止打开")); expect(requests).toHaveLength(0);
  }
  const renderControlled = open => render(<Dropdown key="controlled" open={open} onOpenChange={next => changes.push(next)}
    menuAdapter={adapter} triggerLabel="受控宿主" items={[]} />);
  await renderControlled(false); await click(byText("受控宿主")); expect(changes).toEqual([true]); expect(requests).toHaveLength(0);
  await renderControlled(true); expect(requests).toHaveLength(1); await renderControlled(false);
  expect(requests[0].signal.aborted).toBe(true); expect(closed).toBe(1);
});

test("public ContextMenu inherits or overrides provider adapters and explicit native=false keeps HeroUI", async () => {
  const requests = []; const adapter = { open: request => { requests.push(request); return {}; } };
  const target = <Button>区域入口</Button>;
  for (const [index, props, external] of [[0, {}, true], [1, { native: false }, false], [2, { menuAdapter: false }, false]]) {
    await render(<MenuProvider value={{ menuAdapter: adapter }}><ContextMenu key={index} {...props} trigger={target} items={[{ value: "copy", label: "复制" }]} /></MenuProvider>);
    const count = requests.length;
    await act(async () => byText("区域入口").dispatchEvent(new win.MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 15, clientY: 25 }))); await settle();
    expect(requests.length - count).toBe(external ? 1 : 0); expect(byRole("menu") !== null).toBe(!external);
    if (!external) await key(document.activeElement, "Escape");
  }
});
