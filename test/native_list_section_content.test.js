import { describe, expect, test } from "bun:test";

import { resolveRenderProp } from "../src/core/components/ui/utils/render";

describe("resolveRenderProp", () => {
  test("普通 ReactNode 保持不变", () => {
    expect(resolveRenderProp("分组标题", {})).toBe("分组标题");
  });

  test("回调接收调用方提供的上下文", () => {
    expect(resolveRenderProp(({ label }) => label, { label: "分组标题" })).toBe("分组标题");
  });
});
