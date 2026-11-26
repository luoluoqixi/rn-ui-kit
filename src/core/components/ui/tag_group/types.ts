import type { ComponentProps, ReactNode } from "react";
import type { TagGroup as NativeGroup } from "heroui-native/tag-group";
import type { TagGroup as WebGroup } from "@heroui/react/tag-group";
import type { Tag as WebTag } from "@heroui/react/tag";
import type { FieldSlotProps, FieldMetadata } from "../utils/field_types";
import type { KeySelectionOptions } from "../utils/key_selection";
import type { NativeHapticsSetting } from "../utils/haptics";
import type { RenderProp } from "../utils/render";
export type TagGroupItemContext = { id: string; isSelected: boolean; isDisabled: boolean };
export type TagGroupItem = FieldSlotProps<ComponentProps<typeof NativeGroup.Item>, ComponentProps<typeof WebTag>,
  "id" | "isDisabled" | "onPress" | "onAction" | "textValue" | "aria-label" | "accessibilityLabel"
> & {
  id: string;
  title: RenderProp<TagGroupItemContext>;
  /** Required for rich or dynamic labels. */
  textValue?: string;
  startContent?: RenderProp<TagGroupItemContext>;
  isDisabled?: boolean;
  labelClassName?: string;
};
export type TagGroupProps = KeySelectionOptions & Pick<FieldMetadata,
  "label" | "labelProps" | "labelClassName" | "description" | "descriptionClassName" | "errorMessage" | "errorMessageClassName"
> & FieldSlotProps<ComponentProps<typeof NativeGroup>, ComponentProps<typeof WebGroup>,
  keyof KeySelectionOptions | "size" | "variant" | "onRemove" | "isInvalid" | "isRequired" | "aria-label"
> & {
  items: readonly TagGroupItem[];
  size?: "sm" | "md" | "lg";
  variant?: "default" | "surface";
  isInvalid?: boolean;
  isRequired?: boolean;
  accessibilityLabel?: string;
  onRemove?: (keys: Set<string>) => void;
  emptyContent?: ReactNode;
  listClassName?: string;
  nativeHaptics?: NativeHapticsSetting;
};
