import React from "react";
/** Web 端永不渲染（shouldRenderNativePicker 恒为 false） */
export declare const NativePickerDialog: React.FC<any>;
/** Web 端永不渲染（shouldRenderNativeIosPicker 恒为 false） */
export type NativePickerSwiftUIHandle = {
    open: () => void;
};
export declare const NativePickerSwiftUI: React.ForwardRefExoticComponent<Omit<any, "ref"> & React.RefAttributes<NativePickerSwiftUIHandle>>;
