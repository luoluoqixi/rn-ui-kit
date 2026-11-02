import type { NativeListActionItemProps, NativeListButtonItemProps, NativeListCustomItemProps, NativeListInputItemProps, NativeListItemProps, NativeListDropdownItemProps, NativeListNavigationItemProps, NativeListRootProps, NativeListSectionProps, NativeListSelectItemProps, NativeListSwitchItemProps, NativeListColorPickerItemProps, NativeListTextAreaItemProps } from "./types";
/** iOS keeps the historical SwiftUI list as its default; other platforms use basic rows. */
export declare function NativeListRoot({ disabled, native, nativeTriggerFontWeight, ...props }: NativeListRootProps): import("react").JSX.Element;
export declare const NativeList: typeof NativeListRoot;
export declare function NativeListSection({ disabled, native, nativeTriggerFontWeight, ...props }: NativeListSectionProps & {
    native?: boolean;
}): import("react").JSX.Element;
export declare const NativeListActionItem: (props: NativeListActionItemProps & {
    native?: boolean;
}) => import("react").JSX.Element;
export declare const NativeListNavigationItem: (props: NativeListNavigationItemProps & {
    native?: boolean;
}) => import("react").JSX.Element;
export declare const NativeListSwitchItem: (props: NativeListSwitchItemProps & {
    native?: boolean;
}) => import("react").JSX.Element;
export declare const NativeListColorPickerItem: (props: NativeListColorPickerItemProps & {
    native?: boolean;
}) => import("react").JSX.Element;
export declare const NativeListSelectItem: (props: NativeListSelectItemProps & {
    native?: boolean;
}) => import("react").JSX.Element;
export declare const NativeListDropdownItem: (props: NativeListDropdownItemProps & {
    native?: boolean;
}) => import("react").JSX.Element;
export declare const NativeListButtonItem: (props: NativeListButtonItemProps & {
    native?: boolean;
}) => import("react").JSX.Element;
export declare const NativeListInputItem: (props: NativeListInputItemProps & {
    native?: boolean;
}) => import("react").JSX.Element;
export declare const NativeListTextAreaItem: (props: NativeListTextAreaItemProps & {
    native?: boolean;
}) => import("react").JSX.Element;
export declare const NativeListItem: (props: NativeListItemProps & {
    native?: boolean;
}) => import("react").JSX.Element;
export declare const NativeListCustomItem: (props: NativeListCustomItemProps & {
    native?: boolean;
}) => import("react").JSX.Element;
