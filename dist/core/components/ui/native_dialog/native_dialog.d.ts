import type { NativeDialogButton, NativeDialogOptions, NativeDialogRequest, NativeDialogResult } from "./types";
type NativeDialogHandler = (request: NativeDialogRequest) => void;
export declare function setNativeDialogHandler(handler: NativeDialogHandler | null): void;
export declare function getDefaultNativeDialogButtons(options: NativeDialogOptions): NativeDialogButton[];
export declare function getNativeDialogButtons(options: NativeDialogOptions): NativeDialogButton[];
export declare function runNativeDialogButton(button: NativeDialogButton): Promise<NativeDialogResult>;
export declare function confirmNative(options: NativeDialogOptions): Promise<NativeDialogResult>;
export {};
