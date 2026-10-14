import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertDialog } from "../alert_dialog";
import { Text } from "../text";
import { triggerNativeHaptics } from "../utils";
import { runNativeDialogButton, setNativeDialogHandler } from "./native_dialog";
function getButtonComponent(button) {
    if (button.style === "cancel") {
        return AlertDialog.Cancel;
    }
    return AlertDialog.Action;
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
        return (_jsx(Action, { className: button.style === "destructive" ? "bg-destructive" : undefined, onPress: () => {
                // NativeDialog previously used a haptic-enabled Button for every action.
                triggerNativeHaptics(true);
                void settle(button.key, button);
            }, children: _jsx(Text, { children: button.text }) }, button.key));
    }) ?? null;
    return (_jsxs(_Fragment, { children: [children, _jsx(AlertDialog, { onOpenChange: handleOpenChange, open: request != null, children: _jsxs(AlertDialog.Content, { children: [_jsxs(AlertDialog.Header, { children: [_jsx(AlertDialog.Title, { children: request?.options.title }), request?.options.message == null ? null : (_jsx(AlertDialog.Description, { children: request.options.message }))] }), _jsx(AlertDialog.Footer, { children: actions })] }) })] }));
}
