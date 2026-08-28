import type { ComponentProps, ReactNode } from "react";
import type * as TabsPrimitive from "@rn-primitives/tabs";
import type { NativeHapticsSetting, RenderProp } from "../utils";
export type TabsItemData = {
    content: RenderProp<TabsItemData>;
    contentProps?: Omit<ComponentProps<typeof TabsPrimitive.Content>, "children" | "value">;
    disabled?: boolean;
    title: RenderProp<TabsItemData>;
    triggerProps?: Omit<ComponentProps<typeof TabsPrimitive.Trigger>, "children" | "value">;
    value: string;
};
export type TabsProps = Omit<ComponentProps<typeof TabsPrimitive.Root>, "children"> & {
    children?: ReactNode;
    contentProps?: Omit<ComponentProps<typeof TabsPrimitive.Content>, "children" | "value">;
    items?: TabsItemData[];
    listProps?: ComponentProps<typeof TabsPrimitive.List>;
    nativeHaptics?: NativeHapticsSetting;
    triggerProps?: Omit<ComponentProps<typeof TabsPrimitive.Trigger>, "children" | "value">;
};
