import { type ReactNode } from "react";
import type { CardProps } from "./types";
/** React ignores booleans; numeric zero must still create its slot. */
export declare function hasCardContent(value: ReactNode): value is string | number | bigint | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | import("react").ReactPortal | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>;
/** Normalize only bare text, including fragments; custom elements remain intact. */
export declare function normalizeCardChildren(children: ReactNode): ReactNode;
export declare function resolveCardContent(props: CardProps): {
    header: ReactNode;
    title: ReactNode;
    description: ReactNode;
    customHeader: boolean;
    hasHeader: boolean;
    content: ReactNode;
    footer: ReactNode;
};
