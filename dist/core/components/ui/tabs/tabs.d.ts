import { type NativeHapticsSetting } from "../utils";
import * as TabsPrimitive from "@rn-primitives/tabs";
import * as React from "react";
import type { TabsProps } from "./types";
declare function Tabs({ children, className, contentProps, items, listProps, nativeHaptics, triggerProps, ...props }: TabsProps): React.JSX.Element;
declare function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>): React.JSX.Element;
declare function TabsTrigger({ className, children, nativeHaptics, onPress, onPressIn, onPressOut, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
    nativeHaptics?: NativeHapticsSetting;
}): React.JSX.Element;
declare function TabsContent({ className, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>): React.JSX.Element;
declare const TabsComponent: typeof Tabs & {
    Content: typeof TabsContent;
    List: typeof TabsList;
    Root: typeof Tabs;
    Trigger: typeof TabsTrigger;
};
export { TabsComponent as Tabs };
