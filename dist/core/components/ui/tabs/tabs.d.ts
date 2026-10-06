import * as TabsPrimitive from "@rn-primitives/tabs";
import * as React from "react";
import type { TabsListProps, TabsProps, TabsTriggerProps } from "./types";
declare function Tabs({ children, className, contentProps, items, listProps, nativeHaptics, size, triggerProps, ...props }: TabsProps): React.JSX.Element;
declare function TabsList({ className, size, ...props }: TabsListProps): React.JSX.Element;
declare function TabsTrigger({ className, children, nativeHaptics, onPress, onPressIn, onPressOut, size, ...props }: TabsTriggerProps): React.JSX.Element;
declare function TabsContent({ className, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>): React.JSX.Element;
declare const TabsComponent: typeof Tabs & {
    Content: typeof TabsContent;
    List: typeof TabsList;
    Root: typeof Tabs;
    Trigger: typeof TabsTrigger;
};
export { TabsComponent as Tabs };
