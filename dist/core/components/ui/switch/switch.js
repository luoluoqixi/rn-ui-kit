import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { isIos15 } from "../utils/platform";
import { resolveRenderProp } from "../utils/render";
import * as SwitchPrimitives from "@rn-primitives/switch";
import * as React from "react";
import { Platform, Pressable, View } from "react-native";
import { SwitchNative } from "./switch_native";
const switchSizes = {
    default: { track: "h-[22px] w-10", thumb: "size-[18px]", checked: "translate-x-5" },
    "2xs": { track: "h-3.5 w-6", thumb: "size-2.5", checked: "translate-x-3" },
    "xs": { track: "h-4 w-7", thumb: "size-3", checked: "translate-x-3.5" },
    "sm": { track: "h-[18px] w-8", thumb: "size-3.5", checked: "translate-x-4" },
    "md": { track: "h-[22px] w-10", thumb: "size-[18px]", checked: "translate-x-5" },
    "lg": { track: "h-[26px] w-12", thumb: "size-[22px]", checked: "translate-x-6" },
    "xl": { track: "h-[30px] w-14", thumb: "size-[26px]", checked: "translate-x-7" },
    "2xl": { track: "h-[34px] w-16", thumb: "size-[30px]", checked: "translate-x-8" },
};
const switchLabelSizes = {
    default: "text-base",
    "2xs": "text-xs",
    "xs": "text-xs",
    "sm": "text-sm",
    "md": "text-base",
    "lg": "text-base",
    "xl": "text-lg",
    "2xl": "text-xl",
};
const switchNativeScales = {
    default: 1,
    "2xs": 0.75,
    "xs": 0.875,
    "sm": 0.9375,
    "md": 1,
    "lg": 1.125,
    "xl": 1.35,
    "2xl": 1.6,
};
function Switch({ className, containerClassName, defaultChecked = false, label, labelClassName, labelPosition = "right", native = Platform.OS !== "web", nativeComposeProps, nativeHaptics, nativeSwiftProps, onCheckedChange, size = "default", ...props }) {
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
        defaultEnabled: true,
    });
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const checked = props.checked ?? uncontrolledChecked;
    // Native iOS switches provide their own haptics from iOS 16 onward.
    const shouldTriggerDirectHaptics = native !== true || Platform.OS !== "ios" || isIos15();
    const handleCheckedChange = (nextChecked, fromLabel = false) => {
        if (fromLabel || shouldTriggerDirectHaptics) {
            triggerNativeHaptics(resolvedNativeHaptics);
        }
        if (props.checked === undefined)
            setUncontrolledChecked(nextChecked);
        onCheckedChange?.(nextChecked);
    };
    const handleLabelPress = () => {
        if (props.disabled)
            return;
        handleCheckedChange(!checked, true);
    };
    const renderedLabel = resolveRenderProp(label, {
        checked,
        disabled: props.disabled,
    });
    const switchSize = switchSizes[size];
    const switchControl = native === true && Platform.OS !== "web" ? (_jsx(SwitchNative, { disabled: props.disabled, nativeComposeProps: nativeComposeProps, nativeSwiftProps: nativeSwiftProps, onValueChange: handleCheckedChange, style: [
            props.style,
            switchNativeScales[size] === 1
                ? undefined
                : { transform: [{ scale: switchNativeScales[size] }] },
        ], value: checked })) : (_jsx(SwitchPrimitives.Root, { className: cn("flex shrink-0 flex-row items-center rounded-full border border-transparent shadow-sm shadow-black/5", switchSize.track, Platform.select({
            web: "focus-visible:border-ring focus-visible:ring-ring/50 peer inline-flex outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed",
        }), checked ? "bg-primary" : "bg-input dark:bg-input/80", props.disabled && "opacity-50", className), ...props, checked: checked, onCheckedChange: handleCheckedChange, children: _jsx(SwitchPrimitives.Thumb, { className: cn("bg-background rounded-full transition-transform", switchSize.thumb, Platform.select({
                web: "pointer-events-none block ring-0",
            }), checked
                ? cn("dark:bg-primary-foreground", switchSize.checked)
                : "dark:bg-foreground translate-x-0") }) }));
    if (renderedLabel == null)
        return switchControl;
    return (_jsxs(View, { className: cn("flex-row items-center self-start", labelPosition === "left" && "flex-row-reverse", props.disabled && "opacity-50", containerClassName), children: [switchControl, _jsx(Pressable, { className: cn("self-stretch justify-center", labelPosition === "left" ? "pr-3" : "pl-3"), disabled: props.disabled, onPress: handleLabelPress, children: typeof renderedLabel === "string" || typeof renderedLabel === "number" ? (_jsx(Text, { className: cn(switchLabelSizes[size], "font-medium", labelClassName), children: renderedLabel })) : (renderedLabel) })] }));
}
const SwitchComponent = Object.assign(Switch, {
    Root: Switch,
});
export { SwitchComponent as Switch };
