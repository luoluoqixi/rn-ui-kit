import { jsx as _jsx } from "react/jsx-runtime";
import { ListItem as TamaguiListItem } from "tamagui";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
const DEFAULT_HOVER_STYLE = {
    background: "$color3",
};
const DEFAULT_PRESS_STYLE = {
    background: "$color4",
};
export function ListItem(props) {
    const { hoverStyle, nativeHaptics, onPress, pressStyle, ...listItemProps } = props;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const handlePress = (event) => {
        onPress?.(event);
        if (event.defaultPrevented) {
            return;
        }
        triggerNativeHaptics(resolvedNativeHaptics);
    };
    return (_jsx(TamaguiListItem, { ...listItemProps, hoverStyle: hoverStyle ?? DEFAULT_HOVER_STYLE, onPress: handlePress, pressStyle: pressStyle ?? DEFAULT_PRESS_STYLE }));
}
