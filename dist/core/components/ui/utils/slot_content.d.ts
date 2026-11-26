import { type ReactNode } from "react";
export declare function hasSlotContent(value: ReactNode): value is string | number | bigint | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | import("react").ReactPortal | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>;
/** Normalize bare text in native View slots, preserving custom elements. */
export declare function normalizeSlotText(children: ReactNode): ReactNode;
