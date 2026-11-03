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
