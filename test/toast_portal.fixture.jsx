import { afterEach, expect, test } from "bun:test";
import { Window } from "happy-dom";
const win = new Window();
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "Element",
  "Node",
  "NodeFilter",
  "MutationObserver",
  "CustomEvent",
  "Event",
  "HTMLInputElement",
  "ResizeObserver",
  "HTMLTextAreaElement", "HTMLSelectElement", "HTMLLabelElement", "HTMLFormElement", "DOMRect", "Range", "KeyboardEvent",
  "PointerEvent", "HTMLButtonElement", "HTMLAnchorElement", "MouseEvent", "FocusEvent", "Document", "navigator", "SVGElement", "ShadowRoot",
])
  globalThis[key] = key === "window" ? win : win[key];
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.requestAnimationFrame = win.requestAnimationFrame.bind(win);
globalThis.cancelAnimationFrame = win.cancelAnimationFrame.bind(win);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import("react");
const { act } = React;
const { createRoot } = await import("react-dom/client");
const Dialog = await import("@radix-ui/react-dialog");
const { Toast, ToastQueue } = await import("@heroui/react/toast");
const queue = new ToastQueue({ exitDuration: 0 });
function toast(title) { queue.add({ title }); }
toast.dismiss = () => queue.clear();
function Toaster() {
  return <Toast.Provider queue={queue}>{({toast}) => <Toast toast={toast}>
    <Toast.Content><Toast.Title>{toast.content.title}</Toast.Title></Toast.Content>
    <Toast.CloseButton aria-label="关闭通知" />
  </Toast>}</Toast.Provider>;
}
const { ToastPortal } =
  await import("../src/core/components/ui/toast/toast_portal.web");
const { OverlayPortalScope } =
  await import("../src/core/components/ui/utils/overlay/overlay_portal_scope.web");
