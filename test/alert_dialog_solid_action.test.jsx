import { afterEach, expect, mock, test } from "bun:test";
import { plugin } from "bun";
import { Window } from "happy-dom";

const win = new Window();
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "PointerEvent", "ShadowRoot"]) {
  globalThis[key] = key === "window" ? win : win[key];
}
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// 运行真实 Web primitive 和 RNW，按上游 .mjs 的实际 JSX 语法加载。
plugin({
  name: "alert-dialog-web-test",
  setup(build) {
    build.onLoad({ filter: /@rn-primitives[\\/].*\.mjs$/ }, async ({ path }) => ({
      contents: await Bun.file(path).text(), loader: "jsx",
    }));
  },
});
const RNW = await import("react-native-web");
mock.module("react-native", () => RNW);
const React = await import("react");
const { act } = React;
const { createRoot } = await import("react-dom/client");
// Bun 默认加载 Native primitive，必须显式加载 Web 文件，覆盖真实的 Radix Slot 合成路径。
const Primitive = await import("../node_modules/@rn-primitives/alert-dialog/dist/alert-dialog.web.mjs");
mock.module("@rn-primitives/alert-dialog", () => Primitive);
const { AlertDialogSolidAction } = await import("../src/core/components/ui/alert_dialog/alert_dialog_solid_action");
let root;
afterEach(async () => {
  await act(() => root?.unmount());
  document.body.replaceChildren();
});

test("asChild 保留子 Pressable 的事件、style 和关闭行为", async () => {
  let pressed = 0, closed = 0;
  const mount = document.createElement("div");
  document.body.append(mount);
  root = createRoot(mount);
  await act(() => root.render(
    <Primitive.Root open onOpenChange={() => closed++}>
      <AlertDialogSolidAction asChild variant="default" colors={{ primary: "#2563eb", destructive: "#ba1a1a" }}>
        <RNW.Pressable onPress={() => pressed++} style={{ borderWidth: 2 }}>
          <RNW.Text>确认</RNW.Text>
        </RNW.Pressable>
      </AlertDialogSolidAction>
    </Primitive.Root>,
  ));
  const node = document.querySelector('[role="button"]');
  await act(() => node.dispatchEvent(new win.PointerEvent("pointerenter", { pointerType: "mouse" })));
  expect(node.style.backgroundColor).toBe("rgba(50, 108, 236, 1.00)");
  expect(getComputedStyle(node).borderTopWidth).toBe("2px");
  await act(() => node.dispatchEvent(new win.MouseEvent("click", { bubbles: true })));
  expect(pressed).toBe(1);
  expect(closed).toBeGreaterThan(0);
});

for (const [variant, hoverColor, pressedColor] of [
  ["default", "rgba(50, 108, 236, 1.00)", "rgba(63, 118, 237, 1.00)"],
  ["destructive", "rgba(190, 40, 40, 1.00)", "rgba(194, 53, 53, 1.00)"],
]) {
  test(`AlertDialog ${variant} 按钮 hover、按下和关闭语义同时生效`, async () => {
    let hoverCalls = 0, pressCalls = 0, closed = 0;
    const mount = document.createElement("div");
    document.body.append(mount);
    root = createRoot(mount);
    await act(() => root.render(
      <Primitive.Root open onOpenChange={(open) => { if (!open) closed++; }}>
        <AlertDialogSolidAction
          variant={variant}
          colors={{ primary: "#2563eb", destructive: "#ba1a1a" }}
          onHoverIn={() => hoverCalls++}
          onPress={() => pressCalls++}
        ><RNW.Text>执行</RNW.Text></AlertDialogSolidAction>
      </Primitive.Root>,
    ));
    const node = document.querySelector('[role="button"]');
    expect(node).not.toBeNull();
    await act(() => node.dispatchEvent(new win.PointerEvent("pointerenter", { pointerType: "mouse" })));
    expect(node.style.backgroundColor).toBe(hoverColor);
    expect(hoverCalls).toBe(1);
    // 键盘按下不依赖鼠标 :active，按下色必须覆盖 hover。
    await act(() => node.dispatchEvent(new win.KeyboardEvent("keydown", { key: " ", bubbles: true })));
    expect(node.style.backgroundColor).toBe(pressedColor);
    await act(() => node.dispatchEvent(new win.KeyboardEvent("keyup", { key: " ", bubbles: true })));
    expect(node.style.backgroundColor).toBe(hoverColor);
    // DOM 测试环境不会自动生成原生 button 的键盘 click。
    await act(() => node.dispatchEvent(new win.MouseEvent("click", { bubbles: true })));
    expect(pressCalls).toBe(1);
    expect(closed).toBe(1);
  });
}

test("禁用按钮不产生交互色或关闭弹窗", async () => {
  let closed = 0;
  const mount = document.createElement("div");
  document.body.append(mount);
  root = createRoot(mount);
  await act(() => root.render(
    <Primitive.Root open onOpenChange={() => closed++}>
      <AlertDialogSolidAction disabled variant="destructive" colors={{ primary: "#2563eb", destructive: "#ba1a1a" }}>
        <RNW.Text>删除</RNW.Text>
      </AlertDialogSolidAction>
    </Primitive.Root>,
  ));
  const node = document.querySelector('[role="button"]');
  await act(() => {
    node.dispatchEvent(new win.PointerEvent("pointerenter", { pointerType: "mouse" }));
    node.dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
  });
  expect(node.style.backgroundColor).toBe("");
  expect(closed).toBe(0);
});

test("自定义 style 保持优先级，hover 离开回调仍执行，ref 仍指向按钮", async () => {
  let hoverOut = 0;
  const ref = React.createRef();
  const mount = document.createElement("div");
  document.body.append(mount);
  root = createRoot(mount);
  await act(() => root.render(
    <Primitive.Root open>
      <AlertDialogSolidAction ref={ref} variant="default" colors={{ primary: "#2563eb", destructive: "#ba1a1a" }}
        onHoverOut={() => hoverOut++} style={({ pressed }) => ({ backgroundColor: pressed ? "black" : "white" })}>
        <RNW.Text>确认</RNW.Text>
      </AlertDialogSolidAction>
    </Primitive.Root>,
  ));
  const node = document.querySelector('[role="button"]');
  expect(ref.current).toBe(node);
  await act(() => node.dispatchEvent(new win.PointerEvent("pointerenter", { pointerType: "mouse" })));
  expect(node.style.backgroundColor).toBe("rgba(255, 255, 255, 1.00)");
  await act(() => node.dispatchEvent(new win.KeyboardEvent("keydown", { key: " ", bubbles: true })));
  expect(node.style.backgroundColor).toBe("rgba(0, 0, 0, 1.00)");
  await act(() => node.dispatchEvent(new win.PointerEvent("pointerleave", { pointerType: "mouse" })));
  expect(hoverOut).toBe(1);
});





