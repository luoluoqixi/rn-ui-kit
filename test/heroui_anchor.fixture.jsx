import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";

const win = new Window({ url: "http://localhost/" });
for (const name of ["window", "document", "navigator", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "MutationObserver"])
  globalThis[name] = name === "window" ? win : win[name];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = clearTimeout;
const React = await import("react");
// Native window measurements resolve asynchronously, just like the bridge.
const act = callback => React.act(async () => { await callback(); });
const platform = process.env.OVERLAY_PLATFORM === "android" ? "android" : "ios";
let position = { x: 24, y: 420, rootY: 0, width: 120, height: 44 };
let windowRect;
let measureNativeWindow;
let nativeTag = 42;
const calls = [];
const nativeNode = {
  measure(callback) { calls.push("root"); callback(0, 0, position.width, position.height, position.x, position.y - position.rootY); },
  // Fabric stops at TrueSheet's RootNodeKind for BOTH measurements. The
  // native sheet's presentation offset is not part of the shadow layout.
  measureInWindow(callback) { calls.push("window"); callback(position.x, position.y - position.rootY - (position.viewportY ?? 0), position.width, position.height); },
  focus() { calls.push(this === nativeNode ? "focus" : "wrong-this"); },
};
const NativeTrigger = React.forwardRef(({ onPress, onLayout, children, ...props }, ref) => {
  React.useImperativeHandle(ref, () => nativeNode, []);
  return <button onClick={onPress} data-testid={props.testID}>{children}</button>;
});
mock.module("react-native", () => ({
  View: ({ children }) => <div>{children}</div>, Pressable: NativeTrigger,
  Text: ({ children }) => <span>{children}</span>, Platform: { OS: platform },
  findNodeHandle: node => node === nativeNode ? nativeTag : null,
  BackHandler: { addEventListener: () => ({ remove() {} }) },
  StyleSheet: { flatten: styles => Object.assign({}, ...[styles].flat(Infinity).filter(Boolean)) },
  useWindowDimensions: () => ({ width: 390, height: 844, scale: 3, fontScale: 1 }),
}));
mock.module("react-native-keyboard-controller", () => ({ KeyboardControllerNative: {
  viewPositionInWindow: tag => {
    calls.push(["native-window", tag]);
    return measureNativeWindow ? measureNativeWindow() : Promise.resolve(windowRect ?? {
      x: position.x, y: position.y, width: position.width, height: position.height,
    });
  },
} }));
mock.module("../node_modules/heroui-native/src/helpers/internal/hooks/use-is-rtl", () => ({ useIsRTL: () => false }));
// Keep the actual upstream trigger, controllable state, augmented ref and
// positioning algorithm, without loading unrelated native animation modules.
const { useAugmentedRef } = await import("../node_modules/heroui-native/src/helpers/internal/hooks/use-augmented-ref");
const { useControllableState } = await import("../node_modules/heroui-native/src/helpers/internal/hooks/use-controllable-state");
const { useRelativePosition } = await import("../node_modules/heroui-native/src/helpers/internal/hooks/use-relative-position");
mock.module("../node_modules/heroui-native/src/helpers/internal/hooks", () => ({ useAugmentedRef, useControllableState, useRelativePosition }));
const primitives = {
  select: await import("../node_modules/heroui-native/src/primitives/select/select"),
  menu: await import("../node_modules/heroui-native/src/primitives/menu/menu"),
  popover: await import("../node_modules/heroui-native/src/primitives/popover/popover"),
};
const HostContext = React.createContext(undefined);
mock.module("../src/core/components/ui/utils/overlay/screen_overlay_portal", () => ({
  useScopedOverlayPortalHostName: () => React.useContext(HostContext),
}));
const { TrueSheetOverlayLayoutProvider, useTrueSheetOverlayLayoutSetter } = await import("../src/core/components/ui/sheet/native_sheet/true_sheet/overlay_layout_context");
const { HeroUIWindowAnchor, HeroUIWindowOverlayScope, useHeroUIOverlayPortalHostName } = await import("../src/core/components/ui/utils/overlay/heroui_anchor.native");
const { PressableChild } = await import("../src/core/components/ui/utils/overlay/pressable_child");
const { createRoot } = await import("react-dom/client");
const { PortalHost } = await import("../node_modules/heroui-native/src/primitives/portal/portal");
let root;
afterEach(async () => {
  await act(() => root?.unmount()); root = undefined; document.body.replaceChildren(); calls.length = 0;
  windowRect = undefined; measureNativeWindow = undefined;
  nativeTag = 42;
});

