import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from "react";
import { disabled as disabledModifier, frame, ios15ListRowTopRoundedBackground, padding, } from "@luoluoqixi/expo-ui-55/swift-ui/modifiers";
import { Button as SwiftButton, VStack } from "@luoluoqixi/expo-ui-55/swift-ui";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../../utils";
import { NativeHostedCustomRow, NativeRowContainer, Ios15FirstVisibleRowContext, ROW_INSETS, NativeSwiftUIContextMenu, resolveRowPadding, } from "../native_list_native.ios";
import { useResolvedNativeListContextMenu, useResolvedNativeListDisabledStyle, } from "../context_menu";
import { useNativeListEditRow } from "../edit_mode";
export function NativeListCustomItem({ backgroundColor: _backgroundColor, children, contextMenuProps, disabled, disabledStyle, hoverBackgroundColor: _hoverBackgroundColor, nativeHaptics, nativeScrollId, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, pressBackgroundColor: _pressBackgroundColor, selectionId, selectionDisabled, }) {
    void _backgroundColor;
    void _hoverBackgroundColor;
    void _pressBackgroundColor;
    const restoresIos15TopCorners = useContext(Ios15FirstVisibleRowContext);
    const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps);
    const resolvedDisabledStyle = useResolvedNativeListDisabledStyle(disabledStyle);
    const editRow = useNativeListEditRow({
        disabled,
        nativeScrollId,
        nativeSelection: true,
        onPress,
        selectionId,
        selectionDisabled,
    });
    const rowPaddingProps = {
        paddingBottom,
        paddingHorizontal,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingVertical,
    };
    const activeContextMenuProps = disabled || editRow.editMode || resolvedContextMenuProps?.triggerProps?.disabled
        ? undefined
        : resolvedContextMenuProps;
    const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
    if (editRow.editMode) {
        return (_jsx(NativeRowContainer, { ...rowPaddingProps, disabled: disabled, disabledStyle: resolvedDisabledStyle, nativeSelectionId: editRow.nativeSelection ? editRow.selectionId : undefined, nativeScrollId: nativeScrollId, onPress: editRow.onPress, children: _jsx(NativeHostedCustomRow, { disableInteractions: true, children: children }) }));
    }
    const customRow = (_jsx(NativeHostedCustomRow, { disabled: Boolean(disabled && resolvedDisabledStyle), disableInteractions: Boolean(disabled), children: children }));
    if (onPress != null && restoresIos15TopCorners) {
        const button = (_jsx(SwiftButton, { modifiers: [disabledModifier(disabled ?? false)], onPress: () => {
                onPress();
                triggerNativeHaptics(resolvedHaptics);
            }, children: _jsx(VStack, { modifiers: [
                    ROW_INSETS,
                    padding(resolveRowPadding(rowPaddingProps)),
                    frame({ maxWidth: 99999, alignment: "leading" }),
                    ios15ListRowTopRoundedBackground(),
                ], children: customRow }) }));
        return activeContextMenuProps?.items?.length ? (_jsx(NativeSwiftUIContextMenu, { contextMenuProps: activeContextMenuProps, children: button })) : (button);
    }
    const wrappedCustomRow = onPress == null ? (_jsx(VStack, { modifiers: [
            ROW_INSETS,
            disabledModifier(disabled ?? false),
            padding(resolveRowPadding(rowPaddingProps)),
            ...(restoresIos15TopCorners
                ? [frame({ maxWidth: 99999, alignment: "leading" }), ios15ListRowTopRoundedBackground()]
                : []),
        ], children: customRow })) : (_jsx(SwiftButton, { modifiers: [
            disabledModifier(disabled ?? false),
            ROW_INSETS,
            padding(resolveRowPadding(rowPaddingProps)),
        ], onPress: () => {
            onPress();
            triggerNativeHaptics(resolvedHaptics);
        }, children: customRow }));
    return activeContextMenuProps?.items?.length ? (_jsx(NativeSwiftUIContextMenu, { contextMenuProps: activeContextMenuProps, children: wrappedCustomRow })) : (wrappedCustomRow);
}
