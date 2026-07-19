import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from "../../../button";
import { useTrueSheetStackHost } from "./stack_context";
/** 原生 Stack `headerRight`：关闭当前 True Sheet。 */
export function TrueSheetStackHeaderCloseButton({ title }) {
    const { onRequestClose } = useTrueSheetStackHost();
    const titleText = title ?? "Close";
    return _jsx(Button, { "aria-label": titleText, native: true, onPress: onRequestClose, title: titleText });
}
