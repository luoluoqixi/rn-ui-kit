import type { NativeListBasicPressFeedback, NativeListIosPressFeedback } from "../core/components/ui/native_list";
declare function setIosPressFeedback(next: NativeListIosPressFeedback): void;
declare function setBasicPressFeedback(next: NativeListBasicPressFeedback): void;
export declare function useDebugNativeListSettings(): {
    setBasicPressFeedback: typeof setBasicPressFeedback;
    setIosPressFeedback: typeof setIosPressFeedback;
    iosPressFeedback: NativeListIosPressFeedback;
    basicPressFeedback: NativeListBasicPressFeedback;
};
export {};
