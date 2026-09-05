import { describe, expect, test } from "bun:test";

import { resolveNativeListDisabled } from "../src/core/components/ui/native_list/disabled";

describe("resolveNativeListDisabled", () => {
  test("默认不禁用", () => {
    expect(resolveNativeListDisabled()).toBe(false);
  });

  test("NativeList、Section 或 Item 任一级 disabled 都会禁用", () => {
    expect(resolveNativeListDisabled(true, false)).toBe(true);
    expect(resolveNativeListDisabled(undefined, true)).toBe(true);
    expect(resolveNativeListDisabled(false, true)).toBe(true);
  });

  test("父级未禁用时允许子级保持启用", () => {
    expect(resolveNativeListDisabled(false, false)).toBe(false);
  });
});
