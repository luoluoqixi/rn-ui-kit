import type { NativeSheetStackProps, NativeSheetStackScreenProps } from "./types";
/** Common-platform placeholder. Metro selects `.native.tsx` or `.web.tsx`. */
declare function NativeSheetStackFallback(_props: NativeSheetStackProps): null;
declare function NativeSheetStackScreenFallback(_props: NativeSheetStackScreenProps): null;
export declare const NativeSheetStack: typeof NativeSheetStackFallback & {
    Screen: typeof NativeSheetStackScreenFallback;
};
export {};
