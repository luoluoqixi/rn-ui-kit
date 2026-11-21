import { Accordion as HeroUIAccordion } from "heroui-native/accordion";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { View } from "react-native";
import { resolveAriaLabel } from "../utils/accessibility";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import { resolveRenderProp } from "../utils/render";
import { AccordionText } from "./accordion_text";
import { useAccordionState, validateAccordionItems } from "./use_accordion_state";
import type { AccordionProps } from "./types";

export function AccordionHeroUI(props: AccordionProps) {
  const state = useAccordionState(props);
  const {
    items,
    titleClassName,
    contentClassName,
    itemProps,
    headerProps,
    triggerProps,
    contentProps,
    indicator,
    nativeHaptics,
    selectionMode,
    value,
    defaultValue,
    onValueChange,
    isCollapsible = true,
    isDisabled,
    children,
    herouiNativeProps,
    herouiWebProps,
    ...rootProps
  } = props;
  const haptics = useResolvedNativeHaptics(nativeHaptics);
  // The official default demo composes feedback explicitly; Trigger alone has none.
  const withPressFeedback = (props.variant ?? "default") === "default";
  validateAccordionItems(items);

  function handleChange(next: string | string[] | undefined) {
    if (state.onValueChange(next)) triggerNativeHaptics(haptics);
  }

  // HeroUI treats undefined as uncontrolled; an empty string keeps a closed single
  // accordion controlled. Item keys are validated to reserve this sentinel.
  const selection = state.isMultiple
    ? { selectionMode: "multiple" as const, value: state.values, onValueChange: handleChange }
    : {
        selectionMode: "single" as const,
        value: state.values[0] ?? "",
        onValueChange: handleChange,
      };

  return (
    <HeroUIAccordion
      {...herouiNativeProps}
      {...rootProps}
      {...selection}
      isDisabled={isDisabled || undefined}
      isCollapsible={isCollapsible}
    >
      {items.map((item) => {
        const title = resolveRenderProp(item.title, item);
        const itemDisabled =
          isDisabled ||
          (item.isDisabled ?? item.itemProps?.isDisabled ?? itemProps?.isDisabled) ||
          (item.triggerProps?.isDisabled ?? triggerProps?.isDisabled);
        const indicatorProp = item.indicator !== undefined ? item.indicator : indicator;
        const customIndicator = resolveRenderProp(indicatorProp, {
          item,
          isExpanded: state.values.includes(item.value),
          isDisabled: Boolean(itemDisabled),
        });
        const titleContent = (
          <AccordionText
            className={cn(
              "text-base text-foreground font-medium",
              titleClassName,
              item.titleClassName,
            )}
          >
            {title}
          </AccordionText>
        );
        const indicatorContent =
          indicatorProp === undefined ? (
            <HeroUIAccordion.Indicator />
          ) : customIndicator != null && typeof customIndicator !== "boolean" ? (
            <HeroUIAccordion.Indicator>
              <View
                className="size-5 items-center justify-center"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <AccordionText className="text-muted">{customIndicator}</AccordionText>
              </View>
            </HeroUIAccordion.Indicator>
          ) : null;
        const trigger = (
          <HeroUIAccordion.Trigger
            {...triggerProps?.herouiNativeProps}
            {...item.triggerProps?.herouiNativeProps}
            asChild={withPressFeedback}
            onPress={item.triggerProps?.onPress ?? triggerProps?.onPress}
            isDisabled={itemDisabled}
            className={cn(
              itemDisabled && "opacity-[var(--disabled-opacity)]",
              triggerProps?.className,
              item.triggerProps?.className,
            )}
            aria-label={resolveAriaLabel(
              item["aria-label"] ??
                item.triggerProps?.["aria-label"] ??
                triggerProps?.["aria-label"],
              title,
            )}
          >
            {withPressFeedback ? (
              <PressableFeedback isDisabled={Boolean(itemDisabled)} animation={{ scale: false }}>
                <PressableFeedback.Scale className="min-w-0 flex-1">
                  {titleContent}
                </PressableFeedback.Scale>
                {indicatorContent}
                <PressableFeedback.Highlight animation={{ opacity: { value: [0, 0.05] } }} />
              </PressableFeedback>
            ) : (
              <>
                <View className="min-w-0 flex-1">{titleContent}</View>
                {indicatorContent}
              </>
            )}
          </HeroUIAccordion.Trigger>
        );
        return (
          <HeroUIAccordion.Item
            {...itemProps?.herouiNativeProps}
            {...item.itemProps?.herouiNativeProps}
            key={item.value}
            value={item.value}
            isDisabled={itemDisabled}
            className={cn(itemProps?.className, item.itemProps?.className)}
          >
            {headerProps || item.headerProps ? (
              <View
                {...headerProps?.herouiNativeProps}
                {...item.headerProps?.herouiNativeProps}
                className={cn(headerProps?.className, item.headerProps?.className)}
              >
                {trigger}
              </View>
            ) : (
              trigger
            )}
            <HeroUIAccordion.Content
              {...contentProps?.herouiNativeProps}
              {...item.contentProps?.herouiNativeProps}
              className={cn(
                contentProps?.className,
                contentClassName,
                item.contentProps?.className,
                item.contentClassName,
              )}
            >
              <AccordionText className="text-base text-muted">
                {resolveRenderProp(item.content, item)}
              </AccordionText>
            </HeroUIAccordion.Content>
          </HeroUIAccordion.Item>
        );
      })}
    </HeroUIAccordion>
  );
}
