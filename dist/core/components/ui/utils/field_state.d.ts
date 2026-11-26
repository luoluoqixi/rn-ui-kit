import { type Ref } from "react";
export declare function useFieldValue<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void): readonly [T, (next: T) => void];
export declare function useMergedRefs<T>(first: Ref<T> | undefined, second: Ref<T> | undefined): (node: T | null) => () => void;
