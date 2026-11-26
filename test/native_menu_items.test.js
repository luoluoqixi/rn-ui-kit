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

test("宿主菜单提供快照 ID、语义元数据和扩展数据，不推断 React 图标或注册快捷键", () => {
  const hostData = { icon: "host-delete", custom: { color: "danger" } };
  const entries = createNativeMenuItems([
    { value: "same", label: 42, icon: () => ({ reactNode: true }), iconProps: { iosIconName: "trash" },
      subtitle: "不可撤销", shortcut: "⌘D", destructive: true, hostData },
    { value: "same", subMenu: [{ value: "same", label: () => ({ jsx: true }), textValue: "可访问文案" }] },
  ]);
  expect(new Set([entries[0].id, entries[1].id, entries[1].subMenu[0].id]).size).toBe(3);
  expect(entries[0]).toMatchObject({ value: "same", text: "42", subtitle: "不可撤销", destructive: true, shortcut: "⌘D", hostData, iconProps: { iosIconName: "trash" } });
  expect(entries[0].icon).toBeUndefined();
  expect(entries[0].accelerator).toBeUndefined();
  expect(entries[1].subMenu[0].text).toBe("可访问文案");
});

test("新适配路径保留 ContextMenu 与 Dropdown 各自的回调语义，失效、禁用和分组不能派发", async () => {
  const calls = []; let current = true;
  const onPress = () => calls.push("press"), onSelect = () => calls.push("select");
  const data = [{ value: "action", onPress, onSelect }, { value: "one", onPress, onSelect: onPress },
    { value: "check", checked: false, onCheckedChange: checked => calls.push(checked) },
    { value: "disabled", disabled: true, onPress }, { value: "sep", separator: true, onPress },
    { value: "group", onPress, subMenu: [{ value: "child", onPress }] }];
  const context = createNativeMenuItems(data, undefined, false, { kind: "context-menu" });
  for (const item of context) await item.onSelect();
  expect(calls).toEqual(["select", "press", true]);
  calls.length = 0;
  const dropdown = createNativeMenuItems(data, undefined, false, { kind: "dropdown", isCurrent: () => current });
  for (const item of dropdown) await item.onSelect();
  expect(calls).toEqual(["press", "select", "press", true]);
  current = false; await dropdown[0].onSelect(); await dropdown[5].subMenu[0].onSelect();
  expect(calls).toHaveLength(4);
});
