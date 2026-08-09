import { jsx as _jsx } from "react/jsx-runtime";
import { FlashList as ShopifyFlashList } from "@shopify/flash-list";
import { forwardRef } from "react";
function FlashListInner(props, ref) {
    return _jsx(ShopifyFlashList, { ref: ref, ...props });
}
export const FlashList = forwardRef(FlashListInner);
