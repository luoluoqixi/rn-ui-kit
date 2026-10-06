import type { NativeStackHeaderItemButton } from "@react-navigation/native-stack";
import type { NativeSheetStackHeaderButtonProps } from "../types";
export type TrueSheetStackHeaderButtonOptions = {
    buttonProps?: NativeSheetStackHeaderButtonProps;
    defaultCloseSheetOnPress: boolean;
    defaultLabel: string;
    headerTintColor?: string;
    onRequestClose: () => void;
};
export declare function shouldTrueSheetStackHeaderButtonClose(buttonProps: NativeSheetStackHeaderButtonProps | undefined, defaultCloseSheetOnPress: boolean): boolean;
/** 将跨平台单按钮配置转换为 iOS Native Stack 的真正原生 button item。 */
export declare function createTrueSheetStackNativeHeaderButton({ buttonProps, defaultCloseSheetOnPress, defaultLabel, headerTintColor, onRequestClose, }: TrueSheetStackHeaderButtonOptions): NativeStackHeaderItemButton;
