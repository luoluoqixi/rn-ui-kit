import type { ContextMenuItemData } from "./types";
import type { DropdownItemData } from "../dropdown/types";

export type NativeMenuItem = {
  text: string;
  disabled?: boolean;
  checked?: boolean;
  separator?: boolean;
  subMenu?: NativeMenuItem[];
  onSelect?(): void | Promise<void>;
};

/** 将组件数据转换为宿主原生菜单的稳定契约，不携带 React 元素。 */
export function createNativeMenuItems(
  items: (ContextMenuItemData | DropdownItemData)[],
  itemProps?: Record<string, unknown>,
  parentDisabled = false,
): NativeMenuItem[] {
  return items.map((item) => {
    const props = { ...itemProps, ...item.itemProps };
    const disabled =
      parentDisabled ||
      (item.disabled ?? props.disabled ?? item.triggerProps?.disabled) === true;
    const checked =
      ("checked" in item ? item.checked : undefined) ?? item.selected;
    const label =
      typeof item.label === "function"
        ? (item.label as (item: unknown) => unknown)(item)
        : item.label;
    const onSelect =
      item.onSelect ??
      item.onPress ??
      (props.onPress as (() => void) | undefined);
    return {
      text: item.textValue ?? (typeof label === "string" ? label : item.value),
      disabled,
      ...(checked === undefined ? {} : { checked }),
      separator: item.separator,
      subMenu: item.subMenu?.length
        ? createNativeMenuItems(item.subMenu, itemProps, disabled)
        : undefined,
      onSelect: async () => {
        if (disabled || item.separator || item.subMenu?.length) return;
        if (checked !== undefined && "onCheckedChange" in item)
          item.onCheckedChange?.(!checked);
        await onSelect?.();
      },
    };
  });
}
