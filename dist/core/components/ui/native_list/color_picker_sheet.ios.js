import { jsx as _jsx } from "react/jsx-runtime";
import { tint } from "@luoluoqixi/expo-ui-55/swift-ui/modifiers";
import { NativeListColorPickerSheet as NativeListColorPickerSheetBase } from "./color_picker_sheet.shared";
import { useUiTheme } from "../utils/theme";
export function NativeListColorPickerSheet(props) {
    const theme = useUiTheme();
    return (_jsx(NativeListColorPickerSheetBase, { ...props, nativeButtonSwiftProps: { modifiers: [tint(theme.primary)] } }));
}
