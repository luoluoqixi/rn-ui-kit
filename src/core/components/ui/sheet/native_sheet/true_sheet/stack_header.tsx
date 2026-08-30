import { Button, type ButtonProps } from "../../../button";
import { isIos, isIos26Plus } from "../../../utils";

import { useTrueSheetStackHost } from "./stack_context";

/** 原生 Stack `headerRight`：关闭当前 True Sheet。 */
export function TrueSheetStackHeaderCloseButton({ title, onPress, ...buttonProps }: ButtonProps) {
  const { onRequestClose } = useTrueSheetStackHost();
  const titleText = title ?? (buttonProps.children == null ? "关闭" : undefined);
  const handlePress: NonNullable<ButtonProps["onPress"]> = (event) => {
    onPress?.(event);
    if (!event.defaultPrevented) {
      onRequestClose();
    }
  };
  const defaultButtonSize = {
    width: 40,
    height: isIos26Plus() ? 40 : 20,
  };

  return (
    <Button
      {...buttonProps}
      aria-label={buttonProps["aria-label"] ?? title ?? "关闭"}
      native={buttonProps.native ?? isIos()}
      buttonSize={buttonProps.buttonSize ?? defaultButtonSize}
      title={titleText}
      onPress={handlePress}
    />
  );
}
