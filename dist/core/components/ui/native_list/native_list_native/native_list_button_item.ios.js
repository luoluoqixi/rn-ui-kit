import { jsx as _jsx } from "react/jsx-runtime";
import { useComponentThemeTokens as useTheme } from "../../utils/theme";
import { toSwiftUIHexColor } from "../../utils";
import { NativeListItem } from "./native_list_item.ios";
export function NativeListButtonItem({ title, onPress, disabled, titleAlign = "center", btnTint, ...itemProps }) {
    const theme = useTheme();
    const defaultColor = theme.accent10.val;
    const resolvedColor = typeof (btnTint ?? defaultColor) === "string"
        ? (toSwiftUIHexColor(btnTint ?? defaultColor) ?? false)
        : (btnTint ?? defaultColor);
    return (_jsx(NativeListItem, { ...itemProps, title: title, disabled: disabled, onPress: onPress, titleAlign: titleAlign, value: undefined, btnTint: resolvedColor }));
}
