import type { ChipProps } from "./types";
export declare function resolveChipContent(props: ChipProps): {
    textClass: string;
    label: import("react").ReactNode;
    start: string | number | bigint | boolean | Iterable<import("react").ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | null | undefined> | import("react").JSX.Element | null | undefined;
    end: import("react").ReactNode;
    size: import("./types").ChipSize;
    variant: import("./types").ChipVariant;
    color: import("./types").ChipColor;
    icon?: import("lucide-react-native").LucideIcon;
};
