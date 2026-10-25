import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
const win = new Window();
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "Element",
  "Node",
  "Event",
  "MouseEvent",
  "ShadowRoot",
])
  globalThis[key] = key === "window" ? win : win[key];
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const RNW = await import("react-native-web");
mock.module("react-native", () => RNW);
const React = await import("react");
const { act } = React;
const { createRoot } = await import("react-dom/client");
const { ContextMenuHost } =
  await import("../src/core/components/ui/context_menu/context_menu_host.web");
const { MenuProvider } =
  await import("../src/core/components/ui/context_menu/menu_provider");
let root;
afterEach(async () => {
  await act(() => root?.unmount());
  document.body.replaceChildren();
});

test("嵌套原生菜单仅触发内层，键盘支持打开，替换和卸载使旧请求失效", async () => {
  const mount = document.createElement("div");
  document.body.append(mount);
  root = createRoot(mount);
  const requests = [];
  const resolvers = [];
  const changes = [];
  await act(() =>
    root.render(
      <MenuProvider
        value={{
          native: true,
          showNativeMenu: (request) => {
            requests.push(request);
            return new Promise((resolve) => resolvers.push(resolve));
          },
        }}
      >
        <ContextMenuHost items={[{ value: "outer" }]} trigger={<div>外层</div>}>
          <ContextMenuHost
            items={[{ value: "inner", textValue: "内层" }]}
            trigger={<button id="target">目标</button>}
            onOpenChange={(open) => changes.push(open)}
          />
        </ContextMenuHost>
      </MenuProvider>,
    ),
  );
  const target = document.querySelector("#target");
  await act(() =>
    target.dispatchEvent(
      new win.MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 42,
        clientY: 73,
      }),
    ),
  );
  expect(requests.length).toBe(1);
  expect(requests[0].items[0].text).toBe("内层");
  expect([requests[0].x, requests[0].y]).toEqual([42, 73]);
  expect(requests[0].isCurrent()).toBe(true);
  await act(() =>
    target.dispatchEvent(
      new win.KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "F10",
        shiftKey: true,
      }),
    ),
  );
  expect(requests.length).toBe(2);
  expect(requests[0].isCurrent()).toBe(false);
  await act(() => resolvers[0]());
  expect(changes).toEqual([true, true]);
  await act(() => root.unmount());
  root = null;
  expect(requests[1].isCurrent()).toBe(false);
  await act(() => resolvers[1]());
  expect(changes).toEqual([true, true]);
});
