import { RadioGroup } from "@heroui/react/radio-group";
import { Radio } from "@heroui/react/radio";
import { Label } from "../label";
import { Text } from "../text";
import { FieldMessages } from "../utils/field_parts";
import { useFieldValue } from "../utils/field_state";
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
  name,
  accessibilityLabel,
  nativeHaptics: _,
  label,
  labelProps,
  labelClassName,
  className,
  herouiWebProps,
  herouiNativeProps: _native,
  ...messages
}: RadioGroupProps) {
  const [selected, setSelected] = useFieldValue(
    value,
    defaultValue ?? "",
    onValueChange,
  );
  return (
    <RadioGroup
      {...herouiWebProps}
      name={name}
      value={selected}
      onChange={(next) => {
        if (
          !isDisabled &&
          !(
            items.find((item) => item.value === next)?.isDisabled ??
            itemProps?.isDisabled
          )
        )
          setSelected(next);
      }}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isRequired={isRequired}
      variant={variant}
      orientation={orientation}
      aria-label={accessibilityLabel}
      className={className}
    >
      {label != null && (
        <Label
          {...labelProps}
          className={cn(labelProps?.className, labelClassName)}
          isRequired={isRequired}
          isInvalid={isInvalid}
          isDisabled={isDisabled}
        >
          {label}
        </Label>
      )}
      <div
        className={cn(
          "flex gap-3",
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
            <Radio
              {...item.herouiWebProps}
              key={item.value}
              value={item.value}
              isDisabled={context.isDisabled}
              className={item.className}
            >
              <Radio.Content
                aria-label={item.accessibilityLabel}
                className={cn(
                  (item.labelPosition ?? labelPosition) === "left" &&
                    "flex-row-reverse justify-between",
                )}
              >
                <Radio.Control
                  {...item.indicatorProps?.herouiWebProps}
                  className={item.indicatorProps?.className}
                >
                  <Radio.Indicator>
                    {item.indicator == null
                      ? undefined
                      : resolveRenderProp(item.indicator, context)}
                  </Radio.Indicator>
                </Radio.Control>
                <span className="flex min-w-0 flex-col gap-1">
                  <Text className={item.labelClassName}>
                    {resolveRenderProp(item.label, context)}
                  </Text>
                </span>
              </Radio.Content>
              <FieldMessages
                description={resolveRenderProp(item.description, context)}
                descriptionClassName={item.descriptionClassName}
              />
            </Radio>
          );
        })}
      </div>
      <FieldMessages {...messages} isInvalid={isInvalid} />
    </RadioGroup>
  );
}
