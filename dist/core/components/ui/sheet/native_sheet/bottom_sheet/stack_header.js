import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from "../../../button";
import { useBottomSheetStackHost } from "./stack_context";
/** BottomSheet Stack `headerRight`：关闭当前 BottomSheet。 */
export function BottomSheetStackHeaderCloseButton({ title }) {
    const { onRequestClose } = useBottomSheetStackHost();
    const titleText = title ?? "Close";
    return _jsx(Button, { "aria-label": titleText, native: true, onPress: onRequestClose, title: titleText });
}
