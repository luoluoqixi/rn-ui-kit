import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertDialog } from "../alert_dialog";
import { Button } from "../button";
import { Text } from "../text";
import { runNativeDialogButton, setNativeDialogHandler } from "./native_dialog";
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
        return (_jsx(Button, { nativeHaptics: true, variant: button.style === "cancel" ? "tertiary" : button.style === "destructive" ? "danger" : "primary", onPress: () => {
                void settle(button.key, button);
            }, children: _jsx(Text, { children: button.text }) }, button.key));
    }) ?? null;
    return (_jsxs(_Fragment, { children: [children, _jsx(AlertDialog, { onOpenChange: handleOpenChange, open: request != null, title: request?.options.title, description: request?.options.message, actions: actions })] }));
}
