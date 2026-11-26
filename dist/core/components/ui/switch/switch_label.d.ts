import type { ReactNode } from "react";
import type { SwitchProps } from "./types";
/** Only plain labels receive automatic text wrapping; custom layouts stay intact. */
export declare function SwitchLabel({ content, labelProps, labelClassName }: Pick<SwitchProps, "labelProps" | "labelClassName"> & {
    content: ReactNode;
}): bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | import("react").JSX.Element | null | undefined;
