import { Alert } from "react-native";
import { isWeb } from "../utils/platform";
let nativeDialogId = 1;
let webDialogHandler = null;
export function setNativeDialogHandler(handler) {
    webDialogHandler = handler;
}
export function getDefaultNativeDialogButtons(options) {
    return [
        {
            key: "cancel",
            onPress: options.onCancel,
            style: "cancel",
            text: options.cancelText ?? "取消",
        },
        {
            key: "confirm",
            onPress: options.onConfirm,
            style: options.destructive ? "destructive" : "default",
            text: options.confirmText ?? "确定",
        },
    ];
}
export function getNativeDialogButtons(options) {
    const buttons = options.buttons?.filter((button) => button.text.length > 0);
    return buttons != null && buttons.length > 0 ? buttons : getDefaultNativeDialogButtons(options);
}
export async function runNativeDialogButton(button) {
    await button.onPress?.();
    return button.key;
}
function confirmWeb(options, buttons) {
    const cancelButton = buttons.find((button) => button.style === "cancel");
    const confirmButton = [...buttons].reverse().find((button) => button.style !== "cancel") ??
        cancelButton ??
        buttons[0];
    const accepted = window.confirm([options.title, options.message].filter(Boolean).join("\n\n"));
    return runNativeDialogButton(accepted ? confirmButton : (cancelButton ?? confirmButton));
}
export function confirmNative(options) {
    const buttons = getNativeDialogButtons(options);
    if (isWeb()) {
        if (webDialogHandler != null) {
            return new Promise((resolve) => {
                const requestId = nativeDialogId;
                nativeDialogId += 1;
                webDialogHandler?.({
                    buttons,
                    id: requestId,
                    options,
                    resolve,
                });
            });
        }
        return confirmWeb(options, buttons);
    }
    return new Promise((resolve) => {
        let resolved = false;
        const resolveOnce = (result) => {
            if (resolved) {
                return;
            }
            resolved = true;
            resolve(result);
        };
        Alert.alert(options.title, options.message, buttons.map((button) => ({
            onPress: () => {
                void runNativeDialogButton(button).then(resolveOnce);
            },
            style: button.style,
            text: button.text,
        })), {
            cancelable: options.cancelable ?? true,
            onDismiss: () => resolveOnce("dismiss"),
        });
    });
}
