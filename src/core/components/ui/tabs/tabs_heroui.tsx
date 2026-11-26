import { Tabs } from "@heroui/react/tabs";
import { Text } from "../text";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import { useTabsState } from "./tabs_state";
import type { TabsProps } from "./types";
export function TabsHeroUI(props: TabsProps) {
  const {
    items,
    className,
    variant,
    isDisabled,
    accessibilityLabel = "选项卡",
    listProps,
    triggerProps,
    contentProps,
    indicatorProps,
    keepMounted,
    isScrollable,
    herouiWebProps,
  } = props;
  const [value, setValue] = useTabsState(props);
  const font = useDefaultTextStyle();
  return (
    <Tabs
      {...herouiWebProps}
      selectedKey={value}
      onSelectionChange={(key) => setValue(String(key))}
      isDisabled={isDisabled}
      variant={variant}
      className={className}
    >
      <Tabs.ListContainer
        className={cn(isScrollable && "max-w-full overflow-x-auto")}
      >
        <Tabs.List
          {...listProps?.herouiWebProps}
          className={listProps?.className}
          aria-label={accessibilityLabel}
        >
          {items.map((item) => {
            const trigger = {
              ...triggerProps?.herouiWebProps,
              ...item.triggerProps?.herouiWebProps,
            };
            const context = {
              value: item.value,
              isSelected: value === item.value,
              isDisabled: !!(isDisabled || item.isDisabled),
            };
            const webStyle = trigger.style;
            return (
              <Tabs.Tab
                {...trigger}
                key={item.value}
                id={item.value}
                isDisabled={context.isDisabled}
                className={cn(
                  triggerProps?.className,
                  item.triggerProps?.className,
                )}
                style={
                  typeof webStyle === "function"
                    ? (state) => ({ ...textWebStyle(font), ...webStyle(state) })
                    : { ...textWebStyle(font), ...webStyle }
                }
              >
                <Text
                  className={cn(
                    "text-inherit text-sm font-medium leading-none",
                    item.titleClassName,
                  )}
                >
                  {resolveRenderProp(item.title, context)}
                </Text>
                <Tabs.Indicator
                  {...indicatorProps?.herouiWebProps}
                  className={indicatorProps?.className}
                />
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
      </Tabs.ListContainer>
      {items.map((item) => (
        <Tabs.Panel
          {...contentProps?.herouiWebProps}
          {...item.contentProps?.herouiWebProps}
          key={item.value}
          id={item.value}
          shouldForceMount={keepMounted}
          className={cn(
            "pt-3",
            keepMounted && value !== item.value && "hidden",
            contentProps?.className,
            item.contentProps?.className,
          )}
        >
          {resolveRenderProp(item.content, {
            value: item.value,
            isSelected: value === item.value,
            isDisabled: !!(isDisabled || item.isDisabled),
          })}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
