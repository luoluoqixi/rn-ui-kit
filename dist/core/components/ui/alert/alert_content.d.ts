import type { AlertProps } from "./types";
export declare const alertStatusText: {
    default: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
};
export declare function resolveAlertContent(props: AlertProps): {
    status: import("./types").AlertStatus;
    indicator: string | number | bigint | boolean | Iterable<import("react").ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | null | undefined> | import("react").JSX.Element | null | undefined;
    showIndicator: boolean;
    title: import("react").ReactNode;
    description: import("react").ReactNode;
    content: import("react").ReactNode;
    action: import("react").ReactNode;
};
