import { describe, expect, test } from "bun:test";

import {
  resolveNativeListContextMenu,
  resolveNativeListDisabledStyle,
} from "../src/core/components/ui/native_list/context_menu";

describe("resolveNativeListContextMenu", () => {
  const rootMenu = { items: [{ label: "根菜单", value: "root" }] };
  const sectionMenu = { items: [{ label: "Section 菜单", value: "section" }] };
  const itemMenu = { items: [{ label: "Item 菜单", value: "item" }] };

  test("按 Item、Section、NativeList 的顺序覆盖", () => {
    expect(resolveNativeListContextMenu(undefined, rootMenu)).toBe(rootMenu);
    expect(resolveNativeListContextMenu(sectionMenu, rootMenu)).toBe(sectionMenu);
    expect(resolveNativeListContextMenu(itemMenu, sectionMenu)).toBe(itemMenu);
  });

  test("false 会停止继承", () => {
    expect(resolveNativeListContextMenu(false, rootMenu)).toBeUndefined();
  });

  test("禁用的 Item 不会保留自身或继承的菜单", () => {
    expect(resolveNativeListContextMenu(undefined, rootMenu, true)).toBeUndefined();
    expect(resolveNativeListContextMenu(itemMenu, rootMenu, true)).toBeUndefined();
  });
});

describe("resolveNativeListDisabledStyle", () => {
  test("默认启用并按 Item、Section、NativeList 的顺序覆盖", () => {
    expect(resolveNativeListDisabledStyle(undefined)).toBe(true);
    expect(resolveNativeListDisabledStyle(undefined, false)).toBe(false);
    expect(resolveNativeListDisabledStyle(true, false)).toBe(true);
    expect(resolveNativeListDisabledStyle(false, true)).toBe(false);
  });
});
