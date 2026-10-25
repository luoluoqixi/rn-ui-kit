import { expect, test } from "bun:test";
import { createNativeMenuItems } from "../src/core/components/ui/context_menu/native_menu_items";

test("原生菜单保留分组与勾选，禁用项不会触发操作", async () => {
  const calls = [];
  const items = createNativeMenuItems([
    {
      value: "format",
      label: "格式",
      subMenu: [
        {
          value: "bold",
          textValue: "加粗",
          checked: true,
          onCheckedChange: (value) => {
            calls.push(value);
          },
        },
        {
          value: "italic",
          selected: false,
          onSelect: () => {
            calls.push("italic");
          },
        },
      ],
    },
    { value: "sep", separator: true },
    {
      value: "delete",
      label: "删除",
      disabled: true,
      onSelect: () => {
        calls.push("delete");
      },
    },
    {
      value: "copy",
      label: () => "复制",
      onSelect: () => {
        calls.push("copy");
      },
    },
  ]);
  expect(items[0].text).toBe("格式");
  expect(items[0].subMenu?.[0].checked).toBe(true);
  expect(items[0].subMenu?.[1].checked).toBe(false);
  expect(items[1].separator).toBe(true);
  expect(items[3].text).toBe("复制");
  await items[0].subMenu?.[0].onSelect?.();
  await items[2].onSelect?.();
  await items[3].onSelect?.();
  expect(calls).toEqual([false, "copy"]);
});

test("原生子菜单继承禁用状态，itemProps 回调仍可用", async () => {
  const calls = [];
  const items = createNativeMenuItems([
    {
      value: "group",
      disabled: true,
      subMenu: [
        {
          value: "child",
          onSelect: () => {
            calls.push("child");
          },
        },
      ],
    },
    {
      value: "other",
      itemProps: {
        onPress: () => {
          calls.push("other");
        },
      },
    },
  ]);
  await items[0].subMenu?.[0].onSelect?.();
  await items[1].onSelect?.();
  expect(calls).toEqual(["other"]);
});
