import { type ReactNode } from "react";
import type { ButtonProps, ButtonVariant } from "./types";
/** Only supply context to library Text / Icon; HeroUI still owns the button surface. */
export declare function buttonTextClass(variant: ButtonVariant, size: ButtonProps["size"], native?: boolean): string;
export declare function buttonChildren(children: ReactNode, label: (value: string | number) => ReactNode): (string | number | bigint | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | import("react").ReactPortal | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>)[] | null | undefined;
export declare function buttonDimensions(size: ButtonProps["buttonSize"]): {
    height?: number | undefined;
    width?: number | undefined;
} | undefined;
