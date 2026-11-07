import { afterEach, expect, mock, test } from "bun:test";
import { plugin } from "bun";
import { Window } from "happy-dom";

const win = new Window();
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "CustomEvent", "MouseEvent", "PointerEvent", "ShadowRoot"]) {
  globalThis[key] = key === "window" ? win : win[key];
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
plugin({
  name: "tooltip-web-test",
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
const Primitive = await import("../node_modules/@rn-primitives/tooltip/dist/tooltip.web.mjs");
mock.module("@rn-primitives/tooltip", () => Primitive);
const { TooltipRoot, TooltipTrigger } = await import("../src/core/components/ui/tooltip/tooltip_trigger");
let root;

afterEach(async () => {
  await act(() => root?.unmount());
  document.body.replaceChildren();
});

async function mount(props = {}) {
  const container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root.render(
    <TooltipRoot delayDuration={30} {...props}>
      <TooltipTrigger><RNW.Text>测试</RNW.Text></TooltipTrigger>
    </TooltipRoot>,
  ));
  return container.querySelector('[role="button"]');
}
async function pointer(node, type, options = {}) {
  await act(() => node.dispatchEvent(new win.PointerEvent(type, {
    pointerType: "mouse", bubbles: true, cancelable: true, ...options,
  })));
}
async function delay() {
  await act(() => new Promise(resolve => setTimeout(resolve, 60)));
}

test("hover 延迟结束前点击，保持静止或在按钮内移动均不重新打开，重新进入才恢复", async () => {
  const opened = [];
  const node = await mount({ onOpenChange: open => opened.push(open) });
  await pointer(node, "pointermove");
  await pointer(node, "pointerdown");
  await pointer(node, "pointerup");
  await act(() => node.click());
  await delay();
  expect(node.dataset.state).toBe("closed");
  expect(opened).not.toContain(true);
  await pointer(node, "pointermove");
  await delay();
  expect(node.dataset.state).toBe("closed");
  await pointer(node, "pointerout", { relatedTarget: document.body });
  await pointer(node, "pointermove");
  await delay();
  expect(node.dataset.state).toBe("open");
});

test("右键取消待显示提示；再次聚焦不会绕过点击抑制", async () => {
  const node = await mount();
  await pointer(node, "pointermove");
  await pointer(node, "pointerdown", { button: 2 });
  await pointer(node, "pointerup", { button: 2 });
  await act(() => node.focus());
  await delay();
  expect(node.dataset.state).toBe("closed");
});

test("openOnFocus=false 禁用聚焦触发但保留 hover", async () => {
  const node = await mount({ openOnFocus: false });
  await act(() => node.focus());
  expect(node.dataset.state).toBe("closed");
  await pointer(node, "pointermove");
  await delay();
  expect(node.dataset.state).toBe("open");
});

test("默认保留键盘聚焦打开，openOnPress 仍能点击打开", async () => {
  const node = await mount();
  await act(() => node.focus());
  expect(node.dataset.state).toBe("open");
  await act(() => root.unmount());
  root = undefined;
  const pressNode = await mount({ openOnPress: true });
  await pointer(pressNode, "pointerdown");
  await pointer(pressNode, "pointerup");
  await act(() => pressNode.click());
  expect(pressNode.dataset.state).toBe("open");
});

test("标题栏停止冒泡且原生拖拽未发送 leave 时，也取消延迟 hover", async () => {
  const opened = [];
  const node = await mount({ openOnFocus: false, onOpenChange: open => opened.push(open) });
  const titlebar = document.createElement("div");
  titlebar.addEventListener("pointerdown", event => event.stopPropagation());
  document.body.append(titlebar);
  await pointer(node, "pointermove");
  // 模拟原生窗口拖拽：不向之前的触发器发送 pointerout/leave，也没有后续 click。
  await pointer(titlebar, "pointerdown", { buttons: 1 });
  await delay();
  expect(node.dataset.state).toBe("closed");
  expect(opened).not.toContain(true);
});

test("标题栏开始原生拖拽时，已打开的 hover 提示立即关闭", async () => {
  const node = await mount({ openOnFocus: false });
  const titlebar = document.createElement("div");
  titlebar.addEventListener("pointerdown", event => event.stopPropagation());
  document.body.append(titlebar);
  await pointer(node, "pointermove");
  await delay();
  expect(node.dataset.state).toBe("open");
  await pointer(titlebar, "pointerdown", { buttons: 1 });
  expect(node.dataset.state).toBe("closed");
});

test("按住鼠标拖动经过触发器不应启动 hover", async () => {
  const node = await mount({ openOnFocus: false });
  await pointer(node, "pointermove", { buttons: 1 });
  await delay();
  expect(node.dataset.state).toBe("closed");
});

test("窗口失焦时取消待显示的 hover", async () => {
  const node = await mount({ openOnFocus: false });
  await pointer(node, "pointermove");
  await act(() => win.dispatchEvent(new win.Event("blur")));
  await delay();
  expect(node.dataset.state).toBe("closed");
});

test("标题栏取消后重新 hover 可恢复，并保留标题栏 mousedown 冒泡", async () => {
  const node = await mount({ openOnFocus: false });
  const titlebar = document.createElement("div");
  titlebar.addEventListener("pointerdown", event => event.stopPropagation());
  document.body.append(titlebar);
  let mouseDownCount = 0;
  const onMouseDown = () => mouseDownCount++;
  document.addEventListener("mousedown", onMouseDown);
  try {
    await pointer(node, "pointermove");
    await pointer(titlebar, "pointerdown", { buttons: 1 });
    const mouseDown = new win.MouseEvent("mousedown", { bubbles: true, cancelable: true });
    await act(() => titlebar.dispatchEvent(mouseDown));
    expect(mouseDown.defaultPrevented).toBe(false);
    expect(mouseDownCount).toBe(1);
    await pointer(node, "pointermove");
    await delay();
    expect(node.dataset.state).toBe("closed");
    await pointer(node, "pointerout", { relatedTarget: document.body });
    await pointer(node, "pointermove");
    await delay();
    expect(node.dataset.state).toBe("open");
  } finally {
    document.removeEventListener("mousedown", onMouseDown);
  }
});

test("hover 离开和卸载后移除全局 dismiss 监听", async () => {
  let changes = 0;
  const node = await mount({ onOpenChange: () => changes++ });
  await pointer(node, "pointermove");
  await pointer(node, "pointerout", { relatedTarget: document.body });
  const afterLeave = changes;
  await pointer(document.body, "pointerdown");
  expect(changes).toBe(afterLeave);
  await pointer(node, "pointermove");
  await act(() => root.unmount());
  root = undefined;
  const afterUnmount = changes;
  await pointer(document.body, "pointerdown");
  await act(() => win.dispatchEvent(new win.Event("blur")));
  await delay();
  expect(changes).toBe(afterUnmount);
});

test("已打开且允许 hover 内容时，离开触发器后仍可由标题栏按下关闭", async () => {
  const node = await mount({ openOnFocus: false });
  await pointer(node, "pointermove");
  await delay();
  await pointer(node, "pointerout", { relatedTarget: document.body });
  // 默认允许移到提示内容，离开触发器不一定立即关闭；此时仍需捕获外部按下。
  await pointer(document.body, "pointerdown", { buttons: 1 });
  expect(node.dataset.state).toBe("closed");
});

test("asChild Pressable 在 hover 正常结束后恢复非 cancelable 焦点，不重新打开", async () => {
  const opened = [];
  const container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root.render(
    <TooltipRoot openOnFocus={false} delayDuration={30} disableHoverableContent onOpenChange={open => opened.push(open)}>
      <TooltipTrigger asChild><RNW.Pressable><RNW.Text>侧边按钮</RNW.Text></RNW.Pressable></TooltipTrigger>
    </TooltipRoot>,
  ));
  const node = container.querySelector('[role="button"]');
  await pointer(node, "pointermove");
  await pointer(node, "pointerdown");
  await pointer(node, "pointerup");
  await act(() => node.click());
  await act(() => node.focus());
  await pointer(node, "pointerout", { relatedTarget: document.body });
  await delay();
  expect(node.dataset.state).toBe("closed");
  opened.length = 0;
  await act(() => {
    win.dispatchEvent(new win.Event("blur"));
    win.dispatchEvent(new win.Event("resize"));
    win.dispatchEvent(new win.Event("focus"));
    node.dispatchEvent(new win.FocusEvent("focusin", { bubbles: true, cancelable: false }));
  });
  await delay();
  expect(node.dataset.state).toBe("closed");
  expect(opened).not.toContain(true);
});
