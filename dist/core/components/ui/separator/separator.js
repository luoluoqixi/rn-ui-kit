import { jsx as _jsx } from "react/jsx-runtime";
import { Separator as TamaguiSeparator } from "tamagui";
export function Separator(props) {
    if (!props.vertical) {
        return _jsx(TamaguiSeparator, { ...props, borderColor: props.borderColor ?? "$borderColor" });
    }
    const { borderColor = "$borderColor", borderRightWidth, height, maxH, maxW, width, x, ...restProps } = props;
    const lineWidth = 1;
    return (_jsx(TamaguiSeparator, { ...restProps, borderColor: borderColor, borderRightWidth: borderRightWidth ?? 1, height: height ?? "100%", maxH: maxH ?? "100%", maxW: maxW ?? lineWidth, width: width ?? lineWidth, x: x ?? 0 }));
}
