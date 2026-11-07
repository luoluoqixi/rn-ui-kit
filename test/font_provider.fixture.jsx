import { expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
const win = new Window();
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "ShadowRoot"]) globalThis[key] = key === "window" ? win : win[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const RNW = await import("react-native-web");
mock.module("react-native", () => RNW);
const React = await import("react");
const { act } = React;
const { createRoot } = await import("react-dom/client");
const { FontText, FontTextInput, TextFontProvider } = await import("../src/core/components/ui/provider/font_provider");

test("默认字体动态传递到文字和输入框，显式字体与代码保持原样", async () => {
  const host = document.createElement("div"); document.body.append(host);
  const root = createRoot(host);
  const render = family => <TextFontProvider family={family}>
    <FontText nativeID="ordinary" style={{ fontWeight: "700" }}>正文</FontText>
    <FontText nativeID="explicit" style={{ fontFamily: "monospace" }}>代码</FontText>
    <FontText nativeID="code" className="font-mono">代码语义</FontText>
    <FontTextInput nativeID="input" defaultValue="输入" />
  </TextFontProvider>;
  const family = id => win.getComputedStyle(host.querySelector(`#${id}`)).fontFamily;
  try {
    await act(() => root.render(render("Example")));
    expect(family("ordinary")).toContain("Example");
    expect(family("input")).toContain("Example");
    expect(family("explicit")).toContain("monospace");
    expect(family("code")).not.toContain("Example");
    expect(win.getComputedStyle(host.querySelector("#ordinary")).fontWeight).toBe("700");
    const original = host.querySelector("#ordinary");
    await act(() => root.render(render("Changed")));
    expect(host.querySelector("#ordinary")).toBe(original);
    expect(family("ordinary")).toContain("Changed");
    await act(() => root.render(render(undefined)));
    expect(family("ordinary")).not.toContain("Changed");
  } finally { await act(() => root.unmount()); host.remove(); }
});
