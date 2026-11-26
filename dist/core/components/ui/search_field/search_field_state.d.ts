import type { TextInputHandle, TextInputOptions } from "../utils/field_types";
import type { SearchFieldProps } from "./types";
export declare function useSearchFieldState(p: SearchFieldProps): {
    id: string;
    value: string;
    change: (next: string) => void;
    control: import("react").RefObject<TextInputHandle | null>;
    input: TextInputOptions;
    submit: (text?: string) => void;
    canClear: boolean;
};
