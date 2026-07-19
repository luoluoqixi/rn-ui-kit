declare function AccordionExample(): import("react").JSX.Element;
declare function SplitLayoutExample(): import("react").JSX.Element;
export declare const compositionExamples: ({
    Component: typeof AccordionExample;
    group: string;
    key: string;
    label: string;
    layout?: undefined;
} | {
    Component: typeof SplitLayoutExample;
    group: string;
    key: string;
    label: string;
    layout: "fill";
})[];
export {};
