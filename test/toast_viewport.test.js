import { afterEach, expect, test } from "bun:test";
import { resolveToastViewportOptions } from "../src/core/components/ui/toast/toast_basic_shared";
import {
  getAndroidToastPortalHost,
  registerAndroidToastPortalHost,
} from "../src/core/components/ui/toast/android_toast_portal_host";

const cleanups = [];
function openWindow(host, parent = null) {
  const close = registerAndroidToastPortalHost(host, parent);
  cleanups.push(close);
  return close;
}
afterEach(() => {
  cleanups.splice(0).reverse().forEach((close) => close());
});

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

test("Android 页面层创建的回调在调用时跟随 Dialog、子 Sheet 和子 Dialog", () => {
  // The callback is created before any modal is visible, like DialogExample.
  const showFromPage = () =>
    resolveToastViewportOptions(undefined, undefined, false, getAndroidToastPortalHost());
  expect(showFromPage()).toBeUndefined();
  const closeDialog = openWindow("dialog");
  expect(showFromPage()).toEqual({ toasterId: "dialog" });
  const closeSheet = openWindow("sheet", "dialog");
  expect(showFromPage()).toEqual({ toasterId: "sheet" });
  const closeInner = openWindow("inner-dialog", "sheet");
  expect(showFromPage()).toEqual({ toasterId: "inner-dialog" });
  closeInner();
  expect(showFromPage()).toEqual({ toasterId: "sheet" });
  closeSheet();
  expect(showFromPage()).toEqual({ toasterId: "dialog" });
  closeDialog();
  expect(showFromPage()).toBeUndefined();
});

test("Android 覆盖回调捕获的下层 host，保留显式目标及 Toast 选项", () => {
  openWindow("dialog");
  expect(
    resolveToastViewportOptions(
      { duration: 8000, native: false },
      "sheet",
      false,
      getAndroidToastPortalHost(),
    ),
  ).toEqual({ duration: 8000, native: false, toasterId: "dialog" });
  for (const options of [{ toasterId: "custom" }, { viewportName: "custom" }]) {
    expect(
      resolveToastViewportOptions(options, "sheet", false, getAndroidToastPortalHost()),
    ).toBe(options);
  }
  // Web continues to use its own global portal even if an Android host is supplied.
  expect(resolveToastViewportOptions(undefined, "sheet", true, "dialog")).toBeUndefined();
});

test("嵌套窗口同时挂载时，父 effect 后执行也不会盖过子窗口", () => {
  openWindow("inner-dialog", "sheet");
  openWindow("sheet", "dialog");
  openWindow("dialog");
  expect(getAndroidToastPortalHost()).toBe("inner-dialog");
  const closeSibling = openWindow("sibling-dialog");
  expect(getAndroidToastPortalHost()).toBe("sibling-dialog");
  closeSibling();
  expect(getAndroidToastPortalHost()).toBe("inner-dialog");
});

test("窗口非顺序卸载、重复清理和再次打开后，路由不残留", () => {
  const closeDialog = openWindow("dialog");
  const closeSheet = openWindow("sheet", "dialog");
  closeDialog();
  closeDialog();
  expect(getAndroidToastPortalHost()).toBe("sheet");
  closeSheet();
  expect(getAndroidToastPortalHost()).toBeUndefined();
  const closeReopened = openWindow("dialog");
  closeDialog();
  expect(getAndroidToastPortalHost()).toBe("dialog");
  closeReopened();
  expect(getAndroidToastPortalHost()).toBeUndefined();
});
