import { Switch } from "@heroui/react/switch";
import { SwitchLabel } from "./switch_label";
import { FieldMessages } from "../utils/field_parts";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import type { SwitchAdapterProps } from "./types";

export function SwitchHeroUI(p: SwitchAdapterProps) {
  const context = { isSelected: p.selected, isDisabled: p.isDisabled ?? false };
  return <Switch {...p.herouiWebProps} id={p.nativeID ?? p.herouiWebProps?.id} size={p.size}
    isSelected={p.selected} isDisabled={p.isDisabled} onChange={p.onSelect} name={p.name} value={p.value}
    className={cn(p.className, p.containerClassName)}>
    <Switch.Content aria-label={p.accessibilityLabel}
      className={cn(p.labelPosition === "left" && "flex-row-reverse")}>
      <Switch.Control {...p.controlProps?.herouiWebProps} aria-hidden className={p.controlProps?.className}>
        <Switch.Thumb {...p.thumbProps?.herouiWebProps} className={p.thumbProps?.className}>
          {resolveRenderProp(p.thumbContent, context)}
        </Switch.Thumb>
      </Switch.Control>
      <SwitchLabel content={p.resolvedLabel} labelProps={p.labelProps} labelClassName={p.labelClassName} />
    </Switch.Content>
    <FieldMessages description={p.resolvedDescription} descriptionProps={p.descriptionProps}
      descriptionClassName={cn(p.labelPosition === "left" && "ps-0", p.descriptionClassName)} />
  </Switch>;
}
