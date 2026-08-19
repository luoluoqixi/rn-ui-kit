import type { NativeListActionItemProps, NativeListButtonItemProps, NativeListCustomItemProps, NativeListInputItemProps, NativeListItemProps, NativeListMenuItemProps, NativeListNavigationItemProps, NativeListRootProps, NativeListSectionProps, NativeListSelectItemProps, NativeListSwitchItemProps, NativeListTextAreaItemProps } from "./types";
declare function NativeListRoot({ automaticallyAdjustsScrollIndicatorInsets, backgroundColor, children, contextMenuProps, disabledStyle, contentInsetAdjustmentBehavior, contentMarginBottom, contentMarginTop, defaultSelectedIds, dismissKeyboardOnTap, editMode, editModeIcon, editModeSelectedIcon, editModeSelectedSfSymbol, editModeSfSymbol, fixesIOS26NestedScrollIndicatorSafeArea, initialScrollTarget, iosListStyle, native, nestedScrollEnabled, navigationBarScrollEdgeOptions, onRefresh, onSelectedIdsChange, refreshColor: _refreshColor, refreshEnabledInEditMode, scrollIndicatorInsets, style, scrollable, selectedIds, tracksNavigationBarScrollEdge, webAutoRestoreScroll: _webAutoRestoreScroll, ...fallbackProps }: NativeListRootProps): import("react").JSX.Element;
declare function NativeListSection({ children, contextMenuProps, disabledStyle, footer, trailing, title, titleColor, titleFontSize, }: NativeListSectionProps): import("react").JSX.Element;
export declare function NativeListActionItem(props: NativeListActionItemProps): import("react").JSX.Element;
export declare function NativeListNavigationItem(props: NativeListNavigationItemProps): import("react").JSX.Element;
export declare function NativeListButtonItem({ title, onPress, disabled, titleAlign, btnTint, ...itemProps }: NativeListButtonItemProps): import("react").JSX.Element;
/**
 * Keeps a React Native text input inside the SwiftUI List row, which preserves
 * controlled values and the full `Input` API while retaining native list chrome.
 */
export declare function NativeListInputItem({ inputProps, inputWidth, ...itemProps }: NativeListInputItemProps): import("react").JSX.Element;
export declare function NativeListTextAreaItem({ textAreaProps, ...itemProps }: NativeListTextAreaItemProps): import("react").JSX.Element;
export declare function NativeListItem({ title, onPress, disabled, titleAlign, btnTint, ...itemProps }: NativeListItemProps): import("react").JSX.Element;
export declare function NativeListSwitchItem({ switchProps, ...itemProps }: NativeListSwitchItemProps): import("react").JSX.Element;
export declare function NativeListSelectItem({ selectProps, ...itemProps }: NativeListSelectItemProps): import("react").JSX.Element;
/** 在 iOS 原生列表中保留原生行布局，并将 Menu trigger 托管到行尾。 */
export declare function NativeListMenuItem({ menuProps, ...itemProps }: NativeListMenuItemProps): import("react").JSX.Element;
export declare function NativeListCustomItem({ backgroundColor, children, contextMenuProps, disabled, disabledStyle, hoverBackgroundColor, nativeHaptics, nativeScrollId, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, pressBackgroundColor, selectionId, selectionDisabled, }: NativeListCustomItemProps): import("react").JSX.Element;
export { NativeListRoot as NativeList, NativeListSection };