test("local pressable adapter merges events/styles without a layout wrapper and cleans up React 19 refs", async () => {
  const events = [];
  const attached = [];
  const detached = [];
  const childRef = node => { attached.push(node); return () => detached.push(node); };
  const firstRef = React.createRef();
  const secondRef = React.createRef();
  let received;
  const Child = React.forwardRef((props, ref) => {
    received = props;
    React.useImperativeHandle(ref, () => nativeNode, []);
    return <button>{props.children}</button>;
  });
  const content = (ref, parentStyle, childStyle) => <PressableChild ref={ref} testID="parent" className="parent-class"
    onPress={() => events.push("parent-press")} onLayout={() => events.push("parent-layout")} style={parentStyle}>
    <Child ref={childRef} testID="child" className="child-class" style={childStyle}
      onPress={() => events.push("child-press")} onLayout={() => events.push("child-layout")}>唯一节点</Child>
  </PressableChild>;
  root = createRoot(document.body.appendChild(document.createElement("div")));
  await act(() => root.render(content(firstRef, { opacity: 0.7 }, state => ({ opacity: state.pressed ? 0.4 : 1 }))));
  expect(firstRef.current).toBe(nativeNode); expect(attached).toEqual([nativeNode]);
  expect(received.testID).toBe("child"); expect(received.className).toBe("parent-class child-class");
  received.onPress({}); received.onLayout({});
  expect(events).toEqual(["child-press", "parent-press", "child-layout", "parent-layout"]);
  expect(received.style({ pressed: true })).toEqual([{ opacity: 0.7 }, { opacity: 0.4 }]);
  await act(() => root.render(content(firstRef, state => ({ opacity: state.pressed ? 0.5 : 1 }), { margin: 4 })));
  expect(received.style({ pressed: true })).toEqual([{ opacity: 0.5 }, { margin: 4 }]);
  expect(attached).toHaveLength(1); expect(detached).toHaveLength(0);
  await act(() => root.render(content(secondRef, () => ({ margin: 2 }), () => ({ margin: 6 }))));
  expect(firstRef.current).toBeNull(); expect(secondRef.current).toBe(nativeNode);
  expect(received.style({ pressed: false })).toEqual([{ margin: 2 }, { margin: 6 }]);
  expect(detached).toEqual([nativeNode]); expect(attached).toEqual([nativeNode, nativeNode]);
  await act(() => root.render(content(secondRef, { margin: 2 }, { margin: 6 })));
  expect(received.style).toEqual([{ margin: 2 }, { margin: 6 }]);
  expect(document.querySelectorAll("button")).toHaveLength(1);
  await act(() => root.unmount()); root = undefined;
  expect(secondRef.current).toBeNull(); expect(detached).toEqual([nativeNode, nativeNode]);
});

