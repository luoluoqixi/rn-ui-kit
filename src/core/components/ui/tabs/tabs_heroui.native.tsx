import { Tabs } from "heroui-native/tabs";
import { Text } from "../text";
import { useDefaultTextStyle } from "../provider/font_provider";
import {
  triggerNativeHaptics,
  useResolvedNativeHaptics,
} from "../utils/haptics";
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
    accessibilityLabel,
    listProps,
    triggerProps,
    contentProps,
    indicatorProps,
    keepMounted,
    isScrollable,
    nativeHaptics,
    herouiNativeProps,
  } = props;
  const [value, setValue] = useTabsState(props);
  const haptics = useResolvedNativeHaptics(nativeHaptics, {
    defaultEnabled: true,
  });
  const font = useDefaultTextStyle();
  const triggers = (
    <>
      <Tabs.Indicator
        {...indicatorProps?.herouiNativeProps}
        className={indicatorProps?.className}
      />
      {items.map((item) => (
        <Tabs.Trigger
          {...triggerProps?.herouiNativeProps}
          {...item.triggerProps?.herouiNativeProps}
          value={item.value}
          key={item.value}
          isDisabled={isDisabled || item.isDisabled}
          className={cn(triggerProps?.className, item.triggerProps?.className)}
        >
          <Tabs.Label className={item.titleClassName} style={font}>
            {resolveRenderProp(item.title, {
              value: item.value,
              isSelected: value === item.value,
              isDisabled: !!(isDisabled || item.isDisabled),
            })}
          </Tabs.Label>
        </Tabs.Trigger>
      ))}
    </>
  );
  return (
    <Tabs
      {...herouiNativeProps}
      value={value}
      onValueChange={(next) => {
        if (
          isDisabled ||
          items.find((item) => item.value === next)?.isDisabled ||
          next === value
        )
          return;
        setValue(next);
        triggerNativeHaptics(haptics);
      }}
      variant={variant}
      className={className}
    >
      <Tabs.List
        {...listProps?.herouiNativeProps}
        className={listProps?.className}
        accessibilityLabel={accessibilityLabel}
      >
        {isScrollable ? (
          <Tabs.ScrollView>{triggers}</Tabs.ScrollView>
        ) : (
          triggers
        )}
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Content
          {...contentProps?.herouiNativeProps}
          {...item.contentProps?.herouiNativeProps}
          key={item.value}
          value={item.value}
          forceMount={keepMounted || undefined}
          className={cn(
            "pt-3",
            keepMounted && value !== item.value && "hidden",
            contentProps?.className,
            item.contentProps?.className,
          )}
        >
          {(() => {
            const content = resolveRenderProp(item.content, {
              value: item.value,
              isSelected: value === item.value,
              isDisabled: !!(isDisabled || item.isDisabled),
            });
            return typeof content === "string" ||
              typeof content === "number" ? (
              <Text>{content}</Text>
            ) : (
              content
            );
          })()}
        </Tabs.Content>
      ))}
    </Tabs>
  );
}
