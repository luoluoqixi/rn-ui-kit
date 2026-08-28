import { Dropdown } from "../dropdown";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import { useUiTheme } from "../utils/theme";
import { flattenItems, SelectBasicTrigger, SelectNativeTrigger, useSelectState } from "./shared";
import type { SelectHandle, SelectProps } from "./types";
import * as React from "react";
import { Platform } from "react-native";

export const SelectDropdown = React.forwardRef<SelectHandle, SelectProps>(
  function SelectDropdown(props, ref) {
    const isNative = props.native !== false;
    const useNativeTrigger = props.nativeTrigger === true;
    const theme = useUiTheme();
    const { value, setValue } = useSelectState(props);
    const menuRef = React.useRef<{ presentMenu: () => void } | null>(null);
    React.useImperativeHandle(
      ref,
      () => ({
        open: () => menuRef.current?.presentMenu(),
        close: () => undefined,
      }),
      [],
    );
    const hasFullWidthClass = props.className?.split(/\s+/).includes("w-full") === true;
    const hasFullWidthStyle = Array.isArray(props.style)
      ? props.style.some((entry: any) => entry?.width === "100%" || entry?.alignSelf === "stretch")
      : (props.style as any)?.width === "100%" || (props.style as any)?.alignSelf === "stretch";
    const nativeDropdownAlign =
      props.nativeDropdownAlign ??
      (Platform.OS === "android" && !useNativeTrigger && !hasFullWidthClass && !hasFullWidthStyle
        ? "start"
        : undefined);
    const items = flattenItems(props).map((item) => ({
      ...item,
      iconProps:
        item.swatchColor != null
          ? {
              androidIconColor: item.swatchColor,
              androidIconName: "presence_online",
              ios: { name: "circle.fill" as any, hierarchicalColor: item.swatchColor },
            }
          : undefined,
      label: (context: any) =>
        resolveRenderProp(item.label, {
          checked: item.value === value,
          disabled: !!(item.disabled ?? item.isDisabled),
          selected: item.value === value,
          value: item.value,
        }) ?? item.value,
      onSelect: () => setValue(item.value),
      onPress: () => setValue(item.value),
      selected: item.value === value,
      checkbox: true,
    }));
    const trigger = ({ open }: { native: boolean; open: boolean }) =>
      useNativeTrigger ? (
        <SelectNativeTrigger active={open} props={props} value={value ?? undefined} />
      ) : (
        <SelectBasicTrigger
          disabled={props.disabled ?? props.isDisabled}
          props={props}
          value={value ?? undefined}
        />
      );
    return (
      <Dropdown
        disabled={props.disabled ?? props.isDisabled}
        {...(!useNativeTrigger ? { __nativeDetachedAnchor: true } : {})}
        __menuRef={menuRef}
        native={isNative}
        items={items}
        itemProps={props.itemProps as any}
        nativeAnchorAlignment={nativeDropdownAlign}
        nativeHaptics={props.nativeHaptics}
        // Keep the native trigger signal on the native path. Android uses a
        // separate invisible MenuView anchor so opening the popup does not make
        // the visible trigger become a scroll/focus anchor.
        nativeTrigger={useNativeTrigger}
        nativeTriggerContainerStyle={props.nativeTriggerContainerStyle}
        nativeTriggerContent={props.nativeTriggerContent}
        nativeTriggerIcon={props.nativeTriggerIcon}
        nativeTriggerLabelProps={props.nativeTriggerLabelProps}
        nativeTriggerProps={props.nativeTriggerProps}
        nativeTriggerFeedbackOpacity={props.nativeTriggerFeedbackOpacity}
        nativeTriggerHoverBackground={props.nativeTriggerHoverBackground}
        nativeSelectedItemBackgroundColor={theme.accent}
        onOpenChange={props.onOpenChange}
        onOpenWillChange={props.onOpenWillChange}
        triggerClassName={props.className}
        triggerProps={{
          ...props.triggerProps,
          className: cn(props.triggerProps?.className, props.className),
          disabled: props.disabled ?? props.isDisabled ?? props.triggerProps?.disabled,
          style: (props.style ?? props.triggerProps?.style) as any,
        }}
        trigger={trigger}
      />
    );
  },
);
