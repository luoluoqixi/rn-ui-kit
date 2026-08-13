import { jsx as _jsx } from "react/jsx-runtime";
import { Label as TamaguiLabel } from "tamagui";
import { isWeb } from "../utils/platform";
const DEFAULT_LABEL_WEB_STYLE = { userSelect: "text" };
export function Label(props) {
    return (_jsx(TamaguiLabel, { ...props, style: isWeb() ? [DEFAULT_LABEL_WEB_STYLE, props.style] : props.style }));
}
