import { afterEach, expect, test } from "bun:test";
import { Window } from "happy-dom";
const win = new Window();
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "ShadowRoot",
  "Element",
  "Node",
  "NodeFilter",
  "MutationObserver",
  "CustomEvent",
  "Event",
  "HTMLInputElement",
  "ResizeObserver",
  "PointerEvent",
  "DOMRect",
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
const Popover = await import("@radix-ui/react-popover");
const { Drawer } =
  await import("../node_modules/@lodev09/react-native-true-sheet/src/web/vaul/index");
const { SheetContentScope } =
  await import("../src/core/components/ui/sheet/native_sheet/true_sheet/sheet_content_scope.web");
const { useOverlayPortalContainer } =
  await import("../src/core/components/ui/utils/overlay/overlay_portal_scope.web");
let root;
let openPopup;
afterEach(async () => {
  await act(() => root?.unmount());
  document.body.replaceChildren();
});
function Popup() {
  const container = useOverlayPortalContainer();
  const [open, setOpen] = React.useState(false);
  openPopup = setOpen;
  return (
    <Popover.Root open={open}>
      <Popover.Trigger>打开</Popover.Trigger>
      <Popover.Portal container={container}>
        <Popover.Content>
          <input id="popup-input" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
function NestedDrawer() {
  const [container, setContainer] = React.useState(null);
  return (
    <div ref={setContainer} style={{ display: "contents" }}>
      {container && (
        <Drawer.Root open modal detached>
          <Drawer.Portal container={container}>
            <Drawer.Content aria-describedby={undefined}>
              <Drawer.Title>Sheet</Drawer.Title>
              <SheetContentScope>
                <Popup />
              </SheetContentScope>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </div>
  );
}
test("真实 Drawer 的子弹层保留在外层 Dialog 内，不被裁切或 aria-hidden 隐藏", async () => {
  const mount = document.createElement("div");
  document.body.append(mount);
  root = createRoot(mount);
  await act(() =>
    root.render(
      <Dialog.Root open>
        <Dialog.Content id="outer-dialog" aria-describedby={undefined}>
          <Dialog.Title>外层</Dialog.Title>
          <NestedDrawer />
        </Dialog.Content>
      </Dialog.Root>,
    ),
  );
  await act(() => openPopup(true));
  const input = document.querySelector("#popup-input");
  expect(input).not.toBeNull();
  expect(input.closest('[aria-hidden="true"]')).toBeNull();
  expect(input.closest("[data-vaul-detached-wrapper]")).toBeNull();
  expect(input.closest("#outer-dialog")).not.toBeNull();
  input.focus();
  expect(document.activeElement).toBe(input);
});
test("Web Sheet 遮罩直接请求关闭，并遵守 dismissible", async () => {
  let closeCount = 0;
  function Probe({ dismissible }) {
    return (
      <Drawer.Root open modal dismissible={dismissible}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content aria-describedby={undefined}>
            <Drawer.Title>Sheet</Drawer.Title>
            <SheetContentScope
              dismissOnOverlayPress={dismissible}
              onRequestClose={() => closeCount++}
            >
              <div>内容</div>
            </SheetContentScope>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  const mount = document.createElement("div");
  document.body.append(mount);
  root = createRoot(mount);
  await act(() => root.render(<Probe dismissible={false} />));
  const overlay = document.querySelector("[data-vaul-overlay]");
  expect(overlay).not.toBeNull();
  await act(() =>
    overlay.dispatchEvent(
      new win.PointerEvent("pointerdown", { bubbles: true, cancelable: true }),
    ),
  );
  expect(closeCount).toBe(0);
  await act(() => root.render(<Probe dismissible />));
  await act(() =>
    overlay.dispatchEvent(
      new win.PointerEvent("pointerdown", { bubbles: true, cancelable: true }),
    ),
  );
  expect(closeCount).toBe(1);
});
