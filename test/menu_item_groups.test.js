import { describe, expect, test } from "bun:test";

import { splitMenuItemsBySeparators } from "../src/core/components/ui/menu/item_groups";

describe("splitMenuItemsBySeparators", () => {
  test("按 separator 保留菜单项顺序并切分分组", () => {
    const items = [
      { value: "first" },
      { separator: true, value: "separator" },
      { value: "second" },
      { value: "third" },
    ];

    expect(splitMenuItemsBySeparators(items)).toEqual([
      [{ value: "first" }],
      [{ value: "second" }, { value: "third" }],
    ]);
  });

  test("忽略首尾及连续 separator 产生的空分组", () => {
    const items = [
      { separator: true, value: "leading" },
      { value: "first" },
      { separator: true, value: "separator-1" },
      { separator: true, value: "separator-2" },
      { value: "second" },
      { separator: true, value: "trailing" },
    ];

    expect(splitMenuItemsBySeparators(items)).toEqual([
      [{ value: "first" }],
      [{ value: "second" }],
    ]);
  });
});
