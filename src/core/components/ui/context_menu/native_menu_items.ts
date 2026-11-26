import type { ContextMenuItemData } from "./types";
import type { DropdownItemData } from "../dropdown/types";
import type { MenuAdapterItem } from "../menu/menu_adapter_types";

export type NativeMenuItem = {
  /** 单次菜单树内唯一的透明 ID，宿主应原样返回；value 保留调用方的业务标识。 */
  id?: string;
  value?: string;
  text: string;
  subtitle?: string;
  destructive?: boolean;
  /** 仅显示提示文字，不自动注册系统快捷键。 */
  shortcut?: string;
  iconProps?: Readonly<Record<string, unknown>>;
  hostData?: Readonly<Record<string, unknown>>;
  shouldCloseOnSelect?: boolean;
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
  options: { kind?: "context-menu" | "dropdown"; isCurrent?: () => boolean } = {},
  path = "",
): MenuAdapterItem[] {
  return items.map((raw, index) => {
    const item = { ...itemProps, ...raw.itemProps, ...raw } as typeof raw;
    const disabled =
      parentDisabled ||
      (item.disabled ?? item.triggerProps?.disabled) === true;
    const checked =
      ("checked" in item ? item.checked : undefined) ?? item.selected;
    const label =
      typeof item.label === "function"
        ? (item.label as (item: unknown) => unknown)(item)
        : item.label;
    const id = path + index;
    return {
      id,
      value: item.value,
      text: item.textValue ?? item["aria-label"] ?? (typeof label === "string" || typeof label === "number" ? String(label) : item.value),
      subtitle: item.subtitle,
      destructive: item.destructive,
      shortcut: item.shortcut,
      iconProps: item.iconProps,
      hostData: item.hostData,
      shouldCloseOnSelect: item.shouldCloseOnSelect,
      disabled,
      ...(checked === undefined ? {} : { checked }),
      separator: item.separator,
      subMenu: item.subMenu?.length
        ? createNativeMenuItems(item.subMenu, itemProps, disabled, options, id + ".")
        : undefined,
      onSelect: async () => {
        if (disabled || item.separator || item.subMenu?.length || options.isCurrent?.() === false) return;
        if (checked !== undefined && "onCheckedChange" in item)
          item.onCheckedChange?.(!checked);
        if (options.kind === "dropdown") {
          const pressed = item.onPress?.();
          const selected = item.onSelect !== item.onPress ? item.onSelect?.() : undefined;
          await Promise.all([pressed, selected]);
        } else await (item.onSelect ?? item.onPress)?.();
      },
    };
  });
}
