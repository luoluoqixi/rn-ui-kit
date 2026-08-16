import type { NativeListActionItemProps, NativeListButtonItemProps, NativeListCustomItemProps, NativeListInputItemProps, NativeListItemProps, NativeListMenuItemProps, NativeListNavigationItemProps, NativeListRootProps, NativeListSectionProps, NativeListSelectItemProps, NativeListSwitchItemProps, NativeListTextAreaItemProps } from "./types";
export declare function NativeListActionItem(props: NativeListActionItemProps): import("react").JSX.Element;
export declare function NativeListNavigationItem(props: NativeListNavigationItemProps): import("react").JSX.Element;
export declare function NativeListSwitchItem({ switchProps, ...itemProps }: NativeListSwitchItemProps): import("react").JSX.Element;
export declare function NativeListButtonItem({ title, onPress, disabled, titleAlign, btnTint, ...itemProps }: NativeListButtonItemProps): import("react").JSX.Element;
/**
 * A full-width editable text field that follows the surrounding NativeList row styling.
 * `clearButtonMode` defaults to `while-editing` so iOS gets the familiar clear affordance.
 */
export declare function NativeListInputItem({ inputProps, inputWidth, ...itemProps }: NativeListInputItemProps): import("react").JSX.Element;
export declare function NativeListTextAreaItem({ textAreaProps, ...itemProps }: NativeListTextAreaItemProps): import("react").JSX.Element;
export declare function NativeListItem({ title, onPress, disabled, titleAlign, btnTint, ...itemProps }: NativeListItemProps): import("react").JSX.Element;
export declare function NativeListSelectItem({ selectProps, ...itemProps }: NativeListSelectItemProps): import("react").JSX.Element;
/** 以整行 NativeList 样式作为 `Menu` 的 native trigger，不维护选中状态。 */
export declare function NativeListMenuItem({ menuProps, ...itemProps }: NativeListMenuItemProps): import("react").JSX.Element;
export declare function NativeListCustomItem({ backgroundColor, children, contextMenuProps, disabled, hoverBackgroundColor, nativeHaptics, nativeScrollId, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, pressBackgroundColor, selectionId, selectionDisabled, }: NativeListCustomItemProps): import("react").JSX.Element;
export declare function NativeListSection({ children, contextMenuProps, footer, trailing, title, titleColor, titleFontSize, }: NativeListSectionProps): import("react").JSX.Element;
export declare function NativeListRoot({ backgroundColor, children, contextMenuProps, contentContainerStyle, contentMarginBottom, contentMarginTop, defaultSelectedIds, dismissKeyboardOnTap: _dismissKeyboardOnTap, editMode, editModeIcon, editModeSelectedIcon, editModeSelectedSfSymbol, editModeSfSymbol, fixesIOS26NestedScrollIndicatorSafeArea: _fixesIOS26NestedScrollIndicatorSafeArea, initialScrollTarget, iosListStyle: _iosListStyle, native: _native, navigationBarScrollEdgeOptions, onRefresh, onSelectedIdsChange, refreshColor, refreshEnabledInEditMode, scrollable, selectedIds, style, tracksNavigationBarScrollEdge, ...rest }: NativeListRootProps): import("react").JSX.Element;
