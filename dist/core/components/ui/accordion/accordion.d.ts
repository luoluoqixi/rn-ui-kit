import type { AccordionContentProps, AccordionHeaderProps, AccordionHeightAnimatorProps, AccordionItemProps, AccordionProps, AccordionTriggerProps } from "./types";
declare function AccordionRoot(props: AccordionProps): import("react").JSX.Element;
declare function AccordionTrigger(props: AccordionTriggerProps): import("react").JSX.Element;
declare function AccordionHeader(props: AccordionHeaderProps): import("react").JSX.Element;
declare function AccordionContent(props: AccordionContentProps): import("react").JSX.Element;
declare function AccordionHeightAnimator(props: AccordionHeightAnimatorProps): import("react").JSX.Element;
declare function AccordionItem(props: AccordionItemProps): import("react").JSX.Element;
export declare const Accordion: typeof AccordionRoot & {
    Trigger: typeof AccordionTrigger;
    Header: typeof AccordionHeader;
    Content: typeof AccordionContent;
    HeightAnimator: typeof AccordionHeightAnimator;
    Item: typeof AccordionItem;
};
export {};
