import { afterEach, expect, mock, test } from "bun:test";
import { plugin } from "bun";
plugin({ name: "slot-jsx", setup(build) { build.onLoad({ filter: /@rn-primitives\/slot\/dist\/index\.mjs$/ }, async ({ path }) => ({ contents: await Bun.file(path).text(), loader: "jsx" })); } });
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

const platform = process.env.OVERLAY_PLATFORM ?? "ios";
const nativeWindows = [];
const scopeContext = React.createContext(null);
mock.module("react-native", () => ({ ...RNW, Platform: { ...RNW.Platform, OS: platform },
  useWindowDimensions: () => ({ width: 390, height: 844, scale: 3, fontScale: 1 }),
  Modal: p => { nativeWindows.push(p); return p.visible ? <div data-native-modal>{p.children}</div> : null; },
}));
mock.module("react-native-screens", () => ({ FullWindowOverlay: () => { throw new Error("Dialog must participate in native modal presentation order"); } }));
mock.module("react-native-gesture-handler", () => ({ GestureHandlerRootView: ({ children }) => <div data-gesture-root>{children}</div> }));
mock.module("react-native-keyboard-controller", () => ({ KeyboardControllerNative: {
  viewPositionInWindow: () => Promise.reject(new Error("No native window in the DOM adapter fixture")),
} }));
mock.module("react-native-safe-area-context", () => ({ useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }) }));
mock.module("../src/core/components/ui/utils/overlay/screen_overlay_portal", () => ({
  ScreenOverlayPortalProvider: ({ children, hostName }) => <scopeContext.Provider value={hostName}>{children}</scopeContext.Provider>,
  useScopedOverlayPortalHostName: () => React.useContext(scopeContext),
  useScreenOverlayPortalOffset: () => null,
}));
mock.module("uniwind", () => ({ withUniwind: c => c, ScopedVariables: ({children}) => children, Uniwind: { updateCSSVariables() {}, setTheme() {} }, useUniwind: () => ({ theme: "light" }), useCSSVariable: () => "#123456" }));
const svg={};
for(const name of ["Svg","Path","Circle","G","Defs","Rect","Line","Polyline","Polygon","Ellipse","ClipPath","Mask","Text","TSpan","Use","Symbol","Pattern","Image","LinearGradient","RadialGradient","Stop"])
  svg[name]=React.forwardRef(({children,...p},ref)=>React.createElement(name==="Svg"?"svg":name.toLowerCase(),{...p,ref},children));
