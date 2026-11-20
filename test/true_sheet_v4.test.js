import { describe, expect, test } from "bun:test";
import { createWebSheetCommandQueue } from "../src/core/components/ui/sheet/native_sheet/sheet_command_queue";
import { isTrueSheetAutoDetent, mergeTrueSheetContentStyle } from "../src/core/components/ui/sheet/native_sheet/true_sheet/detent_layout";
import { getTrueSheetCenteredModalDetentOffsetY, getTrueSheetOverlayToastDetentOffset } from "../src/core/components/ui/sheet/native_sheet/true_sheet/overlay_layout_metrics";

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
function deferred() {
  let finish;
  const promise = new Promise((resolve) => { finish = resolve; });
  return { promise, finish };
}

describe("TrueSheet v4 command promises", () => {
  test("resizes after present resolves, coalesces changes, and never presents an open sheet again", async () => {
    const calls = [];
    const present = deferred();
    const queue = createWebSheetCommandQueue({
      present: async (i) => { calls.push('present:' + i); await present.promise; },
      dismiss: async () => { calls.push('dismiss'); },
      resize: async (i) => { calls.push('resize:' + i); },
    }, false, 0);
    queue.update(true, 0);
    queue.update(true, 1);
    queue.update(true, 2);
    expect(calls).toEqual(['present:0']);
    present.finish();
    await tick();
    expect(calls).toEqual(['present:0', 'resize:2']);
    queue.update(true, 2);
    await tick();
    expect(calls).toHaveLength(2);
    queue.update(false, 2);
    await tick();
    queue.update(true, 1);
    await tick();
    expect(calls).toEqual(['present:0', 'resize:2', 'dismiss', 'present:1']);
  });
  test("waits for initial auto-presentation before dismissing", async () => {
    const calls = [];
    const queue = createWebSheetCommandQueue({
      present: async () => { calls.push('present'); },
      dismiss: async () => { calls.push('dismiss'); },
      resize: async () => { calls.push('resize'); },
    }, true, 0);
    queue.update(false, 0);
    expect(calls).toEqual([]);
    queue.didPresent(0);
    await tick();
    expect(calls).toEqual(['dismiss']);
  });
  test("resumes the same queue after StrictMode effect replay", async () => {
    const calls = [];
    const queue = createWebSheetCommandQueue({
      present: async (i) => { calls.push('present:' + i); },
      dismiss: async () => { calls.push('dismiss'); },
      resize: async (i) => { calls.push('resize:' + i); },
    }, false, 0);
    queue.dispose();
    queue.activate();
    queue.update(true, 1);
    await tick();
    expect(calls).toEqual(['present:1']);
    queue.update(false, 1);
    await tick();
    expect(calls).toEqual(['present:1', 'dismiss']);
  });
  test("initial present and superseded resize events cannot replace the latest position", async () => {
    const calls = [];
    const queue = createWebSheetCommandQueue({
      present: async () => {}, dismiss: async () => {},
      resize: async (i) => { calls.push(i); },
    }, true, 0);
    queue.update(true, 2);
    expect(queue.didPresent(0)).toBe(false);
    await tick();
    expect(calls).toEqual([2]);
    expect(queue.didDetentChange(1)).toBe(false);
    expect(queue.didDetentChange(2)).toBe(true);
    // Once the commanded event arrives, a genuine user drag can select any index.
    expect(queue.didDetentChange(0)).toBe(true);
  });
  test("does not resize or reopen after unmount while animation is pending", async () => {
    const calls = [];
    const pending = deferred();
    const queue = createWebSheetCommandQueue({
      present: async () => { calls.push('present'); await pending.promise; },
      dismiss: async () => { calls.push('dismiss'); },
      resize: async () => { calls.push('resize'); },
    }, false, 0);
    queue.update(true, 0);
    queue.update(true, 2);
    queue.dispose();
    pending.finish();
    await tick();
    expect(calls).toEqual(['present']);
  });
});

describe("TrueSheet v4 layout", () => {
  test("auto and fixed detents select natural and bounded layouts", () => {
    expect(isTrueSheetAutoDetent(['auto', 0.8], 0)).toBe(true);
    expect(isTrueSheetAutoDetent(['auto', 0.8], 1)).toBe(false);
    expect(isTrueSheetAutoDetent([-1], 0)).toBe(true);
    expect(isTrueSheetAutoDetent(['peek'], 0)).toBe(false);
    expect(mergeTrueSheetContentStyle(true, undefined, true)).toEqual([{ flexGrow: 0, flexBasis: "auto", flexShrink: 1 }, undefined]);
    expect(mergeTrueSheetContentStyle(false, undefined, false)).toEqual([{ flex: 1, minHeight: 0 }, undefined]);
  });
  test("partial detents no longer apply v3 full-window Dialog/Toast translations", () => {
    for (const detent of [0.25, 0.5, 0.9, 1]) {
      expect(getTrueSheetCenteredModalDetentOffsetY(500, detent)).toBe(0);
      expect(getTrueSheetOverlayToastDetentOffset(500, detent)).toBe(0);
    }
  });
});
