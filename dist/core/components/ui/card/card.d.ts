import type { CardBackgroundProps, CardFooterProps, CardHeaderProps, CardProps } from "./types";
declare function CardRoot(props: CardProps): import("react").JSX.Element;
declare function CardHeader(props: CardHeaderProps): import("react").JSX.Element;
declare function CardFooter(props: CardFooterProps): import("react").JSX.Element;
declare function CardBackground(props: CardBackgroundProps): import("react").JSX.Element;
export declare const Card: typeof CardRoot & {
    Header: typeof CardHeader;
    Footer: typeof CardFooter;
    Background: typeof CardBackground;
};
export {};