async function mountSheetProbe(primitive) {
  let state;
  let setLayout;
  const triggerRef = React.createRef();
  const anchorRef = React.createRef();
  function Environment({ children }) {
    setLayout = useTrueSheetOverlayLayoutSetter();
    React.useLayoutEffect(() => setLayout({ sheetTopPosition: 220 }), []);
    return <HostContext.Provider value="rn-ui-kit:true-sheet:parent">{children}</HostContext.Provider>;
  }
  function Trigger() {
    state = primitive.useRootContext();
    return <primitive.Trigger asChild ref={triggerRef}><HeroUIWindowAnchor ref={anchorRef} isOpen={state.isOpen}>
      <NativeTrigger>Sheet 测量</NativeTrigger>
    </HeroUIWindowAnchor></primitive.Trigger>;
  }
  position = { x: 24, y: 420, rootY: 220, width: 120, height: 44 };
  root = createRoot(document.body.appendChild(document.createElement("div")));
  await act(() => root.render(<TrueSheetOverlayLayoutProvider><Environment>
    <primitive.Root><Trigger /></primitive.Root>
  </Environment></TrueSheetOverlayLayoutProvider>));
  return { getState: () => state, triggerRef, anchorRef, setLayout: patch => setLayout(patch) };
}

for (const [name, primitive] of Object.entries(primitives)) {
  test.skipIf(platform !== "android")(name + ": Android app and Modal use root coordinates instead of subtracting the visible viewport origin", async () => {
    let state;
    let placement;
    function Trigger() {
      state = primitive.useRootContext();
      placement = useRelativePosition({ triggerPosition: state.triggerPosition, contentLayout: { x: 0, y: 0, width: 180, height: 150 },
        placement: "bottom", align: "start", alignOffset: 0, offset: 8, avoidCollisions: true });
      return <primitive.Trigger asChild><HeroUIWindowAnchor isOpen={state.isOpen}><NativeTrigger>窗口坐标</NativeTrigger></HeroUIWindowAnchor></primitive.Trigger>;
    }
    root = createRoot(document.body.appendChild(document.createElement("div")));
    for (const host of [undefined, "ui-modal-dialog"]) {
      // On the device, measure() returns 204dp while measureInWindow()
      // returns 164dp: Android's visible viewport begins 40dp below the root.
      position = { x: 32, y: 204, rootY: 0, viewportY: 40, width: 132, height: 48 };
      await act(() => root.render(<HostContext.Provider value={host}><primitive.Root key={host ?? "app"}><Trigger /></primitive.Root></HostContext.Provider>));
      await act(() => document.querySelector("button").click());
      expect(state.triggerPosition).toEqual({ pageX: 32, pageY: 204, width: 132, height: 48 });
      expect(placement.top).toBe(260);
      expect(placement.left).toBe(32);
    }
    expect(calls).toContain("root");
    expect(calls).not.toContain("window");
    expect(calls.filter(Array.isArray)).toEqual([]);
  });

  test(name + ": actual HeroUI Portal follows Android's nearest native window while iOS retains its full-window host", async () => {
    function Popup() {
      const hostName = useHeroUIOverlayPortalHostName();
      return <primitive.Root isDefaultOpen><Trigger /><primitive.Portal hostName={hostName}><span data-popup={name} /></primitive.Portal></primitive.Root>;
    }
    function Trigger() {
      const state = primitive.useRootContext();
      return <primitive.Trigger asChild><HeroUIWindowAnchor isOpen={state.isOpen}><NativeTrigger>Portal</NativeTrigger></HeroUIWindowAnchor></primitive.Trigger>;
    }
    root = createRoot(document.body.appendChild(document.createElement("div")));
    for (const host of [undefined, "rn-ui-kit:true-sheet:parent", "ui-modal-dialog"]) {
      position = { x: 24, y: 420, rootY: 0, width: 120, height: 44 };
      await act(() => root.render(<><div data-host="app"><PortalHost /></div>
        <HostContext.Provider value={host}><Popup />
          {host && <div data-host={host}><PortalHost name={host} /></div>}
        </HostContext.Provider></>));
      await act(() => new Promise(resolve => setTimeout(resolve, 10)));
      const popup = document.querySelector("[data-popup]");
      expect(document.querySelectorAll("[data-popup]")).toHaveLength(1);
      expect(popup.closest("[data-host]").dataset.host).toBe(platform === "android" ? host ?? "app" : "app");
    }
  });

  test.skipIf(platform !== "ios")(name + ": floating iOS sheet uses the actual native window rectangle, including scale and horizontal inset", async () => {
    let state;
    let snapshot;
    function Content() {
      const setLayout = useTrueSheetOverlayLayoutSetter();
      React.useLayoutEffect(() => setLayout({ sheetTopPosition: 220 }), [setLayout]);
      return <primitive.Root><Trigger /><Probe /></primitive.Root>;
    }
    function Trigger() {
      state = primitive.useRootContext();
      return <primitive.Trigger asChild><HeroUIWindowAnchor isOpen={state.isOpen}>
        <NativeTrigger>浮动 Sheet</NativeTrigger>
      </HeroUIWindowAnchor></primitive.Trigger>;
    }
    function Probe() {
      const state = primitive.useRootContext();
      snapshot = useRelativePosition({ triggerPosition: state.triggerPosition, contentLayout: { x: 0, y: 0, width: 180, height: 150 },
        placement: "bottom", align: "start", alignOffset: 0, offset: 8, avoidCollisions: true });
      return null;
    }
    // Fabric sees the untransformed sheet-local Yoga rectangle. UIKit also
    // applies an outer translation/scale that adding sheetTop cannot recover.
    position = { x: 24, y: 420, rootY: 220, width: 120, height: 44 };
    const scale = 0.96;
    windowRect = { x: 8 + position.x * scale, y: 220 + 200 * scale, width: 120 * scale, height: 44 * scale };
    root = createRoot(document.body.appendChild(document.createElement("div")));
    await act(() => root.render(<TrueSheetOverlayLayoutProvider><HostContext.Provider value="rn-ui-kit:true-sheet:parent">
      <Content />
    </HostContext.Provider></TrueSheetOverlayLayoutProvider>));
    await act(() => document.querySelector("button").click());
    expect(state.triggerPosition).toEqual({ pageX: windowRect.x, pageY: windowRect.y, width: windowRect.width, height: windowRect.height });
    expect(snapshot.left).toBe(windowRect.x);
    expect(snapshot.top).toBeCloseTo(windowRect.y + windowRect.height + 8, 8);
    expect(calls).toContainEqual(["native-window", 42]);
  });

  test.skipIf(platform !== "ios")(name + ": native measurement failures fall back to Fabric plus the sheet position", async () => {
    const probe = await mountSheetProbe(primitive);
    for (const failure of ["reject", "invalid", "empty", "throw", "no-tag"]) {
      nativeTag = failure === "no-tag" ? null : 42;
      measureNativeWindow = () => {
        if (failure === "throw") throw new Error("Detached view");
        if (failure === "reject") return Promise.reject(new Error("View not found"));
        return Promise.resolve(failure === "empty" ? null : { x: NaN, y: 0, width: 0, height: 0 });
      };
      await act(() => probe.triggerRef.current.open());
      expect(probe.getState().triggerPosition).toEqual({ pageX: 24, pageY: 420, width: 120, height: 44 });
      await act(() => probe.triggerRef.current.close());
      expect(probe.getState().triggerPosition).toBeNull();
    }
    expect(calls).toContain("window");
  });

  test.skipIf(platform !== "ios")(name + ": stale async measurements cannot restore old positions after motion, close or unmount", async () => {
    const pending = [];
    measureNativeWindow = () => new Promise(resolve => pending.push(resolve));
    const probe = await mountSheetProbe(primitive);
    await act(() => probe.triggerRef.current.open());
    expect(probe.getState().triggerPosition).toBeNull();
    const oldRequests = pending.splice(0);
    expect(oldRequests.length).toBeGreaterThan(0);
    await act(() => probe.setLayout({ sheetTopPosition: 300 }));
    const latestRequests = pending.splice(0);
    expect(latestRequests.length).toBeGreaterThan(0);
    const latestRect = { x: 32, y: 500, width: 115, height: 42 };
    await act(() => latestRequests.forEach(resolve => resolve(latestRect)));
    expect(probe.getState().triggerPosition).toEqual({ pageX: 32, pageY: 500, width: 115, height: 42 });
    await act(() => oldRequests.forEach(resolve => resolve({ ...latestRect, y: 420 })));
    expect(probe.getState().triggerPosition.pageY).toBe(500);
    await act(() => probe.setLayout({ sheetTopPosition: 320 }));
    expect(pending.length).toBeGreaterThan(0);
    await act(() => probe.triggerRef.current.close());
    await act(() => pending.splice(0).forEach(resolve => resolve(latestRect)));
    expect(probe.getState().triggerPosition).toBeNull();
    const callbacks = [];
    await act(() => probe.anchorRef.current.measure((...args) => callbacks.push(args)));
    expect(pending.length).toBeGreaterThan(0);
    await act(() => root.unmount()); root = undefined;
    await act(() => pending.splice(0).forEach(resolve => resolve(latestRect)));
    expect(callbacks).toEqual([]);
    expect(calls).not.toContain("window");
  });

  test(name + ": actual HeroUI Trigger corrects Fabric sheet-local coordinates, preserving child ref/events", async () => {
    let snapshot;
    let state;
    let presses = 0;
    const userRef = React.createRef();
    const triggerRef = React.createRef();
    let setSheetLayout;
    let setHost;
    function Environment({ children }) {
      const [host, updateHost] = React.useState(undefined);
      setHost = updateHost;
      setSheetLayout = useTrueSheetOverlayLayoutSetter();
      return <HostContext.Provider value={host}>{children}</HostContext.Provider>;
    }
    function Trigger() {
      const { isOpen } = primitive.useRootContext();
      return <primitive.Trigger asChild ref={triggerRef}><HeroUIWindowAnchor isOpen={isOpen}>
        <NativeTrigger ref={userRef} testID="original-trigger" onPress={() => presses++}>打开</NativeTrigger>
      </HeroUIWindowAnchor></primitive.Trigger>;
    }
    function Probe() {
      state = primitive.useRootContext();
      snapshot = useRelativePosition({ triggerPosition: state.triggerPosition, contentLayout: { x: 0, y: 0, width: 180, height: 150 },
        placement: "bottom", align: "start", alignOffset: 0, offset: 8, avoidCollisions: true });
      return null;
    }
    root = createRoot(document.body.appendChild(document.createElement("div")));
    await act(() => root.render(<TrueSheetOverlayLayoutProvider><Environment>
      <primitive.Root><Trigger /><Probe /></primitive.Root>
    </Environment></TrueSheetOverlayLayoutProvider>));
    expect(userRef.current).toBe(nativeNode);
    userRef.current.focus();
    for (const { host, rootY, sheetTopPosition } of [
      { host: undefined, rootY: 0, sheetTopPosition: null },
      { host: "rn-ui-kit:true-sheet:parent", rootY: 220, sheetTopPosition: 220 },
      // A fullscreen Dialog inherits React sheet context, but has its own root.
      { host: "ui-modal-dialog", rootY: 0, sheetTopPosition: 220 },
    ]) {
      position = { ...position, x: 24, y: 420, rootY };
      await act(() => { setHost(host); setSheetLayout({ sheetTopPosition }); });
      const nativeCallsBefore = calls.filter(Array.isArray).length;
      await act(() => document.querySelector("button").click());
      expect(state.triggerPosition).toEqual({ pageX: 24, pageY: 420, width: 120, height: 44 });
      expect(snapshot.left).toBe(24);
      expect(snapshot.top).toBe(472);
      expect(state.isOpen).toBe(true);
      expect(calls.filter(Array.isArray).length > nativeCallsBefore).toBe(platform === "ios" && rootY > 0);
      await act(() => triggerRef.current.close());
      expect(state.isOpen).toBe(false);
    }
    // Imperative/default-open paths measure through the same handle.
    position = { ...position, y: 500, rootY: 250 };
    await act(() => { setHost("rn-ui-kit:true-sheet:parent"); setSheetLayout({ sheetTopPosition: 250 }); });
    await act(() => triggerRef.current.open());
    expect(state.triggerPosition.pageY).toBe(500);
    expect(snapshot.top).toBe(552);
    // Updating the native detent/drag position must also move an open popup,
    // even when Yoga does not emit another trigger onLayout event.
    position = { ...position, y: 550, rootY: 300 };
    await act(() => setSheetLayout({ sheetTopPosition: 300 }));
    expect(state.triggerPosition.pageY).toBe(550);
    expect(snapshot.top).toBe(602);
    expect(presses).toBe(3);
    if (platform === "ios") expect(calls).not.toContain("root");
    else expect(calls).toContain("root");
    expect(calls).not.toContain("wrong-this");
    expect(calls).toContain("window");
    expect(document.querySelectorAll("button")).toHaveLength(1);
    await act(() => root.unmount()); root = undefined;
    expect(userRef.current).toBeNull();
  });

  test(name + ": nested sheets use only the nearest absolute position, including initially-open popups", async () => {
    let state;
    function Layout({ top, host, children }) {
      const setLayout = useTrueSheetOverlayLayoutSetter();
      React.useLayoutEffect(() => setLayout({ sheetTopPosition: top }), [top, setLayout]);
      return <HostContext.Provider value={host}>{children}</HostContext.Provider>;
    }
    function Trigger() {
      state = primitive.useRootContext();
      return <primitive.Trigger asChild><HeroUIWindowAnchor isOpen={state.isOpen}>
        <NativeTrigger>默认展开</NativeTrigger>
      </HeroUIWindowAnchor></primitive.Trigger>;
    }
    position = { ...position, x: 24, y: 420, rootY: 280 };
    root = createRoot(document.body.appendChild(document.createElement("div")));
    await act(() => root.render(<TrueSheetOverlayLayoutProvider><Layout top={160} host="rn-ui-kit:true-sheet:parent">
      <HeroUIWindowOverlayScope><TrueSheetOverlayLayoutProvider><Layout top={280} host="rn-ui-kit:true-sheet:child">
        <primitive.Root isDefaultOpen><Trigger /></primitive.Root>
      </Layout></TrueSheetOverlayLayoutProvider></HeroUIWindowOverlayScope>
    </Layout></TrueSheetOverlayLayoutProvider>));
    await act(() => new Promise(resolve => setTimeout(resolve, 10)));
    expect(state.isOpen).toBe(true);
    expect(state.triggerPosition).toEqual({ pageX: 24, pageY: 420, width: 120, height: 44 });
    expect(document.querySelectorAll("button")).toHaveLength(1);
  });

  test(name + ": another popup inside a window portal does not reuse the original sheet offset", async () => {
    let state;
    function Content() {
      const setLayout = useTrueSheetOverlayLayoutSetter();
      React.useLayoutEffect(() => setLayout({ sheetTopPosition: 220 }), [setLayout]);
      return <primitive.Root><Trigger /></primitive.Root>;
    }
    function Trigger() {
      state = primitive.useRootContext();
      return <primitive.Trigger asChild><HeroUIWindowAnchor isOpen={state.isOpen}><NativeTrigger>子弹层</NativeTrigger></HeroUIWindowAnchor></primitive.Trigger>;
    }
    position = { ...position, x: 24, y: 420, rootY: 0 };
    root = createRoot(document.body.appendChild(document.createElement("div")));
    await act(() => root.render(<TrueSheetOverlayLayoutProvider><HostContext.Provider value="rn-ui-kit:true-sheet:parent">
      <HeroUIWindowOverlayScope><Content /></HeroUIWindowOverlayScope>
    </HostContext.Provider></TrueSheetOverlayLayoutProvider>));
    await act(() => document.querySelector("button").click());
    expect(state.triggerPosition).toEqual({ pageX: 24, pageY: 420, width: 120, height: 44 });
    expect(calls.filter(Array.isArray)).toEqual([]);
  });
}
