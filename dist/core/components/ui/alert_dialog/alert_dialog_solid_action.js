import { jsx as _jsx } from "react/jsx-runtime";
import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import { Slot } from "@rn-primitives/slot";
import { Pressable } from "react-native";
import { useSolidButtonInteraction } from "../button/use_solid_button_interaction";
export function AlertDialogSolidAction({ colors, variant, asChild, style, children, ...props }) {
    return (_jsx(AlertDialogPrimitive.Action, { ...props, asChild: true, children: _jsx(SolidActionPressable, { colors: colors, variant: variant, asChild: asChild, interactionStyle: style, children: children }) }));
}
// Radix Slot 将 style 当对象展开，必须在它合成 props 之后创建 Pressable 的样式函数。
function SolidActionPressable({ colors, variant, disabled, onHoverIn, onHoverOut, style, interactionStyle, asChild, ...props }) {
    const interaction = useSolidButtonInteraction({
        colors,
        variant,
        disabled: disabled ?? false,
        onHoverIn,
        onHoverOut,
    });
    const Component = asChild ? Slot : Pressable;
    return (_jsx(Component, { ...props, disabled: disabled ?? false, onHoverIn: interaction.onHoverIn, onHoverOut: interaction.onHoverOut, style: (state) => [
            interaction.backgroundStyle(state.pressed),
            typeof style === "function" ? style(state) : style,
            typeof interactionStyle === "function" ? interactionStyle(state) : interactionStyle,
        ] }));
}
