import { Button } from "../../../button";

import { useBottomSheetStackHost } from "./stack_context";

const DEFAULT_MARGIN_RIGHT = 10;

/** BottomSheet Stack `headerRight`：关闭当前 BottomSheet。 */
export function BottomSheetStackHeaderCloseButton({ title }: { title?: string }) {
  const { onRequestClose } = useBottomSheetStackHost();
  const titleText = title ?? "Close";
  return (
    <Button
      aria-label={titleText}
      native
      onPress={onRequestClose}
      title={titleText}
      style={{
        marginRight: DEFAULT_MARGIN_RIGHT,
      }}
    />
  );
}
