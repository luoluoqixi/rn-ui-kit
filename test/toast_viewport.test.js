import { expect, test } from "bun:test";
import { resolveToastViewportOptions } from "../src/core/components/ui/toast/toast_basic_shared";

test("Web 的未指定通知不锁定在下层 Sheet，显式命名通知仍保留目标", () => {
  expect(resolveToastViewportOptions(undefined, "sheet", true)).toBeUndefined();
  expect(
    resolveToastViewportOptions({ duration: 8000 }, "sheet", true),
  ).toEqual({ duration: 8000 });
  expect(
    resolveToastViewportOptions({ toasterId: "custom" }, "sheet", true),
  ).toEqual({ toasterId: "custom" });
});
test("Native 的通知仍路由当前窗口，显式目标优先", () => {
  expect(resolveToastViewportOptions(undefined, "sheet", false)).toEqual({
    toasterId: "sheet",
  });
  expect(
    resolveToastViewportOptions({ duration: 8000 }, "sheet", false),
  ).toEqual({ duration: 8000, toasterId: "sheet" });
  expect(
    resolveToastViewportOptions({ viewportName: "custom" }, "sheet", false),
  ).toEqual({ viewportName: "custom" });
  expect(
    resolveToastViewportOptions(undefined, undefined, false),
  ).toBeUndefined();
});
