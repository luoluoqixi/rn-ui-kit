/** 将组件数据转换为宿主原生菜单的稳定契约，不携带 React 元素。 */
export function createNativeMenuItems(items, itemProps, parentDisabled = false, options = {}, path = "") {
    return items.map((raw, index) => {
        const item = { ...itemProps, ...raw.itemProps, ...raw };
        const disabled = parentDisabled ||
            (item.disabled ?? item.triggerProps?.disabled) === true;
        const checked = ("checked" in item ? item.checked : undefined) ?? item.selected;
        const label = typeof item.label === "function"
            ? item.label(item)
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
                if (disabled || item.separator || item.subMenu?.length || options.isCurrent?.() === false)
                    return;
                if (checked !== undefined && "onCheckedChange" in item)
                    item.onCheckedChange?.(!checked);
                if (options.kind === "dropdown") {
                    const pressed = item.onPress?.();
                    const selected = item.onSelect !== item.onPress ? item.onSelect?.() : undefined;
                    await Promise.all([pressed, selected]);
                }
                else
                    await (item.onSelect ?? item.onPress)?.();
            },
        };
    });
}
