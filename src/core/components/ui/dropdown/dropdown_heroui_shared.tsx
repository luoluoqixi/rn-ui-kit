import { useEffect, isValidElement } from "react";
import { Button } from "../button";
import { DropdownNativeTrigger, DropdownDefaultTrigger, resolveDropdownTrigger } from "./shared";
import { resolveRenderProp } from "../utils/render";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import { useOverlayState } from "../utils/overlay/overlay_state";
import type { DropdownItemData, DropdownProps } from "./types";

export function useDropdownModel(p: DropdownProps) {
  const disabled = p.disabled ?? p.triggerProps?.isDisabled ?? p.triggerProps?.disabled ?? false;
  const haptics = useResolvedNativeHaptics(p.nativeHaptics);
  const itemHaptics = useResolvedNativeHaptics(p.itemNativeHaptics ?? p.nativeHaptics);
  const s = useOverlayState({ ...p, onOpenChange: next => {
    p.onOpenWillChange?.(next);
    if (next) triggerNativeHaptics(haptics);
    p.onOpenChange?.(next);
  } }, disabled);
  useEffect(() => {
    if (!p.__menuRef) return;
    p.__menuRef.current = { presentMenu: () => s.setOpen(true) };
    return () => { if (p.__menuRef) p.__menuRef.current = null; };
  }, [p.__menuRef, s.setOpen]);
  const ctx = { native: false, open: s.open };
  const custom = resolveDropdownTrigger(p.trigger, ctx, disabled) ?? p.children;
  const trigger = p.nativeTrigger ? <DropdownNativeTrigger
    {...p.triggerProps} className={p.triggerClassName} containerStyle={p.nativeTriggerContainerStyle}
    content={p.nativeTriggerContent} disabled={disabled} icon={p.nativeTriggerIcon}
    label={resolveRenderProp(p.triggerLabel, ctx) ?? resolveRenderProp(p.trigger, ctx)}
    labelProps={p.nativeTriggerLabelProps} nativeTriggerProps={p.nativeTriggerProps}
    nativeTriggerFeedbackOpacity={p.nativeTriggerFeedbackOpacity}
    nativeTriggerHoverBackground={p.nativeTriggerHoverBackground} open={s.open} trigger={undefined} />
    : custom != null ? isValidElement(custom) ? custom : <Button isDisabled={disabled}>{custom}</Button>
    : <DropdownDefaultTrigger className={p.triggerClassName} disabled={disabled}
        label={resolveRenderProp(p.triggerLabel, ctx) ?? "菜单"} props={p.triggerProps} />;
  const activate = (item: DropdownItemData) => {
    if (item.disabled || disabled) return;
    triggerNativeHaptics(item.nativeHaptics ?? itemHaptics, { delay: item.nativeHapticsDelay ?? p.itemNativeHapticsDelay ?? p.nativeHapticsDelay });
    item.onPress?.();
    if (item.onSelect !== item.onPress) item.onSelect?.();
  };
  return { ...s, disabled, trigger, activate };
}
export function dropdownText(item: DropdownItemData) {
  const label = resolveRenderProp(item.label, item);
  return item.textValue ?? item["aria-label"] ?? (typeof label === "string" || typeof label === "number" ? String(label) : item.value);
}