mock.module("react-native-svg",()=>({default:svg.Svg,...svg}));
const latest = {};
const hapticCalls = [];
mock.module("../src/core/components/ui/utils/haptics", () => ({ useResolvedNativeHaptics: v => v ?? true, triggerNativeHaptics: v => { if (v) hapticCalls.push(v); } }));
const FakeButton = React.forwardRef(({ children, title, onPress, disabled, isDisabled, accessibilityLabel, ...p }, ref) => <button ref={ref} disabled={disabled || isDisabled} aria-label={accessibilityLabel} onClick={e=>onPress?.(e)}>{title ?? children}</button>);
mock.module("../src/core/components/ui/button", () => ({ Button: FakeButton }));
mock.module("../src/core/components/ui/close_button", () => ({ CloseButton: props => <FakeButton accessibilityLabel="关闭" {...props}>关闭</FakeButton> }));
mock.module("../src/core/components/ui/text", () => ({ Text: ({ children }) => <span>{children}</span> }));
mock.module("../src/core/components/ui/icon", () => ({ Icon: () => <svg /> }));
mock.module("../src/core/components/ui/spinner", () => ({ Spinner: () => <span>loading</span> }));
mock.module("../src/core/components/ui/separator", () => ({ Separator: ({ variant }) => <hr data-variant={variant ?? "thin"} /> }));
const OptionContext = React.createContext(null);
function overlay(name) {
  const Context = React.createContext(null);
  const Root = p => { latest[name] = p; return <Context.Provider value={p}>{p.children}</Context.Provider>; };
  const Trigger = ({ children, isDisabled, variant }) => {
    latest[name + "Trigger"] = { variant };
    const ctx=React.useContext(Context);
    return React.cloneElement(children, { onPress:e=>{children.props.onPress?.(e); if (!isDisabled && !ctx.isDisabled) ctx.onOpenChange(!ctx.isOpen);} });
  };
  const Portal = ({children}) => React.useContext(Context).isOpen ? children : null;
  const Content = p => { latest[name + "Content"] = p; return <div data-content={name}>{p.children}</div>; };
  const Overlay = p => { latest[name + "Overlay"] = p; return <button aria-label={name+"遮罩"} onClick={p.onPress}>遮罩</button>; };
  const text = ({children})=><span>{children}</span>;
  const Item = p => { (latest[name+"Items"] ??= []).push(p); return <OptionContext.Provider value={p}><button disabled={p.disabled || p.isDisabled} data-value={p.value ?? p.id} onClick={()=>{p.onPress?.();}}>{p.children}</button></OptionContext.Provider>; };
  const ItemTitle = ({children}) => {
    if (!React.useContext(OptionContext)) throw new Error("Menu.Item compound components cannot be rendered outside Menu.Item");
    return <span>{children}</span>;
  };
  return Object.assign(Root, { Trigger, Portal, Overlay, Content, Title:text, Description:text, Arrow:()=>null,
    Item, ItemTitle, ItemDescription:text, ItemIndicator:()=>null, Label:text, ListLabel:text,
    ItemLabel:()=> <span>{React.useContext(OptionContext)?.label}</span> });
}
const HeroDialog=overlay("dialog"), HeroPopover=overlay("popover"), HeroMenu=overlay("menu"), HeroSelect=overlay("select");
mock.module("heroui-native/dialog",()=>({Dialog:HeroDialog}));
mock.module("heroui-native/popover",()=>({Popover:HeroPopover}));
mock.module("heroui-native/menu",()=>({Menu:HeroMenu}));
mock.module("heroui-native/select",()=>({Select:HeroSelect}));
const Part=({children})=><div>{children}</div>;
const SubMenu=Object.assign(Part,{Trigger:Part,Content:Part,TriggerIndicator:()=>null});
mock.module("heroui-native/sub-menu",()=>({SubMenu}));
const Group=Object.assign(Part,{Item:FakeButton,ItemPrefix:Part,ItemContent:Part,ItemTitle:Part,ItemDescription:Part,ItemSuffix:Part});
mock.module("heroui-native/list-group",()=>({ListGroup:Group}));
const ToastContext=React.createContext(null);const shown=[];const providerProps=[];
function HeroToastProvider(p) {
  const [rows,setRows]=React.useState([]);
  const rowsRef=React.useRef(rows); rowsRef.current=rows;
  const api=React.useMemo(()=>({
    show:r=>{shown.push(r);setRows(rows=>rows.some(e=>e.id===r.id)?rows:[...rows,r]);return r.id;},
    hide:id=>{const removed=rowsRef.current.filter(r=>id==="all"||r.id===id);setRows(rows=>rows.filter(r=>!removed.includes(r)));removed.forEach(r=>r.onHide?.());},
  }),[]);
  providerProps.push(p);
  return <ToastContext.Provider value={{toast:api}}>{p.children}{rows.map(r=><React.Fragment key={r.id}>{r.component({id:r.id,index:0,total:{value:1},heights:{value:{}},show:api.show,hide:api.hide})}</React.Fragment>)}</ToastContext.Provider>;
}
const HeroToast=Object.assign(p=>{ latest.toast=p;return <div data-native-toast>{p.children}</div>; },{Title:Part,Description:Part,Close:FakeButton});
mock.module("heroui-native/toast",()=>({Toast:HeroToast,ToastProvider:HeroToastProvider,useToast:()=>React.useContext(ToastContext)}));
const {DialogHeroUI:Dialog}=await import("../src/core/components/ui/dialog/dialog_heroui.native");
const {AlertDialogHeroUI:AlertDialog}=await import("../src/core/components/ui/alert_dialog/alert_dialog_heroui.native");
const {PopoverHeroUI:Popover}=await import("../src/core/components/ui/popover/popover_heroui.native");
const {DropdownHeroUI:Dropdown}=await import("../src/core/components/ui/dropdown/dropdown_heroui.native");
const {SelectHeroUI:Select}=await import("../src/core/components/ui/select/select_heroui.native");
const {TooltipHeroUI:Tooltip}=await import("../src/core/components/ui/tooltip/tooltip_heroui.native");
const {ListGroupHeroUI:ListGroup}=await import("../src/core/components/ui/list_group/list_group_heroui.native");
const toast=await import("../src/core/components/ui/toast/toast_heroui.native");
const {toastBridge}=await import("../src/core/components/ui/toast/toast_bridge");
const {createRoot}=await import("react-dom/client");
let root;
async function render(content) {if(!root){const m=document.createElement("div");document.body.append(m);root=createRoot(m);}await act(()=>root.render(content));}
async function click(text) {const n=[...document.querySelectorAll("button")].find(n=>n.textContent===text||n.getAttribute("aria-label")===text);expect(!!n).toBe(true);await act(()=>n.click());}
const pause = ms => act(()=>new Promise(r=>setTimeout(r,ms)));
afterEach(async()=>{await act(()=>{toastBridge.closeAll();root?.unmount();});root=undefined;document.body.replaceChildren();Object.keys(latest).forEach(k=>delete latest[k]);shown.length=0;hapticCalls.length=0;nativeWindows.length=0;});

