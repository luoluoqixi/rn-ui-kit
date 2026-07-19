export function resolveSelectItemGroups(options) {
    const sourceGroups = options.itemGroups ??
        (options.items != null || options.options != null
            ? [{ key: "default", items: options.items ?? options.options ?? [] }]
            : []);
    let nextIndex = 0;
    return sourceGroups
        .filter((group) => group.items.length > 0)
        .map((group, groupIndex) => {
        const groupKey = group.key ?? `group-${groupIndex}`;
        return {
            ...group,
            key: groupKey,
            items: group.items.map((item, itemIndex) => ({
                ...item,
                groupKey,
                index: nextIndex++,
                isFirstInGroup: itemIndex === 0,
                isLastInGroup: itemIndex === group.items.length - 1,
            })),
        };
    });
}
