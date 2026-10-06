import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { BrightnessSlider, ColorPicker, HueSlider, Panel1, Preview } from "../color_picker";
import { Button } from "../button";
import { NativeSheet, NativeSheetScrollContent } from "../sheet/native_sheet";
import { Text } from "../text";
import { isIos, isIos26Plus } from "../utils/platform";
const DEFAULT_PICKER_HEIGHT = 480;
export function NativeListColorPickerSheet({ color, colorPickerProps, confirmOnDone = true, onColorChange, open, onOpenChange, pickerHeight = DEFAULT_PICKER_HEIGHT, sheetProps, nativeButtonSwiftProps, }) {
    const { height: windowHeight } = useWindowDimensions();
    const usesIos26GlassButtons = isIos26Plus();
    const [draftColor, setDraftColor] = React.useState(color);
    // Keep the detent stable throughout presentation and dismissal. Measuring the
    // picker after the sheet mounts causes Android BottomSheet to reconfigure its
    // behavior mid-animation, which can briefly expand it to the largest height.
    const sheetChromeExtraHeight = confirmOnDone ? (usesIos26GlassButtons ? 48 : 40) : 32;
    const detent = Math.min(1, Math.max(0.25, (pickerHeight + sheetChromeExtraHeight) / Math.max(1, windowHeight)));
    const resolvedDetents = React.useMemo(() => [detent], [detent]);
    const resolvedScrollableOptions = React.useMemo(() => ({ ...sheetProps?.scrollableOptions, scrollingExpandsSheet: false }), [sheetProps?.scrollableOptions]);
    const handleChange = React.useCallback((colors) => {
        colorPickerProps?.onChangeJS?.(colors);
        setDraftColor(colors.hex);
        if (!confirmOnDone)
            onColorChange?.(colors.hex);
    }, [colorPickerProps, confirmOnDone, onColorChange]);
    const handleComplete = React.useCallback((colors) => colorPickerProps?.onCompleteJS?.(colors), [colorPickerProps]);
    React.useEffect(() => {
        if (open)
            setDraftColor(color);
    }, [color, open]);
    const cancel = React.useCallback(() => onOpenChange(false), [onOpenChange]);
    const done = React.useCallback(() => {
        if (confirmOnDone && draftColor !== color)
            onColorChange?.(draftColor);
        onOpenChange(false);
    }, [color, confirmOnDone, draftColor, onColorChange, onOpenChange]);
    return (_jsx(NativeSheet, { ...sheetProps, detents: resolvedDetents, grabber: sheetProps?.grabber ?? !confirmOnDone, open: open, scrollable: true, scrollableOptions: resolvedScrollableOptions, onOpenChange: onOpenChange, children: _jsxs(View, { style: { flex: 1, minHeight: 0, width: "100%" }, children: [confirmOnDone ? (_jsxs(View, { style: {
                        alignItems: "center",
                        flexDirection: "row",
                        height: usesIos26GlassButtons ? 72 : 60,
                        justifyContent: "space-between",
                        paddingHorizontal: 16,
                    }, children: [_jsx(Button, { buttonSize: { height: 40, width: isIos() ? 65 : 80 }, native: isIos(), nativeButtonStyle: usesIos26GlassButtons ? "glass" : "automatic", nativeSwiftProps: nativeButtonSwiftProps, title: "\u53D6\u6D88", variant: "ghost", onPress: cancel }), _jsx(Text, { className: "text-base font-semibold", children: "\u9009\u62E9\u989C\u8272" }), _jsx(Button, { buttonSize: { height: 40, width: isIos() ? (isIos26Plus() ? 60 : 65) : 80 }, native: isIos(), nativeButtonStyle: usesIos26GlassButtons ? "glass" : "automatic", nativeSwiftProps: nativeButtonSwiftProps, title: "\u5B8C\u6210", onPress: done, variant: "ghost" })] })) : null, _jsx(NativeSheetScrollContent, { contentContainerStyle: { paddingBottom: 24, paddingHorizontal: 16, paddingTop: 0 }, style: { flex: 1, minHeight: 0 }, children: _jsx(View, { style: { width: "100%" }, children: _jsx(ColorPicker, { ...colorPickerProps, value: draftColor, onChangeJS: handleChange, onCompleteJS: handleComplete, style: [{ gap: 16, width: "100%" }, colorPickerProps?.style], children: colorPickerProps?.children ?? (_jsxs(_Fragment, { children: [_jsx(Preview, { style: { height: 44, width: "100%" } }), _jsx(Panel1, { style: { height: 240, width: "100%" } }), _jsx(HueSlider, {}), _jsx(BrightnessSlider, {})] })) }) }) })] }) }));
}