test("Native Dialog owns a modal presenter and local overlay scope; reopening does not retain child sheet state", async () => {
  const contexts = [];
  const CallerContext = React.createContext("missing");
  function ChildSheetProbe() {
    const [open, setOpen] = React.useState(false);
    contexts.push({ caller: React.useContext(CallerContext), host: React.useContext(scopeContext) });
    return <><FakeButton onPress={() => setOpen(true)}>打开子 Sheet</FakeButton>{open && <div data-sheet>子 Sheet</div>}</>;
  }
  await render(<CallerContext.Provider value="caller-context"><scopeContext.Provider value="outer-sheet"><Dialog trigger="父 Dialog" content={<ChildSheetProbe />} /></scopeContext.Provider></CallerContext.Provider>);
  await click("父 Dialog");
  expect(document.querySelector("[data-native-modal]")).not.toBeNull();
  expect(nativeWindows.at(-1).transparent).toBe(true);
  expect(contexts.at(-1).caller).toBe("caller-context");
  expect(contexts.at(-1).host).toStartWith("ui-modal-");
  expect(contexts.at(-1).host).not.toBe("outer-sheet");
  expect(!!document.querySelector("[data-gesture-root]")).toBe(platform === "android");
  await click("打开子 Sheet");
  expect(document.querySelector("[data-sheet]").closest("[data-native-modal]")).not.toBeNull();
  await click("关闭");
  expect(document.querySelector("[data-native-modal]")).toBeNull();
  await click("父 Dialog");
  expect(document.querySelector("[data-sheet]")).toBeNull();
});

