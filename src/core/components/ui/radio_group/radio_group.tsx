import { Text } from "../text";
import { cn } from "../utils/cn";
import {
  triggerNativeHaptics,
  useResolvedNativeHaptics,
  type NativeHapticsSetting,
} from "../utils";
import { resolveRenderProp } from "../utils/render";
import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import * as React from "react";
import { Platform, Pressable, View, type GestureResponderEvent } from "react-native";
import type { RenderProp } from "../utils";
import type {
  RadioGroupItemData,
  RadioGroupItemProps,
  RadioGroupItemRenderContext,
  RadioGroupProps,
} from "./types";

type RadioGroupInteraction = {
  disabled: boolean;
  onValueChange: (value: string) => void;
  value: string | undefined;
};

const RadioGroupHapticsContext = React.createContext<NativeHapticsSetting | undefined>(undefined);
const RadioGroupInteractionContext = React.createContext<RadioGroupInteraction | null>(null);

function RadioGroup({
  className,
  nativeHaptics,
  children,
  defaultValue,
  items,
  itemProps,
  labelPosition,
  onValueChange,
  value,
  disabled = false,
  ...props
}: RadioGroupProps) {
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
    defaultEnabled: true,
  });
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const resolvedValue = value ?? uncontrolledValue;
  const handleValueChange = (nextValue: string) => {
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };
  const generatedChildren =
    children ??
    items?.map((item) => (
      <RadioGroupItem
        {...itemProps}
        {...item.itemProps}
        aria-label={item["aria-label"] ?? itemProps?.["aria-label"]}
        description={item.description}
        descriptionClassName={
          item.descriptionClassName ??
          item.itemProps?.descriptionClassName ??
          itemProps?.descriptionClassName
        }
        disabled={item.disabled ?? item.itemProps?.disabled ?? itemProps?.disabled}
        key={item.value}
        label={item.label}
        labelClassName={
          item.labelClassName ?? item.itemProps?.labelClassName ?? itemProps?.labelClassName
        }
        labelPosition={
          item.labelPosition ??
          item.itemProps?.labelPosition ??
          labelPosition ??
          itemProps?.labelPosition
        }
        value={item.value}
      />
    ));

  return (
    <RadioGroupHapticsContext.Provider value={resolvedNativeHaptics}>
      <RadioGroupInteractionContext.Provider
        value={{
          disabled,
          onValueChange: handleValueChange,
          value: resolvedValue,
        }}
      >
        <RadioGroupPrimitive.Root
          {...props}
          className={cn("gap-3", className)}
          disabled={disabled}
          onValueChange={handleValueChange}
          value={resolvedValue}
        >
          {generatedChildren}
        </RadioGroupPrimitive.Root>
      </RadioGroupInteractionContext.Provider>
    </RadioGroupHapticsContext.Provider>
  );
}

function RadioGroupItem({
  className,
  description,
  descriptionClassName,
  indicatorClassName,
  indicatorProps,
  label,
  labelClassName,
  labelPosition = "right",
  nativeHaptics,
  containerClassName,
  onPress,
  onPressIn,
  onPressOut,
  value,
  disabled,
  ...props
}: RadioGroupItemProps) {
  const groupNativeHaptics = React.useContext(RadioGroupHapticsContext);
  const interaction = React.useContext(RadioGroupInteractionContext);
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics ?? groupNativeHaptics);
  const hasContainer = label != null || description != null;
  const checked = interaction?.value === value;
  const resolvedDisabled = disabled || interaction?.disabled;
  const [isPressed, setIsPressed] = React.useState(false);
  const renderContext: RadioGroupItemRenderContext = {
    checked: checked === true,
    disabled: resolvedDisabled,
    value,
  };
  const renderedLabel = resolveRenderProp(label, renderContext);
  const renderedDescription = resolveRenderProp(description, renderContext);

  const normalizeText = (valueToNormalize: React.ReactNode, classNameToUse: string) =>
    React.Children.map(valueToNormalize, (child) =>
      typeof child === "string" || typeof child === "number" ? (
        <Text className={classNameToUse}>{child}</Text>
      ) : (
        child
      ),
    );

  if (hasContainer) {
    const handleContainerPress = (event: GestureResponderEvent) => {
      onPress?.(event);
      if (event.defaultPrevented || resolvedDisabled || interaction == null) {
        return;
      }
      interaction.onValueChange(value);
      triggerNativeHaptics(resolvedNativeHaptics);
    };

    return (
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{
          checked: checked === true,
          disabled: resolvedDisabled,
        }}
        className={cn(
          "group flex-row gap-3",
          renderedDescription != null ? "items-start self-start" : "items-center self-start",
          labelPosition === "left" && "flex-row-reverse",
          resolvedDisabled && "opacity-50",
          containerClassName,
        )}
        disabled={resolvedDisabled}
        onPress={handleContainerPress}
        onPressIn={(event) => {
          setIsPressed(true);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          setIsPressed(false);
          onPressOut?.(event);
        }}
      >
        <RadioGroupPrimitive.Item
          {...props}
          aria-label={props["aria-label"]}
          className={cn(
            "border-input dark:bg-input/30 aspect-square size-4 shrink-0 items-center justify-center rounded-full border shadow-sm shadow-black/5",
            isPressed && "opacity-70",
            Platform.select({
              web: "group-hover:opacity-80 group-active:opacity-70",
              native: "overflow-hidden",
            }),
            renderedDescription != null && "mt-0.5",
            checked && "border-primary",
            resolvedDisabled && "opacity-50",
            className,
          )}
          style={isPressed && !resolvedDisabled ? { opacity: 0.7 } : props.style}
          disabled={resolvedDisabled}
          pointerEvents="none"
          accessible={false}
          value={value}
          onPress={() => undefined}
        >
          <RadioGroupPrimitive.Indicator
            {...indicatorProps}
            className={cn(
              "bg-primary size-2 rounded-full",
              indicatorClassName,
              indicatorProps?.className,
            )}
          />
        </RadioGroupPrimitive.Item>
        <View className="min-w-0 justify-center gap-1">
          {normalizeText(
            renderedLabel,
            cn("text-sm font-medium", Platform.select({ web: "leading-none" }), labelClassName),
          )}
          {normalizeText(
            renderedDescription,
            cn("text-muted-foreground text-sm", descriptionClassName),
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <RadioGroupPrimitive.Item
      {...props}
      className={cn(
        "border-input dark:bg-input/30 aspect-square size-4 shrink-0 items-center justify-center rounded-full border shadow-sm shadow-black/5",
        Platform.select({
          web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed hover:opacity-80 active:opacity-70",
        }),
        isPressed && "opacity-70",
        resolvedDisabled && "opacity-50",
        className,
      )}
      style={isPressed && !resolvedDisabled ? { opacity: 0.7 } : props.style}
      disabled={resolvedDisabled}
      onPress={(event) => {
        onPress?.(event);
        if (!event.defaultPrevented) triggerNativeHaptics(resolvedNativeHaptics);
      }}
      onPressIn={(event) => {
        setIsPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setIsPressed(false);
        onPressOut?.(event);
      }}
      value={value}
    >
      <RadioGroupPrimitive.Indicator
        {...indicatorProps}
        className={cn(
          "bg-primary size-2 rounded-full",
          indicatorClassName,
          indicatorProps?.className,
        )}
      />
    </RadioGroupPrimitive.Item>
  );
}

const RadioGroupComponent = Object.assign(RadioGroup, {
  Item: RadioGroupItem,
  Root: RadioGroup,
});

export { RadioGroupComponent as RadioGroup };
