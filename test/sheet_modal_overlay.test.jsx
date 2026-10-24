import { afterEach, expect, mock, test } from "bun:test";
import { plugin } from "bun";
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
test("Dropdown 与 ContextMenu 二级菜单跟随 Dialog scope，不挂到 body", async () => {
  const { OverlayPortalScope } =
    await import("../src/core/components/ui/utils/overlay/overlay_portal_scope.web");
  const { DropdownSubmenuPortal, ContextSubmenuPortal } =
    await import("../src/core/components/ui/utils/overlay/submenu_portal.web");
  const Dropdown = await import("@radix-ui/react-dropdown-menu");
  const Context = await import("@radix-ui/react-context-menu");
  const mount = document.createElement("div");
  document.body.append(mount);
  root = createRoot(mount);
  await act(() =>
    root.render(
      <section id="dialog-menu">
        <OverlayPortalScope>
          <Dropdown.Root open>
            <Dropdown.Trigger>下拉</Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Sub open>
                <Dropdown.SubTrigger>更多</Dropdown.SubTrigger>
                <DropdownSubmenuPortal>
                  <Dropdown.Item id="dropdown-sub">下拉二级</Dropdown.Item>
                </DropdownSubmenuPortal>
              </Dropdown.Sub>
            </Dropdown.Content>
          </Dropdown.Root>
          <Context.Root>
            <Context.Trigger>右键</Context.Trigger>
            <Context.Content forceMount>
              <Context.Sub open>
                <Context.SubTrigger>更多</Context.SubTrigger>
                <ContextSubmenuPortal>
                  <Context.Item id="context-sub">右键二级</Context.Item>
                </ContextSubmenuPortal>
              </Context.Sub>
            </Context.Content>
          </Context.Root>
        </OverlayPortalScope>
      </section>,
    ),
  );
  expect(
    document.querySelector("#dropdown-sub")?.closest("#dialog-menu"),
  ).not.toBeNull();
  expect(
    document.querySelector("#context-sub")?.closest("#dialog-menu"),
  ).not.toBeNull();
});
test("二级菜单 Escape 关闭菜单组，保留外层 Dialog 并返回触发器", async () => {
  const { OverlayPortalScope } =
    await import("../src/core/components/ui/utils/overlay/overlay_portal_scope.web");
  const { DropdownSubmenuPortal } =
    await import("../src/core/components/ui/utils/overlay/submenu_portal.web");
  const Dropdown = await import("@radix-ui/react-dropdown-menu");
  const mount = document.createElement("div");
  document.body.append(mount);
  root = createRoot(mount);
  await act(() =>
    root.render(
      <Dialog.Root open>
        <Dialog.Content id="escape-dialog" aria-describedby={undefined}>
          <Dialog.Title>菜单测试</Dialog.Title>
          <OverlayPortalScope>
            <Dropdown.Root defaultOpen>
              <Dropdown.Trigger id="menu-trigger">打开</Dropdown.Trigger>
              <Dropdown.Content id="main-menu">
                <Dropdown.Sub>
                  <Dropdown.SubTrigger id="sub-trigger">
                    更多
                  </Dropdown.SubTrigger>
                  <DropdownSubmenuPortal id="sub-menu">
                    <Dropdown.Item>子项</Dropdown.Item>
                  </DropdownSubmenuPortal>
                </Dropdown.Sub>
              </Dropdown.Content>
            </Dropdown.Root>
          </OverlayPortalScope>
        </Dialog.Content>
      </Dialog.Root>,
    ),
  );
  await act(() =>
    document.querySelector("#sub-trigger").dispatchEvent(
      new win.KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(document.querySelector("#sub-menu")).not.toBeNull();
  await act(() =>
    document.querySelector("#sub-menu").dispatchEvent(
      new win.KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(document.querySelector("#sub-menu")).toBeNull();
  expect(document.querySelector("#main-menu")).toBeNull();
  expect(document.querySelector("#escape-dialog")).not.toBeNull();
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  expect(document.activeElement?.id).toBe("menu-trigger");
});

// 将 Native 平台入口映射到真实 RNW，覆盖实际适配器而非 DOM 替身。
// 上游发布的 .mjs 保留 JSX，按其实际语法加载，不替换 Slot 实现。
plugin({
  name: "rn-slot-jsx",
  setup(build) {
    build.onLoad(
      { filter: /@rn-primitives\/slot\/dist\/index\.mjs$/ },
      async ({ path }) => ({
        contents: await Bun.file(path).text(),
        loader: "jsx",
      }),
    );
  },
});
const RNW = await import("react-native-web");
mock.module("react-native", () => RNW);
for (const kind of ["dropdown", "context_menu"]) {
  for (const variant of ["array", "callback", "asChild"]) {
    test(`${kind} 二级菜单保留 ${variant} 样式、主题变量和 Radix 样式`, async () => {
      const { ScopedSubContent } = await import(
        `../src/core/components/ui/${kind}/scoped_sub_content.web`
      );
      const Menu = await import(
        kind === "dropdown"
          ? "@radix-ui/react-dropdown-menu"
          : "@radix-ui/react-context-menu"
      );
      const contentStyle = [
        { "--color-popover": "red" },
        { width: 321, maxHeight: 234 },
      ];
      const mount = document.createElement("div");
      document.body.append(mount);
      root = createRoot(mount);
      const content = (
        <Menu.Content forceMount>
          <Menu.Sub open>
            <Menu.SubTrigger>更多</Menu.SubTrigger>
            <ScopedSubContent
              testID="styled-submenu"
              asChild={variant === "asChild"}
              style={
                variant === "callback"
                  ? ({ pressed }) => [
                      ...contentStyle,
                      { opacity: pressed ? 0.5 : 1 },
                    ]
                  : contentStyle
              }
            >
              {variant === "asChild" ? (
                <RNW.Pressable style={{ minWidth: 123 }} />
              ) : (
                <Menu.Item>子项</Menu.Item>
              )}
            </ScopedSubContent>
          </Menu.Sub>
        </Menu.Content>
      );
      await act(() =>
        root.render(
          kind === "dropdown" ? (
            <Menu.Root open>
              <Menu.Trigger>下拉</Menu.Trigger>
              {content}
            </Menu.Root>
          ) : (
            <Menu.Root>
              <Menu.Trigger>右键</Menu.Trigger>
              {content}
            </Menu.Root>
          ),
        ),
      );
      const node = document.querySelector('[data-testid="styled-submenu"]');
      expect(node).not.toBeNull();
      const styles = getComputedStyle(node);
      expect(styles.width).toBe("321px");
      expect(styles.maxHeight).toBe("234px");
      expect(node.style.getPropertyValue("--color-popover")).toBe("red");
      expect(
        node
          .closest('[role="menu"]')
          .style.getPropertyValue(
            kind === "dropdown"
              ? "--radix-dropdown-menu-content-transform-origin"
              : "--radix-context-menu-content-transform-origin",
          ),
      ).not.toBe("");
      if (variant === "callback") expect(styles.opacity).toBe("1");
      if (variant === "asChild") expect(styles.minWidth).toBe("123px");
    });
  }
}

test("真实 RNW 二级菜单在嵌套 Dialog 中展开后保留焦点", async () => {
  const { OverlayPortalScope } =
    await import("../src/core/components/ui/utils/overlay/overlay_portal_scope.web");
  const { ScopedSubContent } =
    await import("../src/core/components/ui/dropdown/scoped_sub_content.web");
  const Menu = await import("@radix-ui/react-dropdown-menu");
  let showInner;
  let showMenu;
  function Inner() {
    const container = useOverlayPortalContainer();
    const [open, setOpen] = React.useState(false);
    const [menu, setMenu] = React.useState(false);
    showInner = setOpen;
    showMenu = setMenu;
    return (
      <Dialog.Root open={open}>
        <Dialog.Portal container={container}>
          <Dialog.Content id="inner-dialog" aria-describedby={undefined}>
            <Dialog.Title>组件测试</Dialog.Title>
            <OverlayPortalScope>
              <Menu.Root open={menu} onOpenChange={setMenu}>
                <Menu.Trigger>打开</Menu.Trigger>
                <Menu.Content>
                  <Menu.Sub>
                    <Menu.SubTrigger id="rn-sub-trigger">更多</Menu.SubTrigger>
                    <ScopedSubContent
                      testID="rn-submenu"
                      style={[{ width: 321 }]}
                    >
                      <Menu.Item id="rn-first-item">第一项</Menu.Item>
                    </ScopedSubContent>
                  </Menu.Sub>
                </Menu.Content>
              </Menu.Root>
            </OverlayPortalScope>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
  const mount = document.createElement("div");
  document.body.append(mount);
  root = createRoot(mount);
  await act(() =>
    root.render(
      <Dialog.Root open>
        <Dialog.Content aria-describedby={undefined}>
          <Dialog.Title>设置</Dialog.Title>
          <OverlayPortalScope>
            <Inner />
          </OverlayPortalScope>
        </Dialog.Content>
      </Dialog.Root>,
    ),
  );
  await act(() => showInner(true));
  await act(() => showMenu(true));
  await act(() => {
    const trigger = document.querySelector("#rn-sub-trigger");
    trigger.focus();
    trigger.dispatchEvent(
      new win.KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      }),
    );
  });
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  const submenu = document.querySelector('[data-testid="rn-submenu"]');
  expect(submenu).not.toBeNull();
  expect(submenu.contains(document.activeElement)).toBe(true);
});
