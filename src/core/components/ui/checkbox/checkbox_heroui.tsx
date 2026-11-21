import { Checkbox } from "@heroui/react/checkbox";
import { Text } from "../text";
import { FieldMessages } from "../utils/field_parts";
import { useFieldValue } from "../utils/field_state";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import type { CheckboxProps } from "./types";
export function CheckboxHeroUI({
  isSelected,
  defaultSelected = false,
  onSelectedChange,
  isDisabled = false,
  isInvalid = false,
  isRequired,
  variant,
  name,
  value,
  accessibilityLabel,
  label,
  description,
  labelClassName,
  labelPosition = "right",
  controlProps,
  indicatorProps,
  indicator,
  className,
  herouiWebProps,
  herouiNativeProps: _,
  nativeHaptics: _haptics,
  labelProps,
  ...messages
}: CheckboxProps) {
  const [selected, setSelected] = useFieldValue(
    isSelected,
    defaultSelected,
    onSelectedChange,
  );
  const context = { isSelected: selected, isDisabled, isInvalid };
  const control = (
    <Checkbox.Control
      {...controlProps?.herouiWebProps}
      className={controlProps?.className}
    >
      <Checkbox.Indicator
        {...indicatorProps?.herouiWebProps}
        className={indicatorProps?.className}
      >
        {indicator == null ? undefined : resolveRenderProp(indicator, context)}
      </Checkbox.Indicator>
    </Checkbox.Control>
  );
  return (
    <Checkbox
      {...herouiWebProps}
      name={name}
      value={value}
      isSelected={selected}
      onChange={(next) => {
        if (!isDisabled) setSelected(next);
      }}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isRequired={isRequired}
      variant={variant}
      className={className}
    >
      <Checkbox.Content
        aria-label={accessibilityLabel}
        className={cn(
          labelPosition === "left" && "flex-row-reverse justify-between",
        )}
      >
        {control}
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          {label != null && (
            <Text
              {...labelProps}
              className={cn(labelProps?.className, labelClassName)}
            >
              {resolveRenderProp(label, context)}
            </Text>
          )}
        </span>
      </Checkbox.Content>
      <FieldMessages
        {...messages}
        description={resolveRenderProp(description, context)}
        isInvalid={isInvalid}
      />
    </Checkbox>
  );
}
