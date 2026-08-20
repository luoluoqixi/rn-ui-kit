import type { SwitchProps, SwitchThumbProps } from "./types";
declare function SwitchRoot(props: SwitchProps): import("react").JSX.Element;
declare function SwitchThumb(props: SwitchThumbProps): import("react").JSX.Element;
export declare const Switch: typeof SwitchRoot & {
    Thumb: typeof SwitchThumb;
};
export {};
