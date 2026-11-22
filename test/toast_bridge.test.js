import { expect, test } from "bun:test";
import { ToastCommandBridge, toastDuration } from "../src/core/components/ui/toast/toast_bridge";
function port(platform = "web") {
  const shown = [], updated = [], closed = [];
  return { shown, updated, closed, platform,
    show(record, done) { shown.push({ record, done }); return record.token; },
    update(handle, record) { updated.push({ handle, record }); },
    close(handle) { closed.push(handle); },
  };
}
const payload = (options = {}, title = "提示") => ({ options, title, kind: "info" });

test("Toast commands wait for their own viewport; same ID updates and preserves handle", () => {
  const bridge = new ToastCommandBridge(), global = port(), sheet = port();
  bridge.register(undefined, global);
  expect(bridge.show(payload({ id: 3, viewportName: "sheet" }))).toBe(3);
  expect(global.shown).toHaveLength(0);
  const unregister = bridge.register("sheet", sheet);
  const token = bridge.get(3).token;
  bridge.show(payload({ id: 3, toasterId: "sheet" }, "更新"));
  expect(sheet.shown).toHaveLength(1);
  expect(sheet.updated[0].handle).toBe(token);
  expect(sheet.updated[0].record.payload.title).toBe("更新");
  bridge.close(3);
  expect(bridge.get(3)).toBeUndefined();
  expect(sheet.closed).toEqual([token]);
  unregister();
});

test("Toast lifecycle fires the matching callback exactly once and ignores stale exit callbacks", () => {
  const bridge = new ToastCommandBridge(), p = port();
  bridge.register(undefined, p);
  const calls = [];
  bridge.show(payload({ id: "same", sonnerOptions: { onDismiss: t => calls.push(["dismiss", t.id]), onAutoClose: t => calls.push(["auto", t.id]) } }));
  const first = p.shown[0];
  bridge.close("same");
  first.done("auto");
  expect(calls).toEqual([["dismiss", "same"]]);
  bridge.show(payload({ id: "same", sonnerOptions: { onAutoClose: t => calls.push(["auto", t.id]) } }));
  first.done("dismiss");
  expect(bridge.get("same")).toBeTruthy();
  p.shown[1].done("auto");
  expect(bridge.get("same")).toBeUndefined();
  expect(calls).toEqual([["dismiss", "same"], ["auto", "same"]]);
});

test("Native toast callbacks use caller numeric IDs and latest payload; unmount closes only its viewport", () => {
  const bridge = new ToastCommandBridge(), p = port("native"), other = port("native"), calls = [];
  const unregister = bridge.register(undefined, p);
  bridge.register("other", other);
  bridge.show(payload({ id: 12, sonnerNativeOptions: { onDismiss: () => calls.push("old") } }));
  bridge.show(payload({ id: 12, sonnerNativeOptions: { onDismiss: id => calls.push(id) }, sonnerOptions: { onDismiss: () => calls.push("wrong platform") } }));
  p.shown[0].done(); p.shown[0].done();
  expect(calls).toEqual([12]);
  bridge.show(payload({ id: 13, sonnerNativeOptions: { onDismiss: () => calls.push("unmounted") } }));
  bridge.show(payload({ id: 14, viewportName: "other" }));
  unregister();
  expect(bridge.get(13)).toBeUndefined(); expect(bridge.get(14)).toBeTruthy();
  expect(calls).toEqual([12]);
  bridge.closeAll(); expect(bridge.get(14)).toBeUndefined();
});

test("Toast duration uses the active platform only, supports zero/Infinity, and loading stays persistent", () => {
  const record = { payload: { kind: "info", options: { sonnerOptions: { duration: 100 }, sonnerNativeOptions: { duration: 200 } } } };
  expect(toastDuration(record, 500)).toBe(100);
  expect(toastDuration(record, 500, "native")).toBe(200);
  record.payload.options.duration = 0; expect(toastDuration(record)).toBe(0);
  record.payload.options.duration = Infinity; expect(toastDuration(record)).toBe(Infinity);
  record.payload = { kind: "loading", options: {} }; expect(toastDuration(record)).toBe(Infinity);
});
