import { expect, test } from "bun:test";
import { startMenuAdapterSession } from "../src/core/components/ui/menu/menu_adapter_session";
import { createNativeMenuItems } from "../src/core/components/ui/context_menu/native_menu_items";

const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const settle = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
function harness(adapter, overrides = {}) {
  const events = [], requests = [], errors = []; let selections = 0;
  const args = {
    scope: {}, owner: {},
    request: { kind: "context-menu", source: "pointer", anchor: { rect: { x: 0, y: 0, width: 30, height: 40 } },
      x: 20, y: 30, placement: { side: "bottom", align: "start", sideOffset: 0 } },
    adapter: { open: request => { requests.push(request); return adapter.open(request); } },
    createItems: isCurrent => createNativeMenuItems([{ value: "copy", onSelect: () => selections++ },
      { value: "disabled", disabled: true, onSelect: () => selections++ }], undefined, false, { isCurrent }),
    onRelease: () => events.push("release"), onError: error => errors.push(error), restoreFocus: () => events.push("focus"),
    ...overrides,
  };
  return { args, events, errors, requests, selections: () => selections, start: () => startMenuAdapterSession(args) };
}

test("显示完成与关闭分离；ID 和回调均可派发，关闭后拒绝旧动作且资源只释放一次", async () => {
  const closed = deferred(); const events = [];
  const h = harness({ open: () => ({ closed: closed.promise, close: () => events.push("close"), dispose: () => events.push("dispose") }) });
  const control = h.start(); await settle(); const request = h.requests[0];
  expect(h.events).toEqual([]); expect(request.isCurrent()).toBe(true);
  await request.select(request.items[0].id); await request.items[0].onSelect();
  await request.select(request.items[1].id); await request.select("nonexistent"); expect(h.selections()).toBe(2);
  closed.resolve(); await settle();
  expect(h.events).toEqual(["release", "focus"]); expect(events).toEqual(["dispose"]);
  expect(request.signal.aborted).toBe(true);
  await request.select(request.items[0].id); await request.items[0].onSelect();
  control.cancel(); await settle(); expect(h.selections()).toBe(2); expect(events).toEqual(["dispose"]);
});

test("无关闭通知的宿主释放打开反馈，仍可异步返回选择，直到替换或卸载才释放资源", async () => {
  const cleanup = []; const h = harness({ open: () => ({ dispose: () => cleanup.push("dispose") }) });
  const control = h.start(); await settle(); const request = h.requests[0];
  expect(h.events).toEqual(["release"]); expect(control.feedbackReleased).toBe(true); expect(request.isCurrent()).toBe(true);
  await request.select(request.items[0].id); expect(h.selections()).toBe(1); expect(cleanup).toEqual([]);
  control.cancel(); await settle(); expect(request.isCurrent()).toBe(false); expect(cleanup).toEqual(["dispose"]);
  expect(h.events).toEqual(["release"]);
});

test("替换请求跨组件取消旧菜单，同组件替换不产生旧的关闭通知，不影响独立窗口", async () => {
  const scope = {}; const a = harness({ open: () => ({ closed: new Promise(() => {}) }) }, { scope });
  a.start(); await settle(); a.start(); await settle();
  expect(a.requests[0].isCurrent()).toBe(false); expect(a.events).toEqual([]);
  const independent = harness({ open: () => ({ closed: new Promise(() => {}) }) });
  const other = independent.start(); await settle();
  const b = harness({ open: () => ({ closed: new Promise(() => {}) }) }, { scope });
  const current = b.start(); await settle();
  expect(a.events).toEqual(["release"]); expect(a.requests[1].signal.aborted).toBe(true);
  expect(independent.requests[0].isCurrent()).toBe(true);
  current.cancel(); other.cancel(); await settle();
});

test("取消早于 open 完成时仍会清理迟到资源，关闭拒绝或迟到错误不会污染新请求", async () => {
  const opening = deferred(), closed = deferred(), events = [];
  const h = harness({ open: () => opening.promise }); const control = h.start(); control.cancel(false);
  opening.resolve({ closed: closed.promise, close: async () => { events.push("close"); throw new Error("late close"); }, dispose: () => events.push("dispose") });
  await settle(); closed.reject(new Error("late closed")); await settle();
  expect(events).toEqual(["close", "dispose"]); expect(h.events).toEqual([]); expect(h.errors).toEqual([]);
  const rejected = deferred(); const old = harness({ open: () => rejected.promise });
  const oldControl = old.start(); oldControl.cancel(false); rejected.reject(new Error("late open")); await settle(); expect(old.errors).toEqual([]);
});

test("当前 open/closed 错误仅报告一次并复位，失败关闭仍执行 dispose", async () => {
  const failed = new Error("cannot open"); const h = harness({ open: () => { throw failed; } }); h.start(); await settle();
  expect(h.errors).toEqual([failed]); expect(h.events).toEqual(["release"]);
  const closed = deferred(); const events = [];
  const b = harness({ open: () => ({ closed: closed.promise, close: () => { events.push("close"); throw failed; }, dispose: () => events.push("dispose") }) });
  b.start(); await settle(); closed.reject(failed); await settle();
  expect(b.errors).toEqual([failed]); expect(b.events).toEqual(["release"]); expect(events).toEqual(["close", "dispose"]);
});
