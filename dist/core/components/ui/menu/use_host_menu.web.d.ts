import { type OverlayStateProps } from "../utils/overlay/overlay_state";
import type { ContextMenuItemData } from "../context_menu/types";
import type { DropdownItemData } from "../dropdown/types";
import type { MenuAdapterProps, MenuAdapterRequest, MenuAnchorRect } from "./menu_adapter_types";
import type { MenuContentProps } from "./types";
type Props = OverlayStateProps & MenuAdapterProps & {
    items?: (ContextMenuItemData | DropdownItemData)[];
    itemProps?: Record<string, unknown>;
    contentProps?: MenuContentProps;
    onOpenWillChange?: (open: boolean) => void;
};
type Anchor = MenuAdapterRequest["anchor"];
type Source = MenuAdapterRequest["source"];
export declare function elementMenuRect(element: Element | null | undefined): MenuAnchorRect;
export declare function useHostMenu(p: Props, kind: MenuAdapterRequest["kind"], disabled: boolean, measure: () => MenuAnchorRect, ownerDocument?: () => Document): {
    open: boolean;
    present(anchor?: Anchor, source?: Source): void;
};
export {};
