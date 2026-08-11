import { describe, expect, test } from "bun:test";

import {
  resolveIosMenuItemGroups,
  splitMenuItemsBySeparators,
} from "../src/core/components/ui/menu/item_groups";

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

describe("resolveIosMenuItemGroups", () => {
  test("只反转分组顺序并保持每组内部条目顺序", () => {
    const items = [
      { value: "select-workspace" },
      { value: "create-workspace" },
      { separator: true, value: "separator-01" },
      { value: "sort-workspaces" },
      { separator: true, value: "separator-02" },
      { value: "settings" },
    ];

    expect(resolveIosMenuItemGroups(items)).toEqual([
      [{ value: "settings" }],
      [{ value: "sort-workspaces" }],
      [{ value: "select-workspace" }, { value: "create-workspace" }],
    ]);
  });

  test("不会修改调用方传入的 items", () => {
    const items = [
      { value: "first" },
      { separator: true, value: "separator" },
      { value: "second" },
    ];

    resolveIosMenuItemGroups(items);

    expect(items.map((item) => item.value)).toEqual(["first", "separator", "second"]);
  });
});
