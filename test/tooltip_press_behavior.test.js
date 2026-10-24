import { expect, test } from "bun:test";

import {
  closeTooltipAfterPress,
  shouldSuppressTooltipHover,
} from "../src/core/components/ui/tooltip/tooltip_press_behavior";

test("默认按下会抑制当前 hover，并兼容 Web 与 Native 的切换顺序", () => {
  expect(shouldSuppressTooltipHover(false)).toBe(true);

  let closeCount = 0;
  let scheduledClose;
  closeTooltipAfterPress(
    false,
    () => closeCount++,
    (close) => {
      scheduledClose = close;
    },
  );

  expect(closeCount).toBe(1);
  scheduledClose();
  expect(closeCount).toBe(2);
});

test("openOnPress 保留按下打开行为", () => {
  expect(shouldSuppressTooltipHover(true)).toBe(false);

  let closeCount = 0;
  closeTooltipAfterPress(
    true,
    () => closeCount++,
    () => {
      throw new Error("不应安排关闭 Tooltip");
    },
  );

  expect(closeCount).toBe(0);
});
