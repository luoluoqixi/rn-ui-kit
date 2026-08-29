import { Icon } from "../icon";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { resolveRenderProp, type RenderProp } from "../utils/render";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import * as SelectPrimitive from "@rn-primitives/select";
import { Check, ChevronDown, ChevronDownIcon, ChevronUpIcon } from "lucide-react-native";
import type { ComponentProps } from "react";
import * as React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type TextStyle,
} from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
import {
  menuIconSizeClasses,
  menuItemPaddingClasses,
  menuTextSizeClasses,
} from "../utils/menu_size";

const SELECT_MENU_MAX_HEIGHT_RATIO = 0.45;

import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { resolveSelectItemGroups } from "./select_grouping";
import { SelectBasicTrigger, SelectNativeTrigger } from "./shared";
import { SELECT_TRIGGER_FONT_WEIGHT } from "./constants";
import type {
  SelectContentProps,
  SelectContentSize,
  SelectHandle,
  SelectGroupProps,
  SelectItemData,
  SelectItemProps,
  SelectLabelProps,
  SelectProps,
  SelectSeparatorProps,
  SelectTriggerProps,
  SelectValueProps,
} from "./types";

const SelectContentSizeContext = React.createContext<SelectContentSize>("default");

function normalizeText(children: React.ReactNode, className?: string) {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <Text className={className}>{child}</Text>
    ) : (
      child
    ),
  );
}

function SelectItemSwatch({ color }: { color: string }) {
  return <View className="size-3.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />;
}

function renderSelectDisplay(
  label: React.ReactNode,
  swatchColor?: string,
  fontWeight: TextStyle["fontWeight"] = SELECT_TRIGGER_FONT_WEIGHT,
) {
  const content = React.Children.map(label, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <Text style={{ fontWeight }}>{child}</Text>
    ) : (
      child
    ),
  );
  if (swatchColor == null) return content;
  return (
    <View className="flex-row items-center gap-2">
      <SelectItemSwatch color={swatchColor} />
      <View className="min-w-0 shrink">{content}</View>
    </View>
  );
}

function SelectValue({ className, ...props }: SelectValueProps) {
  const { value } = SelectPrimitive.useRootContext();
  return (
    <SelectPrimitive.Value
      {...props}
      className={cn(
        "text-foreground line-clamp-1 flex-row items-center gap-2 text-sm",
        !value && "text-muted-foreground",
        className,
      )}
      placeholder=""
    />
  );
}

