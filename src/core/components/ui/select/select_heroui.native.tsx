import { useDefaultTextStyle } from "../provider/font_provider";
import { forwardRef } from "react";
import { View, ScrollView } from "react-native";
import { Select as HeroSelect } from "heroui-native/select";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { useThemeColor } from "heroui-native/hooks";
import { Text } from "../text";
import { resolveRenderProp } from "../utils/render";
import { HeroUIWindowAnchor, HeroUIWindowOverlayScope, useHeroUIOverlayPortalHostName } from "../utils/overlay/heroui_anchor.native";
import { itemLabel, SelectNativeTrigger, SelectBasicTrigger } from "./shared";
import { useHeroSelect } from "./select_heroui_shared";
import type { SelectHandle, SelectProps } from "./types";

export const SelectHeroUI = forwardRef<SelectHandle, SelectProps>(function SelectHeroUI(p, ref) {
  const portalHostName = useHeroUIOverlayPortalHostName();
  const m = useHeroSelect(p, ref);
  const font = useDefaultTextStyle();
  const pressedColor = useThemeColor("default");
  const itemTextStyle = useDefaultTextStyle(p.itemTextProps?.style, p.itemTextProps?.className);
  const c = p.contentProps;
  const placement = c?.herouiNativeProps?.placement ?? c?.side ?? "bottom";
  const align = c?.herouiNativeProps?.align ?? c?.align ?? (placement === "top" || placement === "bottom" ? "center" : "start");
  return <HeroSelect {...p.herouiNativeProps} value={m.option} onValueChange={o => m.setValue(o?.value ?? null)}
    isDisabled={m.disabled} isOpen={m.open} onOpenChange={m.setOpen} className={p.className} style={p.style}>
    <HeroSelect.Trigger asChild variant="unstyled">
      <HeroUIWindowAnchor isOpen={m.open}>{p.nativeTrigger ? <SelectNativeTrigger props={p} value={m.value} active={m.open} />
        : <SelectBasicTrigger props={p} value={m.value} disabled={m.disabled} />}</HeroUIWindowAnchor>
    </HeroSelect.Trigger>
    <HeroSelect.Portal hostName={portalHostName}><HeroUIWindowOverlayScope><HeroSelect.Overlay /><HeroSelect.Content {...c?.herouiNativeProps} presentation="popover"
      placement={placement} align={align} offset={c?.herouiNativeProps?.offset ?? c?.sideOffset ?? 8} className={c?.className}>
      <ScrollView {...p.viewportProps} style={[{ maxHeight: 320 }, p.viewportProps?.style]} keyboardShouldPersistTaps="handled">
        {m.groups.map(group => <View key={group.key}>
          {group.label != null && <HeroSelect.ListLabel {...group.labelProps} style={[font, group.labelProps?.style]}>{resolveRenderProp(group.label, { value: m.value ?? "" })}</HeroSelect.ListLabel>}
          {group.items.map(item => {
            const ctx = { checked: item.value === m.value, selected: item.value === m.value, disabled: !!(item.disabled ?? item.isDisabled), value: item.value };
            const label = resolveRenderProp(item.label, ctx);
            return <PressableFeedback key={item.value} asChild isDisabled={ctx.disabled}
              animation={{ scale: { value: 0.98, ignoreScaleCoefficient: true, timingConfig: { duration: 150 } } }}>
              <HeroSelect.Item {...p.itemProps?.herouiNativeProps} {...item.itemProps?.herouiNativeProps}
              value={item.value} label={itemLabel(item, m.value)} disabled={ctx.disabled}
              className={["rounded-xl", item.itemProps?.className ?? p.itemProps?.className].filter(Boolean).join(" ")} style={item.itemProps?.style ?? p.itemProps?.style}>
              <PressableFeedback.Highlight animation={{ backgroundColor: { value: pressedColor }, opacity: { value: [0, 1], timingConfig: { duration: 150 } } }} />
              {item.swatchColor && <View className="size-4 rounded-full" style={{ backgroundColor: item.swatchColor }} />}
              {resolveRenderProp(item.startContent, ctx)}
              <View className="flex-1">{typeof label === "string" || typeof label === "number" ? <HeroSelect.ItemLabel {...p.itemTextProps} style={itemTextStyle} /> : label}
                {item.description != null && <HeroSelect.ItemDescription style={font}>{resolveRenderProp(item.description, ctx)}</HeroSelect.ItemDescription>}
              </View>
              {resolveRenderProp(item.endContent, ctx)}<HeroSelect.ItemIndicator {...p.itemIndicatorProps} />
              </HeroSelect.Item>
            </PressableFeedback>;
          })}
        </View>)}
        {m.groups.length === 0 && <Text color="muted">暂无选项</Text>}
      </ScrollView>
    </HeroSelect.Content></HeroUIWindowOverlayScope></HeroSelect.Portal>
  </HeroSelect>;
});
