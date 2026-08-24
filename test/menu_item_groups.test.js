import { describe, expect, test } from "bun:test";

import {
  resolveAndroidMenuItems,
  resolveIosMenuItemGroups,
  splitMenuItemsBySeparators,
} from "../src/core/components/ui/dropdown/dropdown_native_helpers";

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
  test("保持分组顺序和每组内部条目顺序", () => {
    const items = [
      { value: "select-workspace" },
      { value: "create-workspace" },
      { separator: true, value: "separator-01" },
      { value: "sort-workspaces" },
      { separator: true, value: "separator-02" },
      { value: "settings" },
    ];

    expect(resolveIosMenuItemGroups(items)).toEqual([
      [{ value: "select-workspace" }, { value: "create-workspace" }],
      [{ value: "sort-workspaces" }],
      [{ value: "settings" }],
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

describe("resolveAndroidMenuItems", () => {
  test("将 separator 标记到下一有效条目并保持顺序", () => {
    const items = [
      { value: "select-workspace" },
      { value: "create-workspace" },
      { separator: true, value: "separator-01" },
      { value: "sort-workspaces" },
      { separator: true, value: "separator-02" },
      { value: "settings" },
    ];

    expect(resolveAndroidMenuItems(items)).toEqual([
      { item: { value: "select-workspace" }, separatorBefore: false },
      { item: { value: "create-workspace" }, separatorBefore: false },
      { item: { value: "sort-workspaces" }, separatorBefore: true },
      { item: { value: "settings" }, separatorBefore: true },
    ]);
  });

  test("忽略首尾及连续 separator", () => {
    const items = [
      { separator: true, value: "leading" },
      { value: "first" },
      { separator: true, value: "separator-1" },
      { separator: true, value: "separator-2" },
      { value: "second" },
      { separator: true, value: "trailing" },
    ];

    expect(resolveAndroidMenuItems(items)).toEqual([
      { item: { value: "first" }, separatorBefore: false },
      { item: { value: "second" }, separatorBefore: true },
    ]);
  });
});
