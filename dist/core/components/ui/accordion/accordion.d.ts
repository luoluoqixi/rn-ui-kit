import type { AccordionContentProps, AccordionItemProps, AccordionProps, AccordionTriggerProps } from "./types";
declare function Accordion({ children, contentClassName, contentProps, headerProps, itemProps, items, nativeHaptics, titleClassName, ref, triggerProps, onValueChange, ...props }: AccordionProps): import("react").JSX.Element;
declare function AccordionItem({ children, className, value, ...props }: AccordionItemProps): import("react").JSX.Element;
declare function AccordionTrigger({ className, children, headerProps, onPressIn, onPressOut, ...props }: AccordionTriggerProps): import("react").JSX.Element;
declare function AccordionContent({ className, children, ...props }: AccordionContentProps): import("react").JSX.Element;
declare const AccordionComponent: typeof Accordion & {
    Content: typeof AccordionContent;
    Item: typeof AccordionItem;
    Root: typeof Accordion;
    Trigger: typeof AccordionTrigger;
};
export { AccordionComponent as Accordion };