test("Native dialog adapts back/overlay independently and alert actions protect dismissal", async()=>{
  await render(<Dialog defaultOpen title="普通对话框" cancelLabel="取消" dismissOnBackPress={false} />);
  await act(()=>latest.dialog.onOpenChange(false));expect(latest.dialog.isOpen).toBe(true);
  await click("dialog遮罩");expect(latest.dialog.isOpen).toBe(false);
  await render(<AlertDialog key="alert" defaultOpen title="危险操作" destructiveLabel="删除" cancelLabel="返回" />);
  expect(latest.dialogContent.accessibilityRole).toBe("alert");expect(latest.dialogContent.isSwipeable).toBe(false);
  await click("dialog遮罩");expect(latest.dialog.isOpen).toBe(true);await act(()=>latest.dialog.onOpenChange(false));expect(latest.dialog.isOpen).toBe(true);
  await click("删除");expect(latest.dialog.isOpen).toBe(false);
});
test("Native Dialog and AlertDialog explicitly control overlay and back dismissal independently", async () => {
  await render(<Dialog key="protected-overlay" defaultOpen title="遮罩保护" dismissOnOverlayPress={false} />);
  await click("dialog遮罩"); expect(latest.dialog.isOpen).toBe(true);
  await act(() => nativeWindows.at(-1).onRequestClose()); expect(latest.dialog.isOpen).toBe(false);
  await render(<AlertDialog key="allow-overlay" defaultOpen title="允许遮罩" dismissOnOverlayPress />);
  await act(() => nativeWindows.at(-1).onRequestClose()); expect(latest.dialog.isOpen).toBe(true);
  await click("dialog遮罩"); expect(latest.dialog.isOpen).toBe(false);
  await render(<AlertDialog key="allow-back" defaultOpen title="允许返回" dismissOnBackPress />);
  await click("dialog遮罩"); expect(latest.dialog.isOpen).toBe(true);
  await act(() => nativeWindows.at(-1).onRequestClose()); expect(latest.dialog.isOpen).toBe(false);
});
test("Native Popover uses HeroUI popover presentation and render close",async()=>{
  await render(<Popover defaultOpen title="说明" content={({close})=><FakeButton onPress={close}>收起</FakeButton>}><FakeButton>打开</FakeButton></Popover>);
  expect(latest.popoverContent.presentation).toBe("popover");await click("收起");expect(latest.popover.isOpen).toBe(false);
});
test("Native Menu preserves NativeTrigger, selected/disabled data, callbacks and imperative anchor",async()=>{
  const ref={current:null};let presses=0;const fn=()=>presses++;
  await render(<Dropdown __menuRef={ref} nativeTrigger triggerLabel="原生风格触发器" nativeTriggerIcon="none"
    items={[{value:"a",label:"执行",selected:true,checkbox:true,onPress:fn,onSelect:fn},{value:"b",label:"禁用",disabled:true}]} />);
  expect(document.body.textContent).toContain("原生风格触发器");await act(()=>ref.current.presentMenu());
  expect(latest.menuContent.presentation).toBe("popover");expect(latest.menuItems.find(i=>i.id==="a").isSelected).toBe(true);
  expect(latest.menuItems.find(i=>i.id==="b").isDisabled).toBe(true);await click("执行");expect(presses).toBe(1);
  expect(hapticCalls.length).toBe(2);await render(null);expect(ref.current).toBeNull();
});
test("Native basic Select maps option objects, disabled rows, null control, refs and render values",async()=>{
  const ref=React.createRef();const changes=[];
  const items=[{value:"a",label:"甲"},{value:"b",label:"乙",isDisabled:true},{value:"c",label:"丙"}];
  await render(<Select ref={ref} nativeTrigger defaultValue="a" items={items} onValueChange={v=>changes.push(v)} />);
  expect(latest.selectTrigger.variant).toBe("unstyled");
  expect(latest.select.value).toEqual({value:"a",label:"甲"});await act(()=>ref.current.open());expect(latest.selectContent.presentation).toBe("popover");
  expect(latest.selectItems.find(i=>i.value==="b").disabled).toBe(true);
  await act(()=>latest.select.onValueChange({value:"b",label:"乙"}));expect(changes).toEqual([]);
  await act(()=>latest.select.onValueChange({value:"c",label:"丙"}));expect(changes).toEqual(["c"]);
  await render(<Select ref={ref} value={null} items={items} onValueChange={v=>changes.push(v)} />);expect(latest.select.value).toBeUndefined();
  expect(latest.selectTrigger.variant).toBe("unstyled");
  await act(()=>latest.select.onValueChange({value:"a",label:"甲"}));expect(latest.select.value).toBeUndefined();
  await act(()=>ref.current.close());expect(latest.select.isOpen).toBe(false);
});
for (const [name, Component] of [["menu", Dropdown], ["select", Select]]) {
  test(name + ": Native vertical menus default to center and preserve explicit alignment and horizontal defaults", async () => {
    const cases = [
      [undefined, "bottom", "center"],
      [{ side: "top" }, "top", "center"],
      [{ side: "left" }, "left", "start"],
      [{ side: "right" }, "right", "start"],
      [{ align: "start" }, "bottom", "start"],
      [{ align: "center" }, "bottom", "center"],
      [{ align: "end" }, "bottom", "end"],
      [{ side: "right", align: "center" }, "right", "center"],
      [{ side: "bottom", herouiNativeProps: { placement: "right" } }, "right", "start"],
      [{ side: "right", herouiNativeProps: { placement: "top" } }, "top", "center"],
      [{ align: "start", herouiNativeProps: { align: "end" } }, "bottom", "end"],
    ];
    for (const [index, [contentProps, placement, align]] of cases.entries()) {
      await render(<Component key={index} defaultOpen contentProps={contentProps} items={[{ value: "a", label: "菜单项" }]} />);
      expect(latest[name + "Content"].placement).toBe(placement);
      expect(latest[name + "Content"].align).toBe(align);
    }
  });
}

