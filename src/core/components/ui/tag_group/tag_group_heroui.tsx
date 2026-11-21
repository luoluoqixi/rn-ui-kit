import { useId } from "react";
import { TagGroup } from "@heroui/react/tag-group";
import { Tag } from "@heroui/react/tag";
import { Description } from "@heroui/react/description";
import { ErrorMessage } from "@heroui/react/error-message";
import { Label } from "../label";
import { TextClassContext } from "../text";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { cn } from "../utils/cn";
import { useKeySelection } from "../utils/key_selection";
import { resolveRenderProp } from "../utils/render";
import type { TagGroupItem, TagGroupItemContext, TagGroupProps } from "./types";
function ItemContent({ item, context }: { item: TagGroupItem; context: TagGroupItemContext }) {
  const font = textWebStyle(useDefaultTextStyle(undefined, item.labelClassName));
  return <TextClassContext.Provider value={context.isSelected ? "text-accent-soft-foreground" : "text-foreground"}>
    {resolveRenderProp(item.startContent, context)}
    <span className={item.labelClassName} style={font}>{resolveRenderProp(item.title, context)}</span>
  </TextClassContext.Provider>;
}
export function TagGroupHeroUI(p: TagGroupProps) {
  const id = useId();
  const state = useKeySelection({ ...p, selectionMode: p.selectionMode ?? "none" }, p.items);
  const font = textWebStyle(useDefaultTextStyle());
  const disabled = p.isDisabled ? p.items.map(item => item.id) : state.disabled;
  return <TagGroup {...p.herouiWebProps} className={p.className} size={p.size} variant={p.variant}
    aria-label={p.accessibilityLabel ?? (p.label == null ? "标签" : undefined)}
    aria-invalid={p.isInvalid} aria-describedby={p.isInvalid && p.errorMessage != null ? id + "-error" : undefined}
    selectionMode={p.selectionMode ?? "none"} selectedKeys={state.selected} onSelectionChange={state.change}
    disabledKeys={disabled} disallowEmptySelection={p.disallowEmptySelection}
    onRemove={p.onRemove ? keys => {
      const removable = new Set([...keys].map(String).filter(key => !state.disabled.has(key)));
      if (!p.isDisabled && removable.size) p.onRemove?.(removable);
    } : undefined}>
    {p.label != null && <Label {...p.labelProps} className={cn(p.labelProps?.className, p.labelClassName)} isDisabled={p.isDisabled} isRequired={p.isRequired} isInvalid={p.isInvalid}>{p.label}</Label>}
    <TagGroup.List className={p.listClassName} items={p.items} renderEmptyState={() => p.emptyContent ?? "暂无标签"}>
      {item => {
        const context = { id: item.id, isSelected: state.selected.has(item.id), isDisabled: !!p.isDisabled || state.disabled.has(item.id) };
        return <Tag {...item.herouiWebProps} id={item.id} textValue={item.textValue ?? (typeof item.title === "string" ? item.title : item.id)}
          isDisabled={context.isDisabled} className={item.className}>
          <ItemContent item={item} context={context} />
          {p.onRemove && <Tag.RemoveButton aria-label="移除" />}
        </Tag>;
      }}
    </TagGroup.List>
    {p.description != null && <Description className={p.descriptionClassName} style={font}>{p.description}</Description>}
    {p.isInvalid && p.errorMessage != null && <ErrorMessage id={id + "-error"} className={p.errorMessageClassName} style={font}>{p.errorMessage}</ErrorMessage>}
  </TagGroup>;
}
