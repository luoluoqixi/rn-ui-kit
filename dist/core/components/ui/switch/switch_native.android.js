import { jsx as _jsx } from "react/jsx-runtime";
import { Host, Switch as ComposeSwitch } from "@luoluoqixi/expo-ui-55/jetpack-compose";
import { toARGB, useUiTheme } from "../utils";
function withAlpha(color, alpha) {
    const argb = toARGB(color);
    if (argb == null)
        return color;
    const alphaByte = Math.round(alpha * 255);
    const red = (argb >> 16) & 0xff;
    const green = (argb >> 8) & 0xff;
    const blue = argb & 0xff;
    // Android's Color.parseColor accepts #AARRGGBB, not CSS rgba(...).
    return `#${[alphaByte, red, green, blue]
        .map((channel) => channel.toString(16).padStart(2, "0"))
        .join("")}`;
}
export function SwitchNative({ disabled, nativeComposeProps, onValueChange, style, value, }) {
    const theme = useUiTheme();
    const { colors: overriddenColors, enabled, onCheckedChange, value: _overriddenValue, ...props } = (nativeComposeProps ?? {});
    const colors = {
        checkedThumbColor: theme.primaryForeground,
        checkedTrackColor: theme.primary,
        checkedBorderColor: theme.primary,
        uncheckedThumbColor: theme.background,
        uncheckedTrackColor: theme.input,
        uncheckedBorderColor: theme.input,
        // Material's disabled alpha values, applied to the current semantic theme colors.
        disabledCheckedThumbColor: withAlpha(theme.primaryForeground, 0.38),
        disabledCheckedTrackColor: withAlpha(theme.primary, 0.12),
        disabledCheckedBorderColor: withAlpha(theme.primary, 0.12),
        disabledUncheckedThumbColor: withAlpha(theme.foreground, 0.38),
        disabledUncheckedTrackColor: withAlpha(theme.foreground, 0.12),
        disabledUncheckedBorderColor: withAlpha(theme.foreground, 0.12),
        ...overriddenColors,
    };
    return (_jsx(Host, { matchContents: true, style: style, children: _jsx(ComposeSwitch, { ...props, colors: colors, enabled: enabled ?? !disabled, onCheckedChange: (nextValue) => {
                onValueChange(nextValue);
                onCheckedChange?.(nextValue);
            }, value: value }) }));
}
