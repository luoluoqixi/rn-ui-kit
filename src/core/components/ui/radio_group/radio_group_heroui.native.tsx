import { RadioGroup } from "heroui-native/radio-group";
import { Radio } from "heroui-native/radio";
import { View } from "react-native";
import { useId } from "react";
import { Text } from "../text";
import { Label } from "../label";
import { FieldMessages } from "../utils/field_parts";
import { useFieldValue } from "../utils/field_state";
import {
  triggerNativeHaptics,
  useResolvedNativeHaptics,
} from "../utils/haptics";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import type { RadioGroupProps } from "./types";
export function RadioGroupHeroUI({
  items,
  itemProps,
  value,
  defaultValue,
  onValueChange,
  isDisabled = false,
  isInvalid = false,
  isRequired,
  variant,
  orientation = "vertical",
  labelPosition = "right",
  name: _name,
  accessibilityLabel,
  nativeHaptics,
  label,
  labelProps,
  labelClassName,
  className,
  herouiNativeProps,
  herouiWebProps: _,
  ...messages
}: RadioGroupProps) {
  const [selected, setSelected] = useFieldValue(
    value,
    defaultValue ?? "",
    onValueChange,
  );
  const haptics = useResolvedNativeHaptics(nativeHaptics, {
    defaultEnabled: true,
  });
  const labelID = useId();
  return (
    <RadioGroup
      {...herouiNativeProps}
      value={selected}
      onValueChange={(next) => {
        const item = items.find((item) => item.value === next);
        if (
          isDisabled ||
          (item?.isDisabled ?? itemProps?.isDisabled) ||
          selected === next
        )
          return;
        setSelected(next);
        triggerNativeHaptics(haptics);
      }}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      variant={variant}
      accessibilityLabel={
        accessibilityLabel ?? (typeof label === "string" ? label : undefined)
      }
      aria-labelledby={label != null ? labelID : undefined}
      className={className}
    >
      {label != null && (
        <Label
          {...labelProps}
          nativeID={labelID}
          isRequired={isRequired}
          isInvalid={isInvalid}
          isDisabled={isDisabled}
          className={cn(labelProps?.className, labelClassName)}
        >
          {label}
        </Label>
      )}
      <View
        className={cn(
          "gap-3",
          orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col",
        )}
      >
        {items.map((data) => {
          const item = { ...itemProps, ...data };
          const context = {
            value: item.value,
            isSelected: selected === item.value,
            isDisabled: isDisabled || !!item.isDisabled,
            isInvalid,
          };
          return (
            <RadioGroup.Item
              {...item.herouiNativeProps}
              key={item.value}
              value={item.value}
              isDisabled={context.isDisabled}
              isInvalid={isInvalid}
              accessibilityLabel={
                item.accessibilityLabel ??
                (typeof item.label === "string" ? item.label : undefined)
              }
              className={cn(
                "flex-row items-center gap-3",
                (item.labelPosition ?? labelPosition) === "left" &&
                  "flex-row-reverse",
                item.className,
              )}
            >
              <View
                pointerEvents="none"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <Radio>
                  {item.indicator != null || item.indicatorProps ? (
                    <Radio.Indicator
                      {...item.indicatorProps?.herouiNativeProps}
                      className={item.indicatorProps?.className}
                    >
                      {item.indicator == null
                        ? undefined
                        : resolveRenderProp(item.indicator, context)}
                    </Radio.Indicator>
                  ) : undefined}
                </Radio>
              </View>
              <View className={cn("min-w-0 gap-1", orientation === "horizontal" ? "shrink" : "flex-1")}>
                <Text className={item.labelClassName}>
                  {resolveRenderProp(item.label, context)}
                </Text>
                <FieldMessages
                  description={resolveRenderProp(item.description, context)}
                  descriptionClassName={item.descriptionClassName}
                />
              </View>
            </RadioGroup.Item>
          );
        })}
      </View>
      <FieldMessages {...messages} isInvalid={isInvalid} />
    </RadioGroup>
  );
}