let root;
let dismissals = 0;
let sheetDismissals = 0;
afterEach(async () => {
  await act(() => { toast.dismiss(); root?.unmount(); });
  root = undefined;
  dismissals = 0;
  sheetDismissals = 0;
  document.body.replaceChildren();
});
function Modal({ id, open, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={() => dismissals++}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content id={id} aria-describedby={undefined}>
          <Dialog.Title>{id}</Dialog.Title>
          <OverlayPortalScope>{children}</OverlayPortalScope>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
function Fixture({ outer = false, inner = false }) {
  return (
    <>
      <div id="app" style={{ position: "relative", zIndex: 0 }}>
        <ToastPortal>
          <Toaster closeButton />
        </ToastPortal>
      </div>
      <Modal id="outer" open={outer}>
        <Modal id="inner" open={inner} />
      </Modal>
    </>
  );
}
async function render(props) {
  if (!root) {
    const mount = document.createElement("div");
    document.body.append(mount);
    root = createRoot(mount);
  }
  await act(async () => { root.render(<Fixture {...props} />); });
  await act(() => new Promise(resolve => setTimeout(resolve, 40)));
}
test("全局 Toast 脱离应用层叠上下文，跟随最上层 Dialog，关闭后保留相同实例", async () => {
  await render({});
  await act(async () => {
    toast("持续提示", { id: "persistent", duration: Infinity });
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  const notification = document.querySelector('[data-slot="toast"]');
  expect(notification).not.toBeNull();
  expect(notification.closest("#app") === null).toBe(true);
  await render({ outer: true, inner: true });
  expect(notification.closest("#inner") !== null).toBe(true);
  expect(notification.closest('[aria-hidden="true"]') === null).toBe(true);
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  await act(() => {
    notification.dispatchEvent(
      new win.PointerEvent("pointerdown", {
        bubbles: true,
        pointerType: "mouse",
        button: 0,
      }),
    );
    notification.dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
  expect(dismissals).toBe(0);
  const close = notification.querySelector("button");
  await act(() => close.focus());
  expect(document.activeElement).toBe(close);
  // 确认 outside-dismiss 监听实际工作，避免零 dismissals 是事件未启用导致的假阳性。
  await act(async () => {
    document.body.dispatchEvent(
      new win.PointerEvent("pointerdown", {
        bubbles: true,
        pointerType: "mouse",
        button: 0,
      }),
    );
    document.body.dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
  expect(dismissals).toBe(1);
  await render({ outer: true });
  expect(document.querySelector('[data-slot="toast"]')).toBe(notification);
  expect(notification.closest("#outer") !== null).toBe(true);
  await render({});
  expect(document.querySelector('[data-slot="toast"]')).toBe(notification);
  expect(notification.isConnected).toBe(true);
  await act(() => root.unmount());
  root = undefined;
  expect(document.querySelector('[data-slot="toast"]')).toBeNull();
});

const { Drawer } =
  await import("../node_modules/@lodev09/react-native-true-sheet/src/web/vaul/index");
const { SheetContentScope } =
  await import("../src/core/components/ui/sheet/native_sheet/true_sheet/sheet_content_scope.web");
function SheetFixture({ open }) {
  const [container, setContainer] = React.useState(null);
  return (
    <>
      <ToastPortal>
        <Toaster closeButton />
      </ToastPortal>
      <Modal id="sheet-dialog" open>
        <div ref={setContainer} style={{ display: "contents" }}>
          {container && (
            <Drawer.Root
              open={open}
              onOpenChange={() => sheetDismissals++}
              modal
              detached
            >
              <Drawer.Portal container={container}>
                <Drawer.Overlay />
                <Drawer.Content aria-describedby={undefined}>
                  <Drawer.Title>Sheet</Drawer.Title>
                  <SheetContentScope>
                    <button>输入</button>
                  </SheetContentScope>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          )}
        </div>
      </Modal>
    </>
  );
}
test("Dialog 中的真实 Drawer 不裁切全局 Toast，关闭 Sheet 后返回 Dialog", async () => {
  const mount = document.createElement("div");
  document.body.append(mount);
  root = createRoot(mount);
  await act(() => root.render(<SheetFixture open />));
  await act(async () => {
    toast("Sheet 提示", { id: "sheet-toast", duration: Infinity });
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  const notification = document.querySelector('[data-slot="toast"]');
  expect(notification !== null).toBe(true);
  expect(notification.closest("[data-ui-sheet-overlay-scope]") !== null).toBe(
    true,
  );
  expect(notification.closest("[data-vaul-detached-wrapper]") === null).toBe(
    true,
  );
  expect(notification.closest('[aria-hidden="true"]') === null).toBe(true);
  const close = notification.querySelector("button");
  await act(() => close.focus());
  expect(document.activeElement === close).toBe(true);
  await act(async () => {
    notification.dispatchEvent(
      new win.PointerEvent("pointerdown", {
        bubbles: true,
        pointerType: "mouse",
        button: 0,
      }),
    );
    notification.dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
  expect(sheetDismissals).toBe(0);
  // Exercise the actual close control, not only a press on the notification
  // body. Removing its focused node must not dismiss the surrounding Drawer.
  await act(() => close.click());
  await act(() => new Promise(resolve => setTimeout(resolve, 30)));
  expect(document.querySelector('[data-slot="toast"]')).toBeNull();
  expect(document.querySelector('[data-vaul-drawer]')).not.toBeNull();
  expect(sheetDismissals).toBe(0);
  expect(dismissals).toBe(0);
  await act(async () => {
    toast("Sheet 关闭后仍保留提示");
    await new Promise(resolve => setTimeout(resolve, 30));
  });
  const persistent = document.querySelector('[data-slot="toast"]');
  expect(persistent).not.toBeNull();
  await act(() => root.render(<SheetFixture open={false} />));
  expect(document.querySelector('[data-slot="toast"]') === persistent).toBe(
    true,
  );
  expect(persistent.closest("#sheet-dialog") !== null).toBe(true);
  expect(persistent.closest("[data-ui-sheet-overlay-scope]") === null).toBe(
    true,
  );
});
