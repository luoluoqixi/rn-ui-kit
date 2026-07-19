import { describe, expect, test } from "bun:test";

import { stabilizeNumberArray } from "../src/core/components/ui/split_view/split_layout_values";

describe("stabilizeNumberArray", () => {
  test("内容相同时保留已有引用", () => {
    const previous = [220, 520];

    expect(stabilizeNumberArray(previous, [220, 520])).toBe(previous);
  });

  test("内容变化时创建新的配置快照", () => {
    const previous = [220, 520];
    const next = [240, 500];
    const stable = stabilizeNumberArray(previous, next);

    expect(stable).not.toBe(previous);
    expect(stable).not.toBe(next);
    expect(stable).toEqual(next);
  });

  test("调用方原地修改数组时也能检测到变化", () => {
    const input = [220, 520];
    const stable = stabilizeNumberArray(undefined, input);

    input[0] = 0;

    expect(stabilizeNumberArray(stable, input)).toEqual([0, 520]);
  });
});
