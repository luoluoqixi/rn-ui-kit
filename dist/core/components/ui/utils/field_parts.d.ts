import type { FieldMetadata } from "./field_types";
export type FieldMessagesProps = Pick<FieldMetadata, "description" | "descriptionProps" | "descriptionClassName" | "errorMessage" | "errorMessageProps" | "errorMessageClassName"> & {
    isInvalid?: boolean;
    descriptionID?: string;
    errorID?: string;
};
export declare function FieldMessages(props: FieldMessagesProps): import("react").JSX.Element;
