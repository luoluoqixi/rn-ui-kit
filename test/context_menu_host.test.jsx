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
  await act(async () => root?.unmount());
  root = undefined;
  document.body.replaceChildren();
});

test("嵌套原生菜单仅触发内层，键盘支持打开，替换和卸载使旧请求失效", async () => {
  const mount = document.createElement("div");
  document.body.append(mount);
  root = createRoot(mount);
  const requests = [];
  const resolvers = [];
  const changes = [];
  await act(async () =>
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
  await act(async () =>
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
  await act(async () =>
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
  await act(async () => resolvers[0]());
  expect(changes).toEqual([true, true]);
  await act(async () => root.unmount());
  root = null;
  expect(requests[1].isCurrent()).toBe(false);
  await act(async () => resolvers[1]());
  expect(changes).toEqual([true, true]);
});

const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
async function renderHost(props, value = {}) {
  const { key, ...rest } = props;
  if (!root) root = createRoot(document.body.appendChild(document.createElement("div")));
  await act(async () => root.render(<MenuProvider value={value}><ContextMenuHost key={key} items={[{ value: "copy" }]} trigger={<button id="host-target">触发器</button>} {...rest} /></MenuProvider>));
}
async function contextClick(target = document.querySelector("#host-target")) {
  const event = new win.MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 21, clientY: 52 });
  await act(async () => target.dispatchEvent(event)); return event;
}

test("外部 ContextMenu 尊重根与 trigger 禁用、preventDefault；自定义处理器不会被覆盖", async () => {
  const requests = [], handled = []; const config = { menuAdapter: { open: request => { requests.push(request); return {}; } } };
  await renderHost({ disabled: true }, config); await contextClick(); expect(requests).toHaveLength(0);
  await renderHost({ triggerProps: { disabled: true } }, config); await contextClick(); expect(requests).toHaveLength(0);
  await renderHost({ triggerProps: { onContextMenu: e => { handled.push("context"); e.preventDefault(); }, onKeyDown: e => { handled.push("key"); e.preventDefault(); } } }, config);
  await contextClick(); await act(async () => document.querySelector("#host-target").dispatchEvent(new win.KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "ContextMenu" })));
  expect(handled).toEqual(["context", "key"]); expect(requests).toHaveLength(0);
});

test("外部 ContextMenu 受控打开需父组件确认；显示与关闭分离，触发器拿到真实 open", async () => {
  const requests = [], changes = []; const closed = deferred();
  const config = { menuAdapter: { open: request => { requests.push(request); return { closed: closed.promise }; } } };
  const props = { open: false, onOpenChange: next => changes.push(next), trigger: ({ open, native }) => <button id="host-target" data-open={open} data-native={native}>受控</button> };
  await renderHost(props, config); await contextClick(); expect(requests).toHaveLength(0); expect(changes).toEqual([true]);
  await renderHost({ ...props, open: true }, config); expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({ kind: "context-menu", source: "pointer", x: 21, y: 52 });
  expect(document.querySelector("#host-target").dataset.open).toBe("true");
  await act(async () => closed.resolve()); expect(changes).toEqual([true, false]); expect(requests[0].isCurrent()).toBe(false);
  await renderHost({ ...props, open: false }, config); expect(requests).toHaveLength(1);
});

test("键盘锚点、defaultOpen、命令式入口以及无关闭通知的后续动作可用", async () => {
  const requests = [], changes = []; let actions = 0; const ref = { current: null };
  const config = { menuAdapter: { open: request => { requests.push(request); return {}; } } };
  await renderHost({ __menuRef: ref, defaultOpen: true, onOpenChange: next => changes.push(next), items: [{ value: "copy", onSelect: () => actions++ }] }, config);
  expect(requests).toHaveLength(1); expect(requests[0].source).toBe("programmatic"); expect(changes).toEqual([false]);
  await act(async () => requests[0].select(requests[0].items[0].id)); expect(actions).toBe(1);
  const target = document.querySelector("#host-target"); target.getBoundingClientRect = () => ({ left: 10, top: 20, width: 120, height: 44, bottom: 64 });
  await act(async () => target.dispatchEvent(new win.KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "ContextMenu" })));
  expect(requests[1]).toMatchObject({ source: "keyboard", x: 10, y: 64, anchor: { rect: { x: 10, y: 20, width: 120, height: 44 } } });
  expect(requests[0].signal.aborted).toBe(true);
  await act(async () => ref.current.presentMenu()); expect(requests).toHaveLength(3); expect(requests[2].source).toBe("programmatic");
});

test("可观察关闭仅在适当时恢复焦点，不能抢走用户已移到其他控件的焦点", async () => {
  for (const changeFocus of [false, true]) {
    const closed = deferred();
    await renderHost({ key: String(changeFocus) }, { menuAdapter: { open: () => ({ closed: closed.promise }) } });
    const target = document.querySelector("#host-target"); target.focus(); await contextClick(target);
    const other = document.body.appendChild(document.createElement("button"));
    if (changeFocus) other.focus(); else document.body.focus();
    await act(async () => closed.resolve()); expect(document.activeElement).toBe(changeFocus ? other : target); other.remove();
  }
});

test("StrictMode 重放挂载仍只保留有效请求；运行时禁用取消已打开菜单与旧动作", async () => {
  const requests = [], changes = []; let closes = 0, actions = 0;
  const config = { menuAdapter: { open: request => { requests.push(request); return { closed: new Promise(() => {}), close: () => closes++ }; } } };
  root = createRoot(document.body.appendChild(document.createElement("div")));
  const render = disabled => root.render(<React.StrictMode><MenuProvider value={config}><ContextMenuHost defaultOpen disabled={disabled}
    trigger={<button>严格模式</button>} items={[{ value: "copy", onSelect: () => actions++ }]} onOpenChange={next => changes.push(next)} /></MenuProvider></React.StrictMode>);
  await act(async () => render(false)); expect(requests).toHaveLength(2);
  expect(requests[0].signal.aborted).toBe(true); expect(requests[1].isCurrent()).toBe(true);
  await act(async () => render(true)); expect(requests[1].signal.aborted).toBe(true); expect(closes).toBe(2);
  await requests[1].select(requests[1].items[0].id); expect(actions).toBe(0); expect(changes).toEqual([false]);
});
