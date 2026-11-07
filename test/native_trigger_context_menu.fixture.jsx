import { expect, mock, test } from "bun:test";
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
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const RNW = await import("react-native-web");
mock.module("react-native", () => RNW);
mock.module("lucide-react-native", () => ({
  ChevronDown: () => null,
  ChevronUp: () => null,
  ChevronsUpDown: () => null,
}));
mock.module("../src/core/components/ui/text", () => ({ Text: RNW.Text }));
mock.module("../src/core/components/ui/utils/theme", () => ({
  useUiTheme: () => ({ foreground: "black" }),
}));
const React = await import("react");
const { act } = React;
const { createRoot } = await import("react-dom/client");
const { NativeTrigger } =
  await import("../src/core/components/ui/native_trigger/native_trigger");

test("NativeTrigger 禁用浏览器默认右键菜单，保留自身处理并隔离行级菜单", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  let outer = 0;
  let own = 0;
  let presses = 0;
  await act(() =>
    root.render(
      <div onContextMenu={() => outer++}>
        <NativeTrigger
          nativeID="trigger"
          label="排序"
          onContextMenu={() => own++}
          onPress={() => presses++}
        />
      </div>,
    ),
  );
  const button = host.querySelector("#trigger");
  const event = new win.MouseEvent("contextmenu", {
    bubbles: true,
    cancelable: true,
  });
  await act(() => button.dispatchEvent(event));
  expect(event.defaultPrevented).toBe(true);
  expect(own).toBe(1);
  expect(outer).toBe(0);
  await act(() =>
    button.dispatchEvent(new win.MouseEvent("click", { bubbles: true })),
  );
  expect(presses).toBe(1);
  await act(() => root.unmount());
  host.remove();
});
