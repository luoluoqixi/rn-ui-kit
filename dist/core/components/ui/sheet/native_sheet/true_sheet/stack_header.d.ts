import type { NativeSheetStackHeaderButtonProps } from "../types";
type CustomHeaderButtonOptions = {
    buttonProps?: NativeSheetStackHeaderButtonProps;
    defaultCloseSheetOnPress: boolean;
    defaultLabel: string;
    onRequestClose: () => void;
};
/** Android/Web Stack Header 使用的 React Button。 */
export declare function TrueSheetStackCustomHeaderButton({ buttonProps, defaultCloseSheetOnPress, defaultLabel, onRequestClose, }: CustomHeaderButtonOptions): import("react").JSX.Element;
export {};
