import { afterEach, expect, test } from "bun:test";
import { Window } from "happy-dom";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import {
  OverlayPortalScope,
  useOverlayPortalContainer,
} from "../src/core/components/ui/utils/overlay/overlay_portal_scope.web";

import { SheetContentScope } from "../src/core/components/ui/sheet/native_sheet/true_sheet/sheet_content_scope.web";

const dom = new Window();
Object.assign(globalThis, {
  window: dom,
  document: dom.document,
  HTMLElement: dom.HTMLElement,
  IS_REACT_ACT_ENVIRONMENT: true,
});
const roots = [];
afterEach(async () => {
  await act(() => roots.splice(0).forEach((root) => root.unmount()));
  document.body.replaceChildren();
});

function Popup({ label }) {
  const container = useOverlayPortalContainer();
  return createPortal(<button>{label}</button>, container ?? document.body);
}

test("嵌套弹层挂到最近的容器，卸载时不在 body 遗留节点", async () => {
  const mount = document.createElement("div");
  document.body.append(mount);
  const root = createRoot(mount);
  roots.push(root);
  await act(() =>
    root.render(
      <section id="dialog">
        <OverlayPortalScope>
          <Popup label="外层选项" />
          <section id="sheet">
            <OverlayPortalScope>
              <Popup label="内层选项" />
            </OverlayPortalScope>
          </section>
        </OverlayPortalScope>
      </section>,
    ),
  );
  const buttons = [...document.querySelectorAll("button")];
  expect(buttons.find((node) => node.textContent === "外层选项")?.closest("section")?.id).toBe(
    "dialog",
  );
  expect(buttons.find((node) => node.textContent === "内层选项")?.closest("section")?.id).toBe(
    "sheet",
  );
  await act(() => root.render(null));
  expect(document.querySelectorAll("button").length).toBe(0);
});

test("局部 portal host 脱离内容布局，弹层不会成为 Dialog 的 flex 子项", async () => {
  const mount = document.createElement("div");
  document.body.append(mount);
  const root = createRoot(mount);
  roots.push(root);
  await act(() =>
    root.render(
      <section id="dialog" style={{ display: "flex", gap: 16 }}>
        <OverlayPortalScope>
          <div id="dialog-content">内容</div>
          <Popup label="弹层" />
        </OverlayPortalScope>
      </section>,
    ),
  );
  const dialog = document.querySelector("#dialog");
  const content = document.querySelector("#dialog-content");
  const host = document.querySelector("[data-ui-overlay-scope]");
  const popup = document.querySelector("button");
  expect(content?.parentElement).toBe(dialog);
  expect(host?.parentElement).toBe(dialog);
  expect(host?.style.position).toBe("absolute");
  expect(host?.style.width).toBe("0px");
  expect(host?.style.height).toBe("0px");
  expect(popup?.parentElement).toBe(host);
});

test("Sheet 子弹层留在当前 modal 内，并避开 Drawer 的 transform 和裁切", async () => {
  const mount = document.createElement("div");
  document.body.append(mount);
  const root = createRoot(mount);
  roots.push(root);
  await act(() =>
    root.render(
      <section id="dialog">
        <div data-vaul-detached-wrapper="" style={{ contain: "paint", overflow: "hidden" }}>
          <div style={{ transform: "translateY(100px)" }}>
            <SheetContentScope>
              <Popup label="Sheet 选项" />
            </SheetContentScope>
          </div>
        </div>
      </section>,
    ),
  );
  const popup = document.querySelector("button");
  expect(popup?.closest("section")?.id).toBe("dialog");
  expect(popup?.closest("[data-vaul-detached-wrapper]")).toBeNull();
  expect(popup?.parentElement?.dataset.uiSheetOverlayScope).toBe("");
  await act(() => root.render(null));
  expect(document.querySelector("[data-ui-sheet-overlay-scope]")).toBeNull();
  expect(document.querySelector("button")).toBeNull();
});
