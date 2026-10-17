import { describe, expect, test } from "bun:test";

import { createBasicNavigationSelection } from "../src/core/components/ui/native_list/basic_navigation_selection";

function setup(withNavigation = true) {
  let focused = true;
  const listeners = { blur: new Set(), focus: new Set() };
  const changes = [];
  const navigation = {
    addListener(event, listener) {
      listeners[event].add(listener);
      return () => listeners[event].delete(listener);
    },
    isFocused: () => focused,
  };
  const selection = createBasicNavigationSelection(
    withNavigation ? navigation : undefined,
    (selected) => changes.push(selected),
  );
  return {
    ...selection,
    changes,
    listeners,
    emit(event, isFocused = event === "focus") {
      focused = isFocused;
      [...listeners[event]].forEach((listener) => listener());
    },
  };
}

describe("basic navigation selection", () => {
  test("导航离开后持续选中，成功返回才清除并解除监听", async () => {
    const row = setup();
    row.select();
    row.emit("blur");
    await Bun.sleep(330);
    expect(row.changes).toEqual([true]);
    row.emit("focus");
    expect(row.changes).toEqual([true]);
    await Bun.sleep(330);
    expect(row.changes).toEqual([true, false]);
    expect(row.listeners.blur.size).toBe(0);
    expect(row.listeners.focus.size).toBe(0);
  });

  test("返回被取消、页面未恢复焦点时继续保留颜色", () => {
    const row = setup();
    row.select({ basicNavigationSelectionReturnClearDelay: 0 });
    row.emit("blur");
    row.emit("focus", false);
    expect(row.changes).toEqual([true]);
    row.emit("focus", true);
    expect(row.changes).toEqual([true, false]);
  });

  test("无导航和未在 NavigationContainer 中的点击都会自动清除", async () => {
    const rows = [setup(), setup(false)];
    rows.forEach((row) => row.select());
    await Bun.sleep(330);
    rows.forEach((row) => {
      expect(row.changes).toEqual([true, false]);
      row.clear();
    });
  });

  test("confirm 允许慢速异步导航，cancel 可立即清除", async () => {
    const row = setup();
    const controls = row.select();
    controls.confirm();
    await Bun.sleep(330);
    expect(row.changes).toEqual([true]);
    controls.cancel();
    expect(row.changes).toEqual([true, false]);
  });

  test("旧异步回调不能取消或确认新点击的选中态", async () => {
    const row = setup();
    const oldControls = row.select();
    row.select();
    oldControls.cancel();
    expect(row.changes.at(-1)).toBe(true);
    oldControls.confirm();
    await Bun.sleep(330);
    expect(row.changes.at(-1)).toBe(false);
  });

  test("卸载、禁用或切换编辑模式时清理监听和选中态", () => {
    const row = setup();
    const controls = row.select();
    row.emit("blur");
    row.clear();
    controls.confirm();
    controls.cancel();
    row.emit("focus");
    row.clear();
    expect(row.changes).toEqual([true, false]);
    expect(row.listeners.blur.size).toBe(0);
    expect(row.listeners.focus.size).toBe(0);
  });

  test("导航前重复 focus 不会误判成返回", () => {
    const row = setup();
    const controls = row.select();
    row.emit("focus");
    expect(row.changes).toEqual([true]);
    controls.cancel();
  });

  test("未导航自动清除时间可分别调短或调长", async () => {
    const short = setup();
    const long = setup();
    short.select({ basicNavigationSelectionAutoClearDelay: 30 });
    long.select({ basicNavigationSelectionAutoClearDelay: 450 });
    await Bun.sleep(80);
    expect(short.changes).toEqual([true, false]);
    expect(long.changes).toEqual([true]);
    await Bun.sleep(250);
    expect(long.changes).toEqual([true]);
    await Bun.sleep(150);
    expect(long.changes).toEqual([true, false]);
  });

  test("返回延迟独立配置，confirm 不会取消返回后的清除", async () => {
    const row = setup();
    const controls = row.select({
      basicNavigationSelectionAutoClearDelay: 500,
      basicNavigationSelectionReturnClearDelay: 80,
    });
    row.emit("blur");
    row.emit("focus");
    controls.confirm();
    await Bun.sleep(30);
    expect(row.changes).toEqual([true]);
    await Bun.sleep(80);
    expect(row.changes).toEqual([true, false]);
  });

  test("返回延迟期间重新离开会取消清除，下次返回重新计时", async () => {
    const row = setup();
    row.select({ basicNavigationSelectionReturnClearDelay: 60 });
    row.emit("blur");
    row.emit("focus");
    row.emit("blur");
    await Bun.sleep(90);
    expect(row.changes).toEqual([true]);
    row.emit("focus");
    expect(row.changes).toEqual([true]);
    await Bun.sleep(90);
    expect(row.changes).toEqual([true, false]);
  });

  test("旧返回定时器不会清除新的点击", async () => {
    const row = setup();
    row.select({ basicNavigationSelectionReturnClearDelay: 50 });
    row.emit("blur");
    row.emit("focus");
    const next = row.select();
    next.confirm();
    await Bun.sleep(90);
    expect(row.changes).toEqual([true, false, true]);
    next.cancel();
  });

  test("返回延迟期间 cancel 和清理仍立即生效", async () => {
    const rows = [setup(), setup()];
    const controls = rows.map((row) => {
      const controls = row.select({ basicNavigationSelectionReturnClearDelay: 50 });
      row.emit("blur");
      row.emit("focus");
      return controls;
    });
    controls[0].cancel();
    rows[1].clear();
    await Bun.sleep(90);
    rows.forEach((row) => {
      expect(row.changes).toEqual([true, false]);
      expect(row.listeners.blur.size).toBe(0);
      expect(row.listeners.focus.size).toBe(0);
    });
  });
});