function SelectTrigger({ className, children, size = "default", ...props }: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "border-input bg-background flex h-11 flex-row items-center justify-between gap-2 rounded-md border px-5 py-2.5 shadow-sm shadow-black/5",
        Platform.select({
          web: "focus-visible:border-ring focus-visible:ring-ring/50 w-fit whitespace-nowrap text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed hover:bg-muted",
        }),
        size === "sm" && "h-8 py-1.5",
        props.disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {typeof children === "function" ? children({ pressed: false }) : normalizeText(children)}
      <Icon as={ChevronDown} aria-hidden className="text-muted-foreground size-4 shrink-0" />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  side: sideProp,
  showScrollButtons = true,
  initialScrollOffset = 0,
  portalHost,
  viewportProps,
  size: sizeProp,
  ...props
}: SelectContentProps) {
  const { height: windowHeight } = useWindowDimensions();
  const { open, triggerPosition, contentLayout } = SelectPrimitive.useRootContext();
  const scrollRef = React.useRef<ScrollView | null>(null);
  const didAutoScrollRef = React.useRef(false);
  const availableAbove = triggerPosition?.pageY ?? 0;
  const availableBelow = triggerPosition
    ? windowHeight - triggerPosition.pageY - triggerPosition.height
    : windowHeight;
  const estimatedHeight = contentLayout?.height ?? windowHeight * SELECT_MENU_MAX_HEIGHT_RATIO;
  const resolvedSide =
    Platform.OS === "web" || sideProp != null
      ? sideProp
      : availableBelow < estimatedHeight && availableAbove > availableBelow
        ? "top"
        : "bottom";
  const scrollToSelectedItem = React.useCallback(() => {
    if (Platform.OS === "web" || !open || didAutoScrollRef.current) return;
    didAutoScrollRef.current = true;
    scrollRef.current?.scrollTo({ animated: false, y: Math.max(0, initialScrollOffset) });
  }, [initialScrollOffset, open]);

  React.useEffect(() => {
    if (!open) {
      didAutoScrollRef.current = false;
      return;
    }
    requestAnimationFrame(scrollToSelectedItem);
  }, [open, scrollToSelectedItem]);
  const scopedHost = useScopedOverlayPortalHostName();
  const resolvedHost = portalHost ?? scopedHost;
  const contentStyle = useOverlayPortalContentStyle(props.style);
  const resolvedContentStyle = StyleSheet.flatten(contentStyle as any) as Record<string, unknown>;
  const resolvedViewportStyle = StyleSheet.flatten(viewportProps?.style as any) as
    | Record<string, unknown>
    | undefined;
  const size = sizeProp ?? React.useContext(SelectContentSizeContext);
  return (
    <SelectPrimitive.Portal hostName={resolvedHost}>
      <OverlayPortalWindow portalHost={resolvedHost}>
        <SelectPrimitive.Overlay
          // On web the primitive renders Overlay and Content as siblings. Keep
          // a real viewport-sized hit target in the portal so NativeList rows
          // underneath cannot receive clicks while the menu is open.
          style={
            Platform.OS === "web"
              ? ({
                  bottom: 0,
                  cursor: "default",
                  left: 0,
                  position: "fixed",
                  right: 0,
                  top: 0,
                  zIndex: 0,
                } as any)
              : StyleSheet.absoluteFillObject
          }
          pointerEvents={Platform.OS === "web" ? "auto" : undefined}
          asChild={Platform.OS !== "web"}
        >
          <NativeOnlyAnimatedView
            className="z-50"
            entering={FadeIn.reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <SelectContentSizeContext.Provider value={size}>
              <TextClassContext.Provider
                value={cn("text-popover-foreground", menuTextSizeClasses[size])}
              >
                <SelectPrimitive.Content
                  {...props}
                  className={cn(
                    "bg-popover border-border relative z-50 min-w-[8rem] rounded-md border shadow-md shadow-black/5",
                    Platform.select({
                      web: cn(
                        "animate-in fade-in-0 zoom-in-95 max-h-[45vh] overflow-x-hidden",
                        showScrollButtons ? "overflow-y-auto" : "overflow-y-hidden",
                        resolvedSide === "bottom" && "slide-in-from-top-2",
                        resolvedSide === "top" && "slide-in-from-bottom-2",
                      ),
                      native: "p-1",
                    }),
                    position === "popper" && Platform.select({ web: "translate-y-1" }),
                    className,
                  )}
                  style={
                    {
                      ...(Platform.OS === "web" ? { zIndex: 50 } : {}),
                      maxHeight: windowHeight * SELECT_MENU_MAX_HEIGHT_RATIO,
                      ...(Platform.OS === "web"
                        ? { overflowY: showScrollButtons ? "auto" : "hidden" }
                        : {}),
                      ...resolvedContentStyle,
                    } as any
                  }
                  position={position}
                  side={resolvedSide}
                  align={align}
                >
                  {showScrollButtons ? <SelectScrollUpButton /> : null}
                  {Platform.OS === "web" ? (
                    <SelectPrimitive.Viewport
                      {...viewportProps}
                      className={cn(
                        "p-1",
                        position === "popper" &&
                          Platform.select({ web: "min-w-[var(--radix-select-trigger-width)]" }),
                        !showScrollButtons &&
                          cn("max-h-[45vh] overflow-y-auto", "ui-menu-scrollbar"),
                        viewportProps?.className,
                      )}
                      style={
                        {
                          ...(!showScrollButtons
                            ? {
                                maxHeight: windowHeight * SELECT_MENU_MAX_HEIGHT_RATIO,
                                overflowY: "auto",
                              }
                            : {}),
                          ...resolvedViewportStyle,
                        } as any
                      }
                    >
                      {children}
                    </SelectPrimitive.Viewport>
                  ) : (
                    <ScrollView
                      ref={scrollRef}
                      nestedScrollEnabled
                      showsVerticalScrollIndicator
                      onContentSizeChange={scrollToSelectedItem}
                      style={{ maxHeight: windowHeight * SELECT_MENU_MAX_HEIGHT_RATIO }}
                    >
                      <SelectPrimitive.Viewport
                        {...viewportProps}
                        className={cn("p-1", viewportProps?.className)}
                      >
                        {children}
                      </SelectPrimitive.Viewport>
                    </ScrollView>
                  )}
                  {showScrollButtons ? <SelectScrollDownButton /> : null}
                </SelectPrimitive.Content>
              </TextClassContext.Provider>
            </SelectContentSizeContext.Provider>
          </NativeOnlyAnimatedView>
        </SelectPrimitive.Overlay>
      </OverlayPortalWindow>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: SelectLabelProps) {
  const size = React.useContext(SelectContentSizeContext);
  return (
    <SelectPrimitive.Label
      className={cn(
        "text-muted-foreground px-2",
        menuTextSizeClasses[size],
        menuItemPaddingClasses[size],
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  description,
  startContent,
  endContent,
  itemIndicatorProps,
  itemTextProps,
  ...props
}: SelectItemProps) {
  const size = React.useContext(SelectContentSizeContext);
  const label =
    props.label ??
    (typeof children === "string" || typeof children === "number" ? String(children) : props.value);
  const customLabel =
    children != null && !(typeof children === "string" || typeof children === "number");
  return (
    <SelectPrimitive.Item
      {...props}
      label={label}
      className={cn(
        cn(
          "active:bg-accent group relative flex w-full flex-row items-center gap-2 rounded-sm pl-2 pr-8",
          menuItemPaddingClasses[size],
        ),
        Platform.select({
          web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
        }),
        props.disabled && "opacity-50",
        className,
      )}
    >
      <View className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator {...itemIndicatorProps}>
          <Icon
            as={Check}
            className={cn("text-muted-foreground shrink-0", menuIconSizeClasses[size])}
          />
        </SelectPrimitive.ItemIndicator>
      </View>
      {startContent}
      <View className="min-w-0 flex-1">
        {customLabel ? normalizeText(children) : null}
        <SelectPrimitive.ItemText
          {...itemTextProps}
          className={cn(
            cn(
              "text-foreground select-none group-active:text-accent-foreground",
              menuTextSizeClasses[size],
            ),
            customLabel && "hidden",
            itemTextProps?.className,
          )}
        />
        {description != null
          ? normalizeText(description, cn("text-muted-foreground", menuTextSizeClasses[size]))
          : null}
      </View>
      {endContent}
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      className={cn(
        "bg-border -mx-1 my-1 h-px",
        Platform.OS === "web" && "pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  if (Platform.OS !== "web") return null;
  const size = React.useContext(SelectContentSizeContext);
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <Icon as={ChevronUpIcon} className={menuIconSizeClasses[size]} />
    </SelectPrimitive.ScrollUpButton>
  );
}
function SelectScrollDownButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  if (Platform.OS !== "web") return null;
  const size = React.useContext(SelectContentSizeContext);
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <Icon as={ChevronDownIcon} className={menuIconSizeClasses[size]} />
    </SelectPrimitive.ScrollDownButton>
  );
}

function renderItemLabel(item: SelectItemData, selected: boolean) {
  return resolveRenderProp(item.label, {
    checked: selected,
    disabled: !!(item.disabled ?? item.isDisabled),
    selected,
    value: item.value,
  });
}

function renderGeneratedItems(props: SelectProps, selectedValue?: string) {
  const groups = resolveSelectItemGroups({
    itemGroups: props.itemGroups,
    items: props.items,
    options: props.options,
  });
  return groups.map((group, groupIndex) => {
    const groupLabel =
      group.label == null ? null : resolveRenderProp(group.label, { value: selectedValue ?? "" });
    const body = group.items.map((item) => {
      const selected = item.value === selectedValue;
      const ctx = {
        checked: selected,
        disabled: !!(item.disabled ?? item.isDisabled),
        selected,
        value: item.value,
      };
      return (
        <SelectItem
          key={item.value}
          {...props.itemProps}
          {...item.itemProps}
          aria-label={item["aria-label"]}
          disabled={ctx.disabled}
          description={resolveRenderProp(item.description, ctx)}
          startContent={
            <>
              {item.swatchColor != null ? <SelectItemSwatch color={item.swatchColor} /> : null}
              {normalizeText(resolveRenderProp(item.startContent, ctx))}
            </>
          }
          endContent={resolveRenderProp(item.endContent, ctx)}
          itemIndicatorProps={props.itemIndicatorProps}
          itemTextProps={props.itemTextProps}
          value={item.value}
        >
          {renderItemLabel(item, selected)}
        </SelectItem>
      );
    });
    return groupIndex === 0 && groupLabel == null ? (
      body
    ) : (
      <SelectPrimitive.Group key={group.key}>
        <>
          {groupLabel ? (
            <SelectLabel {...group.labelProps}>{normalizeText(groupLabel)}</SelectLabel>
          ) : null}
          {body}
        </>
      </SelectPrimitive.Group>
    );
  });
}

const GeneratedSelectTrigger = React.forwardRef<
  any,
  Pick<
    SelectProps,
    | "className"
    | "nativeTrigger"
    | "nativeTriggerContainerStyle"
    | "nativeTriggerContent"
    | "nativeTriggerIcon"
    | "nativeTriggerLabel"
    | "nativeTriggerLabelProps"
    | "nativeTriggerProps"
    | "nativeTriggerFeedbackOpacity"
    | "nativeTriggerHoverBackground"
    | "nativeTriggerHoverOpacity"
  > & {
    disabled?: boolean;
    label: React.ReactNode;
    selectProps: SelectProps;
    swatchColor?: string;
  }
>(function GeneratedSelectTrigger(
  {
    className,
    nativeTrigger,
    nativeTriggerContainerStyle,
    nativeTriggerContent,
    nativeTriggerIcon,
    nativeTriggerLabel,
    nativeTriggerLabelProps,
    nativeTriggerProps,
    nativeTriggerFeedbackOpacity,
    nativeTriggerHoverBackground,
    nativeTriggerHoverOpacity,
    selectProps,
    disabled,
    label,
    swatchColor,
  },
  ref,
) {
  const { open } = SelectPrimitive.useRootContext();
  // Native triggers must keep the label as data so SelectNativeTrigger can
  // apply nativeTriggerLabelProps (especially color) to its Text node. Passing
  // a pre-rendered ReactNode here bypasses those props on Web.
  const display = nativeTrigger
    ? undefined
    : renderSelectDisplay(
        nativeTriggerLabel ?? label,
        swatchColor,
        selectProps.triggerFontWeight ?? SELECT_TRIGGER_FONT_WEIGHT,
      );
  if (!nativeTrigger) {
    return (
      <SelectPrimitive.Trigger asChild disabled={disabled}>
        <SelectBasicTrigger
          disabled={disabled}
          label={display}
          props={selectProps}
          value={selectProps.value ?? selectProps.defaultValue ?? undefined}
          ref={ref}
        />
      </SelectPrimitive.Trigger>
    );
  }
  return (
    <SelectPrimitive.Trigger asChild disabled={disabled}>
      <SelectNativeTrigger
        active={open}
        disabled={disabled}
        label={display}
        props={selectProps}
        ref={ref}
        value={selectProps.value ?? selectProps.defaultValue}
      />
    </SelectPrimitive.Trigger>
  );
});

export const SelectBasic = React.forwardRef<SelectHandle, SelectProps>(function SelectBasic(
  {
    children,
    items,
    itemGroups,
    options,
    native,
    nativeDropdownAlign,
    nativeDropdownAnchorWidth,
    nativeDropdownEdgeOffset,
    nativeHaptics,
    nativePickerProps,
    nativeSelectProps,
    nativeTrigger,
    nativeTriggerContainerStyle,
    nativeTriggerContent,
    nativeTriggerIcon,
    nativeTriggerLabel,
    nativeTriggerLabelProps,
    nativeTriggerProps,
    nativeTriggerFeedbackOpacity,
    nativeTriggerHoverBackground,
    nativeTriggerHoverOpacity,
    contentProps,
    itemProps,
    itemIndicatorProps,
    itemTextProps,
    placeholder,
    renderValue,
    sheetProps,
    showScrollButtons,
    triggerProps,
    triggerSize,
    contentSize,
    triggerFontWeight,
    viewportProps,
    isDisabled,
    onValueChange,
    ...props
  }: SelectProps,
  ref,
) {
  const selectedValue = props.value ?? props.defaultValue ?? undefined;
  const sourceOptions = itemGroups?.flatMap((group) => group.items) ?? items ?? options ?? [];
  const selectedIndex = Math.max(
    0,
    sourceOptions.findIndex((item) => item.value === selectedValue),
  );
  const initialScrollOffset = Math.max(0, selectedIndex * 52 - 104);
  const itemOptions = sourceOptions.map((item) => ({
    value: item.value,
    label: String(
      resolveRenderProp(item.label, {
        checked: item.value === selectedValue,
        disabled: false,
        selected: item.value === selectedValue,
        value: item.value,
      }) ?? item.value,
    ),
  }));
  const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
  const triggerRef = React.useRef<any>(null);
  React.useImperativeHandle(
    ref,
    () => ({
      open: () => triggerRef.current?.open?.(),
      close: () => triggerRef.current?.close?.(),
    }),
    [],
  );
  const rootHasFullWidthClass = props.className?.split(/\s+/).includes("w-full") === true;
  const generated =
    children ??
    (items != null || itemGroups != null || options != null ? (
      <>
        <GeneratedSelectTrigger
          className={props.className}
          disabled={props.disabled ?? isDisabled}
          label={
            resolveRenderProp(renderValue, {
              value: selectedValue,
              item: sourceOptions.find((item) => item.value === selectedValue),
            }) ??
            resolveRenderProp(sourceOptions.find((item) => item.value === selectedValue)?.label, {
              checked: true,
              disabled: false,
              selected: true,
              value: selectedValue ?? "",
            }) ??
            placeholder ??
            "选择"
          }
          nativeTrigger={nativeTrigger}
          nativeTriggerContainerStyle={nativeTriggerContainerStyle}
          nativeTriggerContent={nativeTriggerContent}
          nativeTriggerIcon={nativeTriggerIcon}
          nativeTriggerLabel={nativeTriggerLabel}
          nativeTriggerLabelProps={nativeTriggerLabelProps}
          selectProps={{
            ...props,
            itemGroups,
            items,
            options,
            placeholder,
            renderValue,
            nativeTriggerContainerStyle,
            nativeTriggerContent,
            nativeTriggerIcon,
            nativeTriggerLabel,
            nativeTriggerLabelProps,
            nativeTriggerFeedbackOpacity,
            nativeTriggerHoverBackground,
            nativeTriggerHoverOpacity,
            nativeTriggerProps,
            triggerSize,
            triggerFontWeight,
            triggerProps,
          }}
          swatchColor={sourceOptions.find((item) => item.value === selectedValue)?.swatchColor}
          ref={triggerRef}
        />
        <SelectContent
          {...contentProps}
          showScrollButtons={showScrollButtons ?? contentProps?.showScrollButtons}
          initialScrollOffset={initialScrollOffset}
          viewportProps={viewportProps}
        >
          {renderGeneratedItems(
            { ...props, itemProps, itemIndicatorProps, itemTextProps, items, itemGroups, options },
            selectedValue,
          )}
        </SelectContent>
      </>
    ) : null);
  return (
    <SelectPrimitive.Root
      {...(props as any)}
      // Generated triggers are content-sized unless their own className asks
      // for `w-full`. The primitive Root is a View whose default cross-axis
      // stretch would otherwise expand both trigger variants.
      style={[
        {
          alignItems: "flex-start",
          alignSelf: rootHasFullWidthClass ? "stretch" : "flex-start",
          width: rootHasFullWidthClass ? "100%" : "auto",
        },
        props.style,
      ]}
      disabled={props.disabled ?? isDisabled}
      onOpenChange={(nextOpen) => {
        if (nextOpen) triggerNativeHaptics(resolvedHaptics);
        props.onOpenChange?.(nextOpen);
      }}
      value={
        selectedValue == null
          ? undefined
          : itemOptions.find((option) => option.value === selectedValue)
      }
      defaultValue={
        props.defaultValue == null
          ? undefined
          : itemOptions.find((option) => option.value === props.defaultValue)
      }
      onValueChange={(option: { value: string; label: string } | undefined) => {
        triggerNativeHaptics(resolvedHaptics);
        onValueChange?.(option?.value ?? null);
      }}
    >
      <SelectContentSizeContext.Provider value={contentSize ?? "default"}>
        {generated}
      </SelectContentSizeContext.Provider>
    </SelectPrimitive.Root>
  );
});

export const SelectBasicComponent = Object.assign(SelectBasic, {
  Content: SelectContent,
  Group: (props: SelectGroupProps) => <SelectPrimitive.Group {...props} />,
  Item: SelectItem,
  Label: SelectLabel,
  Root: SelectBasic,
  ScrollDownButton: SelectScrollDownButton,
  ScrollUpButton: SelectScrollUpButton,
  Separator: SelectSeparator,
  Trigger: SelectTrigger,
  Value: SelectValue,
});

export type { RenderProp };
