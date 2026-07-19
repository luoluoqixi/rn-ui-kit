import { jsx as _jsx } from "react/jsx-runtime";
import { Children, isValidElement } from "react";
import { SizableText, ToggleGroup as TamaguiToggleGroup, XGroup, XStack, YGroup } from "tamagui";
import { os } from "../utils/platform";
import { resolveAriaLabel, triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
const ToggleGroupPrimitive = TamaguiToggleGroup;
const DEFAULT_ACTIVE_STYLE = {
    backgroundColor: "$color5",
    borderColor: undefined,
};
function wrapToggleChildForIos(child) {
    if (os() !== "ios") {
        return child;
    }
    return (_jsx(XStack, { accessible: false, pointerEvents: "none", children: child }));
}
function normalizeToggleChildren(children) {
    return Children.map(children, (child) => {
        if (typeof child === "string" || typeof child === "number") {
            return wrapToggleChildForIos(_jsx(SizableText, { accessible: false, children: child }));
        }
        if (isValidElement(child)) {
            return wrapToggleChildForIos(child);
        }
        return child;
    });
}
function ToggleGroupRoot(props) {
    if (props.type === "multiple") {
        return _jsx(ToggleGroupMultipleRoot, { ...props });
    }
    return _jsx(ToggleGroupSingleRoot, { ...props });
}
const getItemsContent = (children, items, itemProps, orientation) => {
    const Group = orientation === "vertical" ? YGroup : XGroup;
    const content = children ??
        items?.map((item) => (_jsx(Group.Item, { children: _jsx(ToggleGroupItem, { ...itemProps, "aria-label": resolveAriaLabel(item["aria-label"] ?? itemProps?.["aria-label"], item.label), disabled: item.disabled ?? itemProps?.disabled, borderRadius: "$4", value: item.value, children: item.label }) }, item.value)));
    return _jsx(Group, { children: content });
};
function ToggleGroupSingleRoot(props) {
    const { children, itemProps, items, nativeHaptics, onValueChange, orientation, ...rootProps } = props;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const resolvedOrientation = orientation || "horizontal";
    const content = getItemsContent(children, items, itemProps, resolvedOrientation);
    return (_jsx(ToggleGroupPrimitive, { disableDeactivation: true, ...rootProps, onValueChange: (nextValue) => {
            onValueChange?.(nextValue);
            triggerNativeHaptics(resolvedNativeHaptics);
        }, orientation: resolvedOrientation, type: "single", children: content }));
}
function ToggleGroupMultipleRoot(props) {
    const { children, itemProps, items, nativeHaptics, onValueChange, orientation, ...rootProps } = props;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const resolvedOrientation = orientation || "horizontal";
    const content = getItemsContent(children, items, itemProps, resolvedOrientation);
    return (_jsx(ToggleGroupPrimitive, { ...rootProps, onValueChange: (nextValue) => {
            onValueChange?.(nextValue);
            triggerNativeHaptics(resolvedNativeHaptics);
        }, orientation: resolvedOrientation, type: "multiple", children: content }));
}
function ToggleGroupItem(props) {
    const { activeStyle, children, ...itemProps } = props;
    return (_jsx(TamaguiToggleGroup.Item, { ...itemProps, activeStyle: activeStyle ?? DEFAULT_ACTIVE_STYLE, children: normalizeToggleChildren(children) }));
}
export const ToggleGroup = Object.assign(ToggleGroupRoot, {
    Item: ToggleGroupItem,
});
