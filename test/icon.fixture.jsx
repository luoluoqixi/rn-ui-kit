import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
import * as React from "react";

const win = new Window({ url: "http://localhost/" });
for (const key of ["window", "document", "navigator", "HTMLElement", "Element", "Node"]) {
  globalThis[key] = key === "window" ? win : win[key];
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const TextClassContext = React.createContext(undefined);
mock.module("../src/core/components/ui/text", () => ({ TextClassContext }));
let received;
let mapping;
// Probe the Icon -> Uniwind boundary, without pretending HappyDOM compiles CSS.
// Real utility resolution and live theme updates are checked in the Web build.
mock.module("uniwind", () => ({
  withUniwind: (Component, options) => {
    mapping = options;
    return (props) => {
      received = props;
      return <Component {...props} />;
    };
  },
}));
const { Icon } = await import("../src/core/components/ui/icon");
const { createRoot } = await import("react-dom/client");
const Probe = React.forwardRef(function Probe(
  { className, absoluteStrokeWidth, testID, ...props },
  ref,
) {
  return <svg {...props} ref={ref} />;
});
let root;
async function render(props = {}, context) {
  if (!root) {
    const mount = document.createElement("div");
    document.body.append(mount);
    root = createRoot(mount);
  }
  await React.act(() =>
    root.render(
      <TextClassContext.Provider value={context}>
        <Icon as={Probe} {...props} />
      </TextClassContext.Provider>,
    ),
  );
  return received;
}
afterEach(async () => {
  await React.act(() => root?.unmount());
  root = undefined;
  received = undefined;
  document.body.replaceChildren();
});

test("Icon delegates preset dimensions and semantic foreground to Uniwind", async () => {
  expect(mapping).toEqual({
    size: { fromClassName: "className", styleProperty: "width" },
    color: { fromClassName: "className", styleProperty: "color" },
  });
  expect(await render()).toMatchObject({
    className: "text-foreground size-5",
    size: undefined,
    color: undefined,
  });
  for (const [size, className] of [
    ["sm", "size-4"],
    ["md", "size-5"],
    ["lg", "size-6"],
  ]) {
    const props = await render({ size });
    expect(props.className.split(" ")).toContain(className);
    expect(props.size).toBeUndefined();
  }
  expect((await render({ size: "sm", className: "size-10" })).className).toBe(
    "text-foreground size-10",
  );
  for (const size of [0, 18, 26]) {
    expect(await render({ size, className: "size-10" })).toMatchObject({
      size,
      className: "text-foreground size-10",
    });
  }
});

test("Icon semantic colors stay as theme classes rather than invalid SVG values", async () => {
  for (const color of ["foreground", "muted", "accent", "success", "warning", "danger"]) {
    const props = await render({ color });
    expect(props.className.split(" ")).toContain("text-" + color);
    expect(props.color).toBeUndefined();
  }
  expect(await render({ color: "danger", className: "text-muted" })).toMatchObject({
    className: "size-5 text-muted",
    color: undefined,
  });
  expect(await render({ color: "#8b5cf6", className: "text-muted" })).toMatchObject({
    className: "size-5 text-muted",
    color: "#8b5cf6",
  });
  expect((await render({ color: "currentColor" })).color).toBe("currentColor");
});

test("Icon follows changing container colors and supports explicit overrides", async () => {
  expect((await render({}, "text-accent-foreground")).className).toBe(
    "text-accent-foreground size-5",
  );
  expect((await render({}, "text-warning-foreground")).className).toBe(
    "text-warning-foreground size-5",
  );
  expect((await render({ color: "inherit" }, "text-success")).className).toBe(
    "text-success size-5",
  );
  expect((await render({ color: "foreground" }, "text-success")).className).toBe(
    "size-5 text-foreground",
  );
  expect((await render({ color: "danger" }, "text-success")).className).toBe("size-5 text-danger");
  expect((await render({ className: "text-muted" }, "text-success")).className).toBe(
    "size-5 text-muted",
  );
  expect((await render()).className).toBe("text-foreground size-5");
});

test("Icon preserves Lucide props and the SVG ref", async () => {
  const ref = React.createRef();
  await render({
    size: 18,
    color: "#8b5cf6",
    strokeWidth: 3,
    absoluteStrokeWidth: true,
    ref,
    testID: "icon",
  });
  expect(received).toMatchObject({
    size: 18,
    color: "#8b5cf6",
    strokeWidth: 3,
    absoluteStrokeWidth: true,
    testID: "icon",
  });
  expect(ref.current).toBe(document.querySelector("svg"));
});
