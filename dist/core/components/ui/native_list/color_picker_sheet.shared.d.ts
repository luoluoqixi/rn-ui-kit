import * as React from "react";
import type { ButtonProps } from "../button";
import type { NativeListColorPickerItemProps } from "./types";
export type NativeListColorPickerSheetProps = Pick<NativeListColorPickerItemProps, "color" | "colorPickerProps" | "confirmOnDone" | "onColorChange" | "pickerHeight" | "sheetProps"> & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};
export declare function NativeListColorPickerSheet({ color, colorPickerProps, confirmOnDone, onColorChange, open, onOpenChange, pickerHeight, sheetProps, nativeButtonSwiftProps, }: Pick<NativeListColorPickerItemProps, "color" | "colorPickerProps" | "confirmOnDone" | "onColorChange" | "pickerHeight" | "sheetProps"> & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nativeButtonSwiftProps?: ButtonProps["nativeSwiftProps"];
}): React.JSX.Element;
