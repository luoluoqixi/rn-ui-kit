import { type ReactNode } from "react";
/** Bare strings/numbers need a Text boundary on Native; custom nodes stay intact. */
export declare function AccordionText({ children, className }: {
    children: ReactNode;
    className: string;
}): import("react").JSX.Element;
