import type { AccordionSelectionProps } from "./types";
/** Both HeroUI implementations are controlled here, including an empty single value. */
export declare function useAccordionState(props: AccordionSelectionProps & {
    isCollapsible?: boolean;
    isDisabled?: boolean;
}): {
    values: string[];
    isMultiple: boolean;
    onValueChange: (value: string | string[] | undefined) => boolean;
};
export declare function validateAccordionItems(items: readonly {
    value: string;
}[]): void;
