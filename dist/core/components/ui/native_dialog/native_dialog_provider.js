import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertDialog } from "../alert_dialog";
import { Button } from "../button";
import { runNativeDialogButton, setNativeDialogHandler } from "./native_dialog";
function getButtonComponent(button) {
    if (button.style === "cancel") {
        return AlertDialog.Cancel;
    }
    if (button.style === "destructive") {
        return AlertDialog.Destructive;
    }
    return AlertDialog.Action;
}
function getButtonTheme(button) {
    return button.style === "destructive" ? "red" : undefined;
}
export function NativeDialogProvider({ children }) {
    const [request, setRequest] = useState(null);
    const requestRef = useRef(null);
    useEffect(() => {
        setNativeDialogHandler((nextRequest) => {
            requestRef.current = nextRequest;
            setRequest(nextRequest);
        });
        return () => {
            setNativeDialogHandler(null);
        };
    }, []);
    const settle = useCallback(async (result, button) => {
        const currentRequest = requestRef.current;
        if (currentRequest == null) {
            return;
        }
        requestRef.current = null;
        setRequest(null);
        if (button != null) {
            await runNativeDialogButton(button);
        }
        currentRequest.resolve(result);
    }, []);
    const handleOpenChange = useCallback((open) => {
        if (!open) {
            void settle("dismiss");
        }
    }, [settle]);
    const actions = request?.buttons.map((button) => {
        const Action = getButtonComponent(button);
        return (_jsx(Action, { asChild: true, children: _jsx(Button, { nativeHaptics: true, onPress: () => {
                    void settle(button.key, button);
                }, theme: getButtonTheme(button), children: button.text }) }, button.key));
    }) ?? null;
    return (_jsxs(_Fragment, { children: [children, _jsx(AlertDialog, { actions: actions, description: request?.options.message, dismissOnBackPress: request?.options.cancelable ?? true, dismissOnOverlayPress: request?.options.cancelable ?? true, onOpenChange: handleOpenChange, open: request != null, title: request?.options.title })] }));
}
