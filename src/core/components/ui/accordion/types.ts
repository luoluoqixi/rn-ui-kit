import type { Accordion as HeroUINativeAccordion } from "heroui-native/accordion";
import type { Accordion as HeroUIWebAccordion } from "@heroui/react/accordion";
import type { ComponentProps, Ref } from "react";
import type { View, ViewProps } from "react-native";
import type { NativeHapticsSetting } from "../utils/haptics";
import type { RenderProp } from "../utils/render";

// Type-only imports do not enter either platform's runtime module graph.
type NativeRoot = ComponentProps<typeof HeroUINativeAccordion>;
type WebRoot = ComponentProps<typeof HeroUIWebAccordion>;
type NativeTrigger = ComponentProps<typeof HeroUINativeAccordion.Trigger>;
type WebTrigger = ComponentProps<typeof HeroUIWebAccordion.Trigger>;

export type AccordionSelectionProps =
  | {
      selectionMode?: "single";
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string | undefined) => void;
    }
  | {
      selectionMode: "multiple";
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
    };

/** Shared callbacks receive the event of the running platform. */
export type AccordionPressEvent =
  | Parameters<NonNullable<NativeTrigger["onPress"]>>[0]
  | Parameters<NonNullable<WebTrigger["onPress"]>>[0];

export interface AccordionItemProps {
  className?: string;
  isDisabled?: boolean;
  herouiNativeProps?: Omit<
    ComponentProps<typeof HeroUINativeAccordion.Item>,
    "children" | "value" | "asChild" | "className" | "isDisabled"
  >;
  herouiWebProps?: Omit<
    ComponentProps<typeof HeroUIWebAccordion.Item>,
    | "children"
    | "id"
    | "isExpanded"
    | "defaultExpanded"
    | "onExpandedChange"
    | "className"
    | "isDisabled"
  >;
}

export interface AccordionHeaderProps {
  className?: string;
  /** Native Trigger owns its heading; these props style an optional surrounding View. */
  herouiNativeProps?: Omit<ViewProps, "children" | "className"> & { ref?: Ref<View> };
  herouiWebProps?: Omit<
    ComponentProps<typeof HeroUIWebAccordion.Heading>,
    "children" | "className"
  >;
}

export interface AccordionTriggerProps {
  "className"?: string;
  "isDisabled"?: boolean;
  "aria-label"?: string;
  "onPress"?: (event: AccordionPressEvent) => void;
  "herouiNativeProps"?: Omit<
    NativeTrigger,
    "children" | "asChild" | "className" | "isDisabled" | "onPress" | "aria-label"
  >;
  "herouiWebProps"?: Omit<
    WebTrigger,
    "children" | "slot" | "className" | "isDisabled" | "onPress" | "aria-label"
  >;
}

export interface AccordionContentProps {
  /** Native Content / Web Body: the padded content container. */
  className?: string;
  herouiNativeProps?: Omit<
    ComponentProps<typeof HeroUINativeAccordion.Content>,
    "children" | "asChild" | "forceMount" | "className"
  >;
  /** Web-specific props target the animated Panel, including its ref. */
  herouiWebProps?: Omit<ComponentProps<typeof HeroUIWebAccordion.Panel>, "children" | "className">;
}

export interface AccordionItemData {
  /** Nonempty unique key; the empty string is reserved for controlled closed state. */
  "value": string;
  "title": RenderProp<AccordionItemData>;
  "content": RenderProp<AccordionItemData>;
  "isDisabled"?: boolean;
  "aria-label"?: string;
  "titleClassName"?: string;
  "contentClassName"?: string;
  "itemProps"?: AccordionItemProps;
  "headerProps"?: AccordionHeaderProps;
  "triggerProps"?: AccordionTriggerProps;
  "contentProps"?: AccordionContentProps;
  /** undefined inherits the default indicator; null/false hides it. */
  "indicator"?: RenderProp<AccordionIndicatorContext>;
}

export interface AccordionIndicatorContext {
  item: AccordionItemData;
  isExpanded: boolean;
  isDisabled: boolean;
}

export type AccordionProps = AccordionSelectionProps & {
  /** The wrapper composes HeroUI's slots internally. */
  "items": readonly AccordionItemData[];
  "variant"?: "default" | "surface";
  "hideSeparator"?: boolean;
  "className"?: string;
  "aria-label"?: string;
  /** Defaults to true. In multiple mode false prevents closing expanded items. */
  "isCollapsible"?: boolean;
  "isDisabled"?: boolean;
  "nativeHaptics"?: NativeHapticsSetting;
  "titleClassName"?: string;
  "contentClassName"?: string;
  "itemProps"?: AccordionItemProps;
  "headerProps"?: AccordionHeaderProps;
  "triggerProps"?: AccordionTriggerProps;
  "contentProps"?: AccordionContentProps;
  /** Custom indicator content; callbacks share the wrapper's actual state. */
  "indicator"?: RenderProp<AccordionIndicatorContext>;
  /** Applied only on iOS/Android; native refs, styles and animation stay correctly typed. */
  "herouiNativeProps"?: Omit<
    NativeRoot,
    | "children"
    | "asChild"
    | "selectionMode"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "isCollapsible"
    | "isDisabled"
    | "variant"
    | "hideSeparator"
    | "className"
    | "aria-label"
  >;
  /** Applied only on Web; DOM refs, styles and React Aria options stay correctly typed. */
  "herouiWebProps"?: Omit<
    WebRoot,
    | "children"
    | "expandedKeys"
    | "defaultExpandedKeys"
    | "onExpandedChange"
    | "allowsMultipleExpanded"
    | "isDisabled"
    | "variant"
    | "hideSeparator"
    | "className"
    | "aria-label"
  >;
  "children"?: never;
};
