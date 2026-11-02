import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import { Slot } from "@rn-primitives/slot";
import { Pressable, type PressableStateCallbackType } from "react-native";
import type { SemanticColors } from "../utils/theme/ui_theme";
import type { AlertDialogActionProps } from "./types";
import { useSolidButtonInteraction } from "../button/use_solid_button_interaction";

type SolidActionProps = AlertDialogActionProps & {
  colors: Pick<SemanticColors, "primary" | "destructive">;
  variant: "default" | "destructive";
};

export function AlertDialogSolidAction({
  colors,
  variant,
  asChild,
  style,
  children,
  ...props
}: SolidActionProps) {
  return (
    <AlertDialogPrimitive.Action {...props} asChild>
      <SolidActionPressable
        colors={colors}
        variant={variant}
        asChild={asChild}
        interactionStyle={style}
      >
        {children}
      </SolidActionPressable>
    </AlertDialogPrimitive.Action>
  );
}

// Radix Slot 将 style 当对象展开，必须在它合成 props 之后创建 Pressable 的样式函数。
function SolidActionPressable({
  colors,
  variant,
  disabled,
  onHoverIn,
  onHoverOut,
  style,
  interactionStyle,
  asChild,
  ...props
}: SolidActionProps & { interactionStyle?: AlertDialogActionProps["style"] }) {
  const interaction = useSolidButtonInteraction({
    colors,
    variant,
    disabled: disabled ?? false,
    onHoverIn,
    onHoverOut,
  });
  const Component = asChild ? Slot : Pressable;
  return (
    <Component
      {...props}
      disabled={disabled ?? false}
      onHoverIn={interaction.onHoverIn}
      onHoverOut={interaction.onHoverOut}
      style={(state: PressableStateCallbackType) => [
        interaction.backgroundStyle(state.pressed),
        typeof style === "function" ? style(state) : style,
        typeof interactionStyle === "function" ? interactionStyle(state) : interactionStyle,
      ]}
    />
  );
}

