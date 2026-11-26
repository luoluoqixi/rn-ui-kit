import { type ReactNode } from "react";
export type OverlayScopedPortalProps = {
    active?: boolean;
    children?: ReactNode;
    hostName?: string;
    name?: string;
};
export declare function OverlayScopedPortal({ active, children, hostName, name, }: OverlayScopedPortalProps): import("react").JSX.Element | null;
