import type { FormProps, FormTriggerProps } from "./types";
declare function FormRoot(props: FormProps): import("react").JSX.Element;
declare function FormTrigger(props: FormTriggerProps): import("react").JSX.Element;
export declare const Form: typeof FormRoot & {
    Trigger: typeof FormTrigger;
};
export {};
