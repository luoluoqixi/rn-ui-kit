import type { ComponentProps, ReactNode } from "react";

import type * as AccordionPrimitive from "@rn-primitives/accordion";

import type { NativeHapticsSetting, RenderProp } from "../utils";

export type AccordionItemRenderer = (item: AccordionItemData) => ReactNode;

export interface AccordionItemData {
  "aria-label"?: string;
  "content": RenderProp<AccordionItemData>;
  "contentProps"?: AccordionContentProps;
  "disabled"?: boolean;
  "headerProps"?: AccordionHeaderProps;
  "itemProps"?: Omit<AccordionItemProps, "value">;
  "title": RenderProp<AccordionItemData>;
  "titleClassName"?: string;
  "triggerProps"?: Omit<AccordionTriggerProps, "children" | "headerProps">;
  "value": string;
}

export type AccordionItemProps = ComponentProps<typeof AccordionPrimitive.Item>;
export type AccordionHeaderProps = ComponentProps<typeof AccordionPrimitive.Header>;
export type AccordionTriggerProps = ComponentProps<typeof AccordionPrimitive.Trigger> & {
  headerProps?: AccordionHeaderProps;
};
export type AccordionContentProps = ComponentProps<typeof AccordionPrimitive.Content>;

type AccordionRootProps = Omit<
  ComponentProps<typeof AccordionPrimitive.Root>,
  "asChild" | "children"
>;

export type AccordionProps = AccordionRootProps & {
  children?: ReactNode;
  contentProps?: AccordionContentProps;
  contentClassName?: string;
  headerProps?: AccordionHeaderProps;
  itemProps?: Omit<AccordionItemProps, "value">;
  items?: AccordionItemData[];
  nativeHaptics?: NativeHapticsSetting;
  titleClassName?: string;
  triggerProps?: Omit<AccordionTriggerProps, "children" | "headerProps">;
};