test("Native submenu titles render without a Menu.Item context, including nested submenu data", async()=>{
  let presses=0;
  const ref=React.createRef();
  await render(<Dropdown __menuRef={ref} triggerLabel="子菜单入口" items={[
    {value:"folder",label:"移动到",subMenu:[
      {value:"nested",label:"更多位置",subMenu:[{value:"target",label:"工作区",onPress:()=>presses++}]},
    ]},
  ]} />);
  await act(()=>ref.current.presentMenu());
  expect(document.body.textContent).toContain("更多位置");
  await click("工作区"); expect(presses).toBe(1);
});
test("Native Menu exposes thick/thin separators, shortcuts, bounded scrolling and explicit persistent choices", async () => {
  let alignment = "left";
  await render(<Dropdown defaultOpen contentProps={{ side: "left", maxHeight: 280 }} items={[
    { value: "left", label: "左对齐", selected: true, selectionIndicatorVariant: "dot", shouldCloseOnSelect: false, shortcut: "⌘ L", onSelect: () => { alignment = "left"; } },
    { value: "thin", separator: true },
    { value: "right", label: "右对齐", selected: false, shouldCloseOnSelect: false, onSelect: () => { alignment = "right"; } },
    { value: "thick", separator: true, separatorVariant: "thick" },
    ...Array.from({ length: 40 }, (_, i) => ({ value: "row-" + i, label: "滚动条目 " + i })),
  ]} />);
  expect(latest.menuContent.placement).toBe("left");
  expect(document.querySelector('[data-variant="thin"]')).not.toBeNull();
  expect(document.querySelector('[data-variant="thick"]')).not.toBeNull();
  expect(document.body.textContent).toContain("⌘ L");
  expect(document.body.textContent).toContain("滚动条目 39");
  expect([...document.querySelectorAll("div")].some(node => node.style.maxHeight === "280px")).toBe(true);
  expect(latest.menuItems.find(item => item.id === "left").shouldCloseOnSelect).toBe(false);
  await click("右对齐");
  expect(alignment).toBe("right");
});
test("Native Tooltip renders children directly and ListGroup selection respects disabled",async()=>{
  let pressed=0;await render(<Tooltip content="提示"><FakeButton onPress={()=>pressed++}>子元素</FakeButton></Tooltip>);expect(document.querySelectorAll("button").length).toBe(1);await click("子元素");expect(pressed).toBe(1);
  const selected=[];await render(<ListGroup selectionMode="single" defaultSelectedKeys={["a"]} onSelectionChange={v=>selected.push([...v])} items={[{id:"a",title:"甲"},{id:"b",title:"乙"},{id:"c",title:"禁用",isDisabled:true}]} />);
  await click("乙");expect(selected).toEqual([["b"]]);await click("禁用");expect(selected).toHaveLength(1);
});
test("Native HeroUI Toast updates same ID without reentering, keeps numeric custom IDs and viewport routing",async()=>{
  await render(<><toast.BasicToaster /><toast.BasicToaster viewportName="sheet" /></>);
  await act(()=>toast.showBasicToast("加载中","loading",{id:42,toasterId:"sheet",duration:Infinity}));expect(shown).toHaveLength(1);
  expect(latest.toast.className).toContain("flex-row");
  expect(document.body.textContent).toContain("加载中");expect(latest.toast.isSwipeable).toBe(false);
  await act(()=>toast.showBasicToast("已完成","success",{id:42,toasterId:"sheet",duration:Infinity}));expect(shown).toHaveLength(1);expect(document.body.textContent).toContain("已完成");expect(latest.toast.variant).toBe("success");
  await act(()=>toast.showBasicCustom(id=><span>编号 {id}</span>,{id:43,duration:Infinity}));expect(document.body.textContent).toContain("编号 43");
  await act(()=>toast.dismissBasicToast(42));expect(document.body.textContent).not.toContain("已完成");
  await act(()=>toast.showBasicToast("自动关闭","info",{id:"auto",duration:20}));await pause(40);expect(toastBridge.get("auto")).toBeUndefined();
  await act(()=>toast.dismissAllBasicToasts());expect(document.querySelectorAll("[data-native-toast]").length).toBe(0);
});
