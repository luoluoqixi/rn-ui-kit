import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useState } from "react";
import { Label as TamaguiLabel, Switch as TamaguiSwitch, XStack, YStack, getThemes, getVariableValue, useTheme, useThemeName, } from "tamagui";
import { isIos15, isWeb, os, supportsImpactHaptics } from "../utils/platform";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
const platform = os();
const web = isWeb();
const ios = platform === "ios";
function resolveThemeColor(values) {
    for (const value of values) {
        const resolved = getVariableValue(value);
        if (typeof resolved === "string" && resolved.length > 0) {
            return resolved;
        }
    }
    return undefined;
}
function getComponentTheme(themeName, componentName) {
    const themes = getThemes();
    return themes[`${themeName}_${componentName}`];
}
function SwitchRoot(props) {
    const generatedId = useId();
    const theme = useTheme();
    const themeName = useThemeName();
    const { checked: checkedProp, children, defaultChecked, id, label, labelPosition = "start", labelProps, native = !web, nativeHaptics = true, nativeProps, onCheckedChange, overflow, size = "$4", thumbProps, ...rootProps } = props;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const controlId = id ?? generatedId;
    const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);
    const checked = checkedProp ?? uncontrolledChecked;
    const shouldHandleLabelPress = ios;
    const switchTheme = getComponentTheme(themeName, "Switch");
    const switchThumbTheme = getComponentTheme(themeName, "SwitchThumb");
    const colorBackground = resolveThemeColor([switchThumbTheme?.background, theme.background]);
    const nativeTrackOffColor = resolveThemeColor([switchTheme?.background, theme.background]);
    const nativeTrackOnColor = ios
        ? colorBackground
        : resolveThemeColor([switchTheme?.color6, theme.color6]);
    const nativeThumbColor = ios ? undefined : colorBackground;
    const nativeSwitchProps = native
        ? {
            ...nativeProps,
            ios_backgroundColor: nativeProps?.ios_backgroundColor,
            thumbColor: nativeProps?.thumbColor ?? nativeThumbColor,
            trackColor: {
                false: nativeTrackOffColor,
                true: nativeTrackOnColor,
                ...nativeProps?.trackColor,
            },
        }
        : nativeProps;
    // iOS 原生 UISwitch 作为 flex container 直接子节点时无法正确垂直居中，
    // 套一层 YStack 容器让 flexbox 对齐机制正常工作
    const handleCheckedChange = (nextChecked, isLabel) => {
        if (checkedProp === undefined) {
            setUncontrolledChecked(nextChecked);
        }
        onCheckedChange?.(nextChecked);
        const iosDefaultHaptics = native && ios && supportsImpactHaptics();
        if (!iosDefaultHaptics || isLabel || isIos15()) {
            // ios 中, 原生 Switch 交互默认是有震动的 (除了iPhone6s或以下)
            // 所以 ios 原生 Switch 不需要自己调用震动 api.
            triggerNativeHaptics(resolvedNativeHaptics);
        }
    };
    const control = (_jsx(TamaguiSwitch, { native: native, activeStyle: {
            backgroundColor: "$color6",
        }, ...rootProps, borderWidth: rootProps.borderWidth ?? 0, checked: checked, cursor: rootProps.cursor ?? "pointer", id: controlId, onCheckedChange: handleCheckedChange, nativeProps: nativeSwitchProps, overflow: overflow ?? "hidden", padding: rootProps.padding ?? 0, size: size, children: children ?? _jsx(SwitchThumb, { ...thumbProps, transition: thumbProps?.transition ?? "bouncy" }) }));
    // iOS 原生 UISwitch 作为 flex container 直接子节点时无法正确垂直居中，
    // 套一层 YStack 容器让 flexbox 对齐机制正常工作
    const wrappedControl = ios && native ? _jsx(YStack, { children: control }) : control;
    if (label == null) {
        return wrappedControl;
    }
    const labelElement = shouldHandleLabelPress ? (_jsx(XStack, { onPress: (event) => {
            labelProps?.onPress?.(event);
            if (rootProps.disabled || event.defaultPrevented) {
                return;
            }
            handleCheckedChange(!checked, true);
        }, children: _jsx(TamaguiLabel, { ...labelProps, pointerEvents: "none", children: label }) })) : (_jsx(TamaguiLabel, { ...labelProps, htmlFor: labelProps?.htmlFor ?? controlId, children: label }));
    return (_jsxs(XStack, { gap: "$2", items: "center", children: [labelPosition === "start" ? labelElement : null, wrappedControl, labelPosition === "end" ? labelElement : null] }));
}
function SwitchThumb(props) {
    return _jsx(TamaguiSwitch.Thumb, { ...props });
}
export const Switch = Object.assign(SwitchRoot, {
    Thumb: SwitchThumb,
});
