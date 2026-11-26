import { Checkbox } from "heroui-native/checkbox";
import { ControlField } from "heroui-native/control-field";
import { View } from "react-native";
import { Text } from "../text";
import { FieldMessages } from "../utils/field_parts";
import { useFieldValue } from "../utils/field_state";
import {
  triggerNativeHaptics,
  useResolvedNativeHaptics,
} from "../utils/haptics";
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
  accessibilityLabel,
  label,
  description,
  labelClassName,
  labelPosition = "right",
  controlProps,
  indicatorProps,
  indicator,
  className,
  herouiNativeProps,
  herouiWebProps: _,
  nativeHaptics,
  labelProps,
  name: _name,
  value: _value,
  ...messages
}: CheckboxProps) {
  const [selected, setSelected] = useFieldValue(
    isSelected,
    defaultSelected,
    onSelectedChange,
  );
  const haptics = useResolvedNativeHaptics(nativeHaptics, {
    defaultEnabled: true,
  });
  const context = { isSelected: selected, isDisabled, isInvalid };
  return (
    <ControlField
      {...herouiNativeProps}
      isSelected={selected}
      onSelectedChange={(next) => {
        if (!isDisabled) {
          setSelected(next);
          triggerNativeHaptics(haptics);
        }
      }}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isRequired={isRequired}
      accessible
      accessibilityRole="checkbox"
      accessibilityLabel={
        accessibilityLabel ?? (typeof label === "string" ? label : undefined)
      }
      accessibilityState={{ checked: selected, disabled: isDisabled }}
      className={cn(
        "flex-row items-center gap-3",
        labelPosition === "left" && "flex-row-reverse",
        className,
      )}
    >
      <ControlField.Indicator
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Checkbox
          {...controlProps?.herouiNativeProps}
          variant={variant}
          className={controlProps?.className}
        >
          {indicator != null || indicatorProps ? (
            <Checkbox.Indicator
              {...indicatorProps?.herouiNativeProps}
              className={indicatorProps?.className}
            >
              {indicator == null
                ? undefined
                : resolveRenderProp(indicator, context)}
            </Checkbox.Indicator>
          ) : undefined}
        </Checkbox>
      </ControlField.Indicator>
      <View className="min-w-0 flex-1 gap-1">
        {label != null && (
          <Text
            {...labelProps}
            className={cn(labelProps?.className, labelClassName)}
          >
            {resolveRenderProp(label, context)}
          </Text>
        )}
        <FieldMessages
          {...messages}
          description={resolveRenderProp(description, context)}
          isInvalid={isInvalid}
        />
      </View>
    </ControlField>
  );
}
