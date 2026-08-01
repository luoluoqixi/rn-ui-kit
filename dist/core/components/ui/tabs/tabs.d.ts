import type { TabsContentProps, TabsListProps, TabsProps, TabsTabProps } from "./types";
declare function TabsRoot(props: TabsProps): import("react").JSX.Element;
declare function TabsList(props: TabsListProps): import("react").JSX.Element;
declare function TabsTab(props: TabsTabProps): import("react").JSX.Element;
declare function TabsContent(props: TabsContentProps): import("react").JSX.Element;
export declare const Tabs: typeof TabsRoot & {
    List: typeof TabsList;
    Tab: typeof TabsTab;
    Content: typeof TabsContent;
};
export {};
