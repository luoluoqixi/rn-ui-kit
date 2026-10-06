import * as React from "react";
import type { CardContentProps, CardDescriptionProps, CardFooterProps, CardHeaderProps, CardProps, CardTitleProps } from "./types";
declare function Card({ className, children, content, contentClassName, contentProps, description, descriptionClassName, descriptionProps, footer, footerClassName, footerProps, header, headerClassName, headerProps, title, titleClassName, titleProps, ...props }: CardProps): React.JSX.Element;
declare function CardHeader({ className, ...props }: CardHeaderProps): React.JSX.Element;
declare function CardTitle({ className, ref, ...props }: CardTitleProps): React.JSX.Element;
declare function CardDescription({ className, ...props }: CardDescriptionProps): React.JSX.Element;
declare function CardContent({ className, ...props }: CardContentProps): React.JSX.Element;
declare function CardFooter({ className, ...props }: CardFooterProps): React.JSX.Element;
declare const CardComponent: typeof Card & {
    Content: typeof CardContent;
    Description: typeof CardDescription;
    Footer: typeof CardFooter;
    Header: typeof CardHeader;
    Root: typeof Card;
    Title: typeof CardTitle;
};
export { CardComponent as Card };
export type * from "./types";
