import { ToggleButtonGroup } from "@heroui/react/toggle-button-group";
import { ToggleButton } from "@heroui/react/toggle-button";
import { useKeySelection } from "../utils/key_selection";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { resolveRenderProp } from "../utils/render";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import type { ToggleGroupItemData, ToggleGroupProps } from "./types";
import { toggleWebScaleClassName } from "../toggle/toggle_feedback_web";
import { resolveToggleGroupLayout } from "./toggle_group_layout";
function Item({ item, p, selected, disabled, index }: { item: ToggleGroupItemData; p: ToggleGroupProps; selected: boolean; disabled: boolean; index: number }) {
  const font = textWebStyle(useDefaultTextStyle(undefined, item.labelClassName));
  const style = item.herouiWebProps?.style;
  const layout = resolveToggleGroupLayout(p);
  const vertical = p.orientation === "vertical";
  return <div className={cn("relative inline-flex", !vertical && p.fullWidth && "min-w-0 flex-1", vertical && "self-stretch",
    selected ? "text-accent-soft-foreground" : "text-foreground")}>
    {!layout.isDetached && index > 0 && <ToggleButtonGroup.Separator />}
    <ToggleButton {...item.herouiWebProps} id={item.id} size={p.size} variant={p.variant}
    isDisabled={disabled} isIconOnly={item.isIconOnly} aria-label={item.accessibilityLabel}
    className={cn(toggleWebScaleClassName(item.isScaleDisabled ?? layout.isScaleDisabled, p.size),
      (p.fullWidth || vertical) && "w-full",
      !layout.isDetached && index > 0 && (vertical ? "rounded-t-none!" : "rounded-s-none!"),
      !layout.isDetached && index < p.items.length - 1 && (vertical ? "rounded-b-none!" : "rounded-e-none!"), item.className)}
    style={typeof style === "function" ? s => ({ ...font, ...style(s) }) : { ...font, ...style }}>
    <TextClassContext.Provider value={selected ? "text-accent-soft-foreground" : "text-foreground"}>
      <span className={cn("inline-flex items-center justify-center gap-2", item.labelClassName)}>{resolveRenderProp(item.title, { isSelected: selected, isDisabled: disabled }) ?? item.children}</span>
    </TextClassContext.Provider>
    </ToggleButton>
  </div>;
}
export function ToggleGroupHeroUI(p: ToggleGroupProps) {
  const state = useKeySelection({ ...p, selectionMode: p.selectionMode ?? "single" }, p.items);
  const layout = resolveToggleGroupLayout(p);
  const style = p.herouiWebProps?.style;
  return <ToggleButtonGroup {...p.herouiWebProps} className={p.className}
    style={s => ({ ...(typeof style === "function" ? style(s) : style), gap: layout.gap })}
    selectionMode={p.selectionMode ?? "single"} selectedKeys={state.selected} onSelectionChange={state.change}
    disallowEmptySelection={p.disallowEmptySelection} isDisabled={p.isDisabled}
    orientation={p.orientation} size={p.size} isDetached={layout.isDetached} fullWidth={p.fullWidth}
    aria-label={p.accessibilityLabel}>
    {p.items.map((item, index) => <Item key={item.id} item={item} p={p} index={index} selected={state.selected.has(item.id)} disabled={!!p.isDisabled || state.disabled.has(item.id)} />)}
  </ToggleButtonGroup>;
}
