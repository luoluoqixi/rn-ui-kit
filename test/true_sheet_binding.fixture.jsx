import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
import React, { act, createContext, createRef } from "react";

const win = new Window({ url: "http://localhost/" });
for (const key of ["document", "navigator", "HTMLElement", "Element", "Node", "MutationObserver"]) {
  globalThis[key] = win[key];
}
globalThis.window = win;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const NavigationContext = createContext(null);
const HeaderHeightContext = createContext(0);
mock.module("@react-navigation/native", () => ({ NavigationContext }));
mock.module("@react-navigation/elements", () => ({ HeaderHeightContext }));
const { createRoot } = await import("react-dom/client");
const { TrueSheetScrollableBindingProvider, useTrueSheetScrollableBindingController, useTrueSheetScrollableRegistration } =
  await import("../src/core/components/ui/sheet/native_sheet/true_sheet/scrollable_binding_context");
const { TrueSheetAutoStackLayoutProvider, useTrueSheetStackContentSize } =
  await import("../src/core/components/ui/sheet/native_sheet/true_sheet/auto_stack_layout_context");

let root;
afterEach(async () => {
  await act(() => root?.unmount());
  document.body.replaceChildren();
});
function mount(content) {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  return act(() => root.render(content));
}
function navigation(initialFocus) {
  let focused = initialFocus;
  const listeners = { focus: new Set(), blur: new Set() };
  return {
    isFocused: () => focused,
    addListener: (event, listener) => {
      listeners[event].add(listener);
      return () => listeners[event].delete(listener);
    },
    emit: (event) => {
      focused = event === "focus";
      for (const listener of listeners[event]) listener();
    },
  };
}

test("focused scrollable ref survives outgoing page cleanup and refreshes on present", async () => {
  const first = navigation(true);
  const second = navigation(false);
  const forwarded = createRef();
  let controller;
  function Page({ id, forwardedRef }) {
    const ref = useTrueSheetScrollableRegistration(forwardedRef);
    return <div id={id} ref={ref} />;
  }
  function Host({ showFirst = true, showOverlay = false }) {
    controller = useTrueSheetScrollableBindingController();
    return <TrueSheetScrollableBindingProvider value={controller.providerValue}>
      {showFirst && <NavigationContext.Provider value={first}><Page id="first" /></NavigationContext.Provider>}
      <NavigationContext.Provider value={second}><Page id="second" forwardedRef={forwarded} /></NavigationContext.Provider>
      {showOverlay && <Page id="overlay" />}
    </TrueSheetScrollableBindingProvider>;
  }
  await mount(<React.StrictMode><Host /></React.StrictMode>);
  expect(controller.scrollableRef.current.id).toBe("first");
  await act(() => second.emit("focus"));
  expect(controller.scrollableRef.current).toBe(forwarded.current);
  await act(() => { first.emit("blur"); root.render(<React.StrictMode><Host showFirst={false} /></React.StrictMode>); });
  expect(controller.scrollableRef.current.id).toBe("second");
  await act(() => root.render(<React.StrictMode><Host showFirst={false} showOverlay /></React.StrictMode>));
  expect(controller.scrollableRef.current.id).toBe("overlay");
  await act(() => root.render(<React.StrictMode><Host showFirst={false} /></React.StrictMode>));
  expect(controller.scrollableRef.current).toBe(forwarded.current);
  const before = controller.scrollableRef;
  await act(() => controller.setPresented(true));
  expect(controller.scrollableRef).not.toBe(before);
  expect(controller.scrollableRef.current.id).toBe("second");
  await act(() => second.emit("blur"));
  expect(controller.scrollableRef).toBeUndefined();
});

test("auto stack measures only the focused page, includes its header, and retains height through transitions", async () => {
  const first = navigation(true);
  const second = navigation(false);
  const heights = [];
  const callbacks = {};
  const reportHeight = height => heights.push(height);
  function Page({ id }) {
    callbacks[id] = useTrueSheetStackContentSize();
    return null;
  }
  function Host({ showFirst = true }) {
    return <TrueSheetAutoStackLayoutProvider onHeightChange={reportHeight}>
      {showFirst && <NavigationContext.Provider value={first}><HeaderHeightContext.Provider value={44}><Page id="first" /></HeaderHeightContext.Provider></NavigationContext.Provider>}
      <NavigationContext.Provider value={second}><HeaderHeightContext.Provider value={56}><Page id="second" /></HeaderHeightContext.Provider></NavigationContext.Provider>
    </TrueSheetAutoStackLayoutProvider>;
  }
  await mount(<Host />);
  await act(() => { callbacks.first(300, 1200); callbacks.second(300, 200); });
  expect(heights.at(-1)).toBe(1244);
  await act(() => second.emit("focus"));
  expect(heights.at(-1)).toBe(256);
  await act(() => { first.emit("blur"); root.render(<Host showFirst={false} />); });
  expect(heights.at(-1)).toBe(256);
  expect(heights).not.toContain(undefined);
  const count = heights.length;
  await act(() => second.emit("blur"));
  await act(() => callbacks.second(300, 900));
  expect(heights).toHaveLength(count);
  await act(() => second.emit("focus"));
  expect(heights.at(-1)).toBe(956);
});
