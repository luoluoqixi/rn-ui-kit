import { type ReactElement, type Ref } from "react";
import type { FlashListProps, FlashListRef } from "./types";
export declare const FlashList: <TItem>(props: FlashListProps<TItem> & {
    ref?: Ref<FlashListRef<TItem>>;
}) => ReactElement;
