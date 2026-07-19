import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { YStack } from "@tamagui/stacks";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { SheetProvider } from "./SheetContext";
import { useSheetOpenState } from "./useSheetOpenState";
import { useSheetProviderProps } from "./useSheetProviderProps";
const nativeSheets = {
    ios: null,
};
export function getNativeSheet(platform) {
    return nativeSheets[platform];
}
export function setupNativeSheet(platform, RNIOSModal) {
    const { ModalSheetView, ModalSheetViewMainContent } = RNIOSModal;
    if (platform === "ios") {
        nativeSheets[platform] = (props) => {
            const state = useSheetOpenState(props);
            const providerProps = useSheetProviderProps(props, state);
            // const { position } = providerProps
            // const { positions } = useSheetSnapPoints(providerProps)
            const { open, setOpen } = state;
            const ref = useRef(undefined);
            useEffect(() => {
                if (open) {
                    ref.current?.presentModal();
                }
                else {
                    ref.current?.dismissModal();
                }
            }, [open]);
            function setOpenInternal(next) {
                props.onOpenChange?.(open);
                setOpen(next);
            }
            // modalContentPreferredContentSize={{
            //   mode: 'percent',
            //   percentWidth: '100%',
            //   percentHeight:
            // }}
            return (_jsx(_Fragment, { children: _jsxs(SheetProvider, { setHasScrollView: emptyFn, keyboardOccludedHeight: 0, ...providerProps, onlyShowFrame: true, children: [_jsx(ModalSheetView, { ref: ref, onModalDidDismiss: () => setOpenInternal(false), children: _jsx(ModalSheetViewMainContent, { children: _jsx(View, { style: { flex: 1 }, children: props.children }) }) }), _jsx(YStack, { position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0, children: props.children })] }) }));
        };
    }
}
const emptyFn = () => {
    // TODO
};
