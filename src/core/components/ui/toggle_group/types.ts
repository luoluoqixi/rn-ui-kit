import type { ComponentProps } from "react";
import type { ViewProps } from "react-native";
import type { ToggleButtonGroup as WebGroup } from "@heroui/react/toggle-button-group";
import type { ToggleProps } from "../toggle";
import type { FieldSlotProps } from "../utils/field_types";
import type { KeySelectionOptions } from "../utils/key_selection";
export type ToggleGroupItemData = Omit<ToggleProps, "isSelected" | "defaultSelected" | "onSelectedChange" | "size" | "variant"> & { id: string };
export type ToggleGroupProps = Omit<KeySelectionOptions, "selectionMode"> & FieldSlotProps<ViewProps, ComponentProps<typeof WebGroup>,
  keyof KeySelectionOptions | "size" | "variant" | "orientation" | "isDetached" | "fullWidth" | "aria-label"
> & {
  items: readonly ToggleGroupItemData[];
  selectionMode?: "single" | "multiple";
  size?: ToggleProps["size"];
  variant?: ToggleProps["variant"];
  orientation?: "horizontal" | "vertical";
  /** Space between items in logical pixels. Defaults to 0; takes precedence over isDetached. */
  gap?: number;
  /** Shorthand for gap=8 when gap is not provided. */
  isDetached?: boolean;
  /** Defaults to gap===0. An item's isScaleDisabled takes precedence. */
  isScaleDisabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel: string;
  nativeHaptics?: ToggleProps["nativeHaptics"];
};
