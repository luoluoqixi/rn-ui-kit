import { expect, test } from "bun:test";
import { Window } from "happy-dom";

import { preventNextClickAfterOutsidePointerDown } from "../src/core/components/ui/context_menu/prevent_next_click_after_outside_pointer_down.web";

test("Web ContextMenu 关闭时只吞掉当前 outside click", () => {
  const window = new Window();
  const { document } = window;
  Object.assign(globalThis, {
    Document: window.Document,
    Node: window.Node,
  });
  const target = document.createElement("button");
  document.body.append(target);
  let pointerDown;
  let receivedClicks = 0;
  target.addEventListener("pointerdown", (event) => {
    pointerDown = event;
  });
  document.addEventListener("click", () => receivedClicks++);

  target.dispatchEvent(
    new window.PointerEvent("pointerdown", {
      bubbles: true,
      button: 0,
      cancelable: true,
    }),
  );
  preventNextClickAfterOutsidePointerDown({
    defaultPrevented: false,
    detail: { originalEvent: pointerDown },
  });
  target.dispatchEvent(new window.PointerEvent("pointerup", { bubbles: true }));

  const dismissClick = new window.MouseEvent("click", {
    bubbles: true,
    cancelable: true,
  });
  target.dispatchEvent(dismissClick);
  expect(dismissClick.defaultPrevented).toBe(true);
  expect(receivedClicks).toBe(0);

  target.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  expect(receivedClicks).toBe(1);
});
