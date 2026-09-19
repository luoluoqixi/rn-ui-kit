import type { ComponentType } from "react";
export type ComponentExampleDefinition = {
    Component: ComponentType;
    description?: string;
    fullScreenBackGestureEnabled?: boolean;
    handlesHeaderInsets?: boolean;
    key: string;
    label: string;
    layout?: "fill" | "scroll";
};
