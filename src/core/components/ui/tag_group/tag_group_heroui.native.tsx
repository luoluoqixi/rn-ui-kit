import { TagGroup } from "heroui-native/tag-group";
import { Label } from "../label";
import { TextClassContext } from "../text";
import { normalizeSlotText } from "../utils/slot_content";
import { FieldMessages } from "../utils/field_parts";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "../utils/cn";
import { useKeySelection } from "../utils/key_selection";
import { resolveRenderProp } from "../utils/render";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import type { TagGroupItem, TagGroupItemContext, TagGroupProps } from "./types";
function ItemLabel({ item, context }: { item: TagGroupItem; context: TagGroupItemContext }) {
  const classes = cn(context.isSelected ? "text-accent-soft-foreground" : "text-foreground", item.labelClassName);
  const font = useDefaultTextStyle(undefined, classes);
  return <TextClassContext.Provider value={classes}>
    {resolveRenderProp(item.startContent, context)}
    <TagGroup.ItemLabel className={classes} style={font}>{resolveRenderProp(item.title, context)}</TagGroup.ItemLabel>
  </TextClassContext.Provider>;
}
export function TagGroupHeroUI(p: TagGroupProps) {
  const state = useKeySelection({ ...p, selectionMode: p.selectionMode ?? "none" }, p.items);
  const haptics = useResolvedNativeHaptics(p.nativeHaptics, { defaultEnabled: true });
  return <TagGroup {...p.herouiNativeProps} className={p.className} size={p.size} variant={p.variant}
    accessibilityLabel={p.accessibilityLabel ?? (typeof p.label === "string" ? p.label : "标签")}
    isDisabled={p.isDisabled} isInvalid={p.isInvalid} isRequired={p.isRequired}
    selectionMode={p.selectionMode ?? "none"} selectedKeys={state.selected} disabledKeys={state.disabled}
    onSelectionChange={keys => {
      state.change(keys);
    }} onRemove={p.onRemove ? keys => {
      const removable = new Set([...keys].map(String).filter(key => !state.disabled.has(key)));
      if (!p.isDisabled && removable.size) { triggerNativeHaptics(haptics); p.onRemove?.(removable); }
    } : undefined}>
    {p.label != null && <Label {...p.labelProps} className={cn(p.labelProps?.className, p.labelClassName)} isDisabled={p.isDisabled} isRequired={p.isRequired} isInvalid={p.isInvalid}>{p.label}</Label>}
    <TagGroup.List className={p.listClassName} renderEmptyState={() => normalizeSlotText(p.emptyContent ?? "暂无标签")}>
      {p.items.map(item => <TagGroup.Item {...item.herouiNativeProps} key={item.id} id={item.id} className={item.className}
        isDisabled={state.disabled.has(item.id)} accessibilityLabel={item.textValue ?? (typeof item.title === "string" ? item.title : item.id)}
        onPress={() => { if (!p.isDisabled && !state.disabled.has(item.id) && p.selectionMode && p.selectionMode !== "none") triggerNativeHaptics(haptics); }}>
        {context => <>
          <ItemLabel item={item} context={{ ...context, id: item.id }} />
          {p.onRemove && <TagGroup.ItemRemoveButton aria-label={"移除" + (item.textValue ?? (typeof item.title === "string" ? item.title : item.id))}
            onPress={event => event.stopPropagation()} />}
        </>}
      </TagGroup.Item>)}
    </TagGroup.List>
    <FieldMessages description={p.description} descriptionClassName={p.descriptionClassName} isInvalid={p.isInvalid}
      errorMessage={p.errorMessage} errorMessageClassName={p.errorMessageClassName} />
  </TagGroup>;
}
