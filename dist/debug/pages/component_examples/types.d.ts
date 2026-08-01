import type { ComponentType } from "react";
export type ComponentExampleLayout = "fill" | "scroll";
export type ComponentExampleDefinition = {
    Component: ComponentType;
    description?: string;
    fullScreenBackGestureEnabled?: boolean;
    group: string;
    key: string;
    label: string;
    layout?: ComponentExampleLayout;
};
