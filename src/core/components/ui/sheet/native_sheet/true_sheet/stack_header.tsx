import { Button } from "../../../button";
import { cn } from "../../../utils";
import type { NativeSheetStackHeaderButtonProps } from "../types";
import { shouldTrueSheetStackHeaderButtonClose } from "./stack_header_button";

type CustomHeaderButtonOptions = {
  buttonProps?: NativeSheetStackHeaderButtonProps;
  defaultCloseSheetOnPress: boolean;
  defaultLabel: string;
  onRequestClose: () => void;
};

/** Android/Web Stack Header 使用的 React Button。 */
export function TrueSheetStackCustomHeaderButton({
  buttonProps,
  defaultCloseSheetOnPress,
  defaultLabel,
  onRequestClose,
}: CustomHeaderButtonOptions) {
  const customButtonProps = buttonProps?.customButtonProps;
  const { onPress: onCustomPress, ...restCustomButtonProps } = customButtonProps ?? {};
  const resolvedLabel =
    buttonProps?.label ??
    buttonProps?.title ??
    customButtonProps?.title ??
    (customButtonProps?.children == null ? defaultLabel : undefined);

  return (
    <Button
      {...restCustomButtonProps}
      accessibilityHint={buttonProps?.accessibilityHint ?? customButtonProps?.accessibilityHint}
      accessibilityLabel={buttonProps?.accessibilityLabel ?? customButtonProps?.accessibilityLabel}
      buttonColor={buttonProps?.tintColor ?? customButtonProps?.buttonColor}
      disabled={buttonProps?.disabled ?? customButtonProps?.disabled}
      onPress={(event) => {
        onCustomPress?.(event);
        if (event.defaultPrevented) return;

        buttonProps?.onPress?.();
        if (shouldTrueSheetStackHeaderButtonClose(buttonProps, defaultCloseSheetOnPress)) {
          onRequestClose();
        }
      }}
      title={resolvedLabel}
      variant={customButtonProps?.variant ?? "link"}
      size={customButtonProps?.size ?? "lg"}
      textClassName={cn("no-underline text-lg", customButtonProps?.textClassName)}
    />
  );
}
