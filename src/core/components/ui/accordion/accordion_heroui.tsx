import { Accordion as HeroUIAccordion } from "@heroui/react/accordion";
import { resolveAriaLabel } from "../utils/accessibility";
import { cn } from "../utils/cn";
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
    isCollapsible,
    isDisabled,
    children,
    herouiNativeProps,
    herouiWebProps,
    ...rootProps
  } = props;
  validateAccordionItems(items);

  return (
    <HeroUIAccordion
      {...herouiWebProps}
      {...rootProps}
      isDisabled={isDisabled}
      allowsMultipleExpanded={state.isMultiple}
      expandedKeys={new Set(state.values)}
      onExpandedChange={(keys) => state.onValueChange([...keys].map(String))}
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
        return (
          <HeroUIAccordion.Item
            {...itemProps?.herouiWebProps}
            {...item.itemProps?.herouiWebProps}
            key={item.value}
            id={item.value}
            isDisabled={itemDisabled}
            className={cn(itemProps?.className, item.itemProps?.className)}
          >
            <HeroUIAccordion.Heading
              {...headerProps?.herouiWebProps}
              {...item.headerProps?.herouiWebProps}
              className={cn(headerProps?.className, item.headerProps?.className)}
            >
              <HeroUIAccordion.Trigger
                {...triggerProps?.herouiWebProps}
                {...item.triggerProps?.herouiWebProps}
                onPress={item.triggerProps?.onPress ?? triggerProps?.onPress}
                isDisabled={itemDisabled}
                className={cn(triggerProps?.className, item.triggerProps?.className)}
                aria-label={resolveAriaLabel(
                  item["aria-label"] ??
                    item.triggerProps?.["aria-label"] ??
                    triggerProps?.["aria-label"],
                  title,
                )}
              >
                <span className="min-w-0 flex-1 text-start">
                  <AccordionText
                    className={cn(
                      "text-sm text-foreground font-medium",
                      titleClassName,
                      item.titleClassName,
                    )}
                  >
                    {title}
                  </AccordionText>
                </span>
                {indicatorProp === undefined ? (
                  <HeroUIAccordion.Indicator />
                ) : customIndicator != null && typeof customIndicator !== "boolean" ? (
                  <HeroUIAccordion.Indicator className="flex size-5 items-center justify-center data-[expanded=true]:rotate-0">
                    <span aria-hidden="true">
                      <AccordionText className="text-muted">{customIndicator}</AccordionText>
                    </span>
                  </HeroUIAccordion.Indicator>
                ) : null}
              </HeroUIAccordion.Trigger>
            </HeroUIAccordion.Heading>
            <HeroUIAccordion.Panel
              {...contentProps?.herouiWebProps}
              {...item.contentProps?.herouiWebProps}
            >
              <HeroUIAccordion.Body
                className={cn(
                  contentProps?.className,
                  contentClassName,
                  item.contentProps?.className,
                  item.contentClassName,
                )}
              >
                <AccordionText className="text-sm text-muted">
                  {resolveRenderProp(item.content, item)}
                </AccordionText>
              </HeroUIAccordion.Body>
            </HeroUIAccordion.Panel>
          </HeroUIAccordion.Item>
        );
      })}
    </HeroUIAccordion>
  );
}
