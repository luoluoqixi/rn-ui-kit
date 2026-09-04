import { type ReactElement, type ReactNode } from "react";
import type { SFSymbol } from "sf-symbols-typescript";
import type { ResolvedSelectItemData } from "../select/select_grouping";
import type { NativeListContextMenuProps, NativeListItemBaseProps, NativeListItemPaddingProps, NativeListRootProps, NativeListSectionProps, NativeListSelectionId, NativeListSelectItemProps, NativeListTextAreaItemProps } from "./types";
export declare function getSelectLabel(item: ResolvedSelectItemData, selectedValue?: string): string;
export declare function renderNativeListSelectTriggerLabel(label: ReactNode, swatchColor: string | undefined, labelProps?: NativeListSelectItemProps["selectProps"]["nativeTriggerLabelProps"]): import("react").JSX.Element;
export declare function NativeSwiftUIContextMenu({ children, contextMenuProps, disabled, }: {
    children: ReactElement;
    contextMenuProps: NativeListContextMenuProps;
    /** Keep the SwiftUI menu tree mounted while the native menu builder is disabled. */
    disabled?: boolean;
}): import("react").JSX.Element;
type SwiftUIButtonStyle = "automatic" | "bordered" | "borderedProminent" | "borderless" | "glass" | "glassProminent" | "plain";
export declare const Ios15FirstVisibleRowContext: import("react").Context<boolean>;
export declare const ROW_INSETS: import("@luoluoqixi/expo-ui-55/swift-ui/modifiers").ModifierConfig;
export declare const DEFAULT_TEXT_AREA_LINES = 4;
export declare function resolveRowPadding({ paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, }: NativeListItemPaddingProps): {
    top: number;
    bottom: number;
    leading: number;
    trailing: number;
};
export declare function resolveTextAreaHeight(textAreaProps: NativeListTextAreaItemProps["textAreaProps"]): number;
export declare function resolveEditingInputDisplay(value: unknown, defaultValue: unknown, placeholder: unknown): {
    placeholder: boolean;
    text: string;
};
export declare function toPlainText(value: ReactNode): string | null;
export declare function supportsNativeTextRow(...values: Array<ReactNode | undefined>): boolean;
export declare function NativeRowLabel({ subtitle, subtitleColor, subtitleFontSize, title, titleAlign, expand, titleColor, titleFontSize, titleLineLimit, layoutPriorityValue, opacityValue, preserveLeadingAnchor, }: {
    subtitle?: ReactNode;
    subtitleColor?: string;
    subtitleFontSize?: number;
    title?: ReactNode;
    titleAlign?: "center" | "right" | "left";
    expand?: boolean;
    titleColor?: boolean | string | null;
    titleFontSize?: number;
    titleLineLimit?: number;
    layoutPriorityValue?: number;
    opacityValue?: number;
    preserveLeadingAnchor?: boolean;
}): import("react").JSX.Element | null;
export declare function NativeRowContainer({ children, contextMenuProps, contextMenuDisabled, disabled, disabledStyle, ios15FirstRowTopInset, nativeSelectionActive, nativeSelectionId, nativeScrollId, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, btnStyle, btnTint, rowAlignment, rowMinHeight, }: {
    children: ReactNode;
    contextMenuProps?: NativeListContextMenuProps;
    /** Keeps a ContextMenu wrapper stable while iOS 15 disables its interaction. */
    contextMenuDisabled?: boolean;
    disabled?: boolean;
    disabledStyle?: boolean;
    /** Extra top coverage only for a first visible row's iOS 15 corner overlay. */
    ios15FirstRowTopInset?: number;
    /** Whether the row is participating in the currently active native selection UI. */
    nativeSelectionActive?: boolean;
    nativeSelectionId?: NativeListSelectionId;
    nativeScrollId?: string | number;
    onPress?: () => void;
    btnStyle?: SwiftUIButtonStyle;
    btnTint?: boolean | string;
    rowAlignment?: "center" | "top";
    rowMinHeight?: number;
} & NativeListItemPaddingProps): import("react").JSX.Element;
export declare function NativeHostedTrailingControl({ children, disableInEditMode, }: {
    children: ReactNode;
    disableInEditMode?: boolean;
}): import("react").JSX.Element;
export declare function NativeHostedCustomRow({ children, disabled, disableInteractions, }: {
    children: ReactNode;
    disabled?: boolean;
    disableInteractions?: boolean;
}): import("react").JSX.Element;
export declare function NativePressRow({ chevron, chevronColor, contextMenuProps, disabled, disabledStyle, icon, iconColor, iconSize, iconSlotWidth, sfSymbol, nativeHaptics, nativeScrollId, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, selected, selectionId, selectionDisabled, subtitle, subtitleColor, subtitleFontSize, trailing, title, titleAlign, titleColor, titleFontSize, titleLineLimit, trailingControl, overlayTrailingControlOnValueSymbol, preserveValueWidth, labelOpacity, value, valueColor, valueFontSize, valueSfSymbol, btnStyle, btnTint, preserveLeadingAnchor, rowAlignment, rowMinHeight, ios15RowType, }: NativeListItemBaseProps & {
    trailingControl?: ReactNode;
    overlayTrailingControlOnValueSymbol?: boolean;
    preserveValueWidth?: boolean;
    labelOpacity?: number;
    btnStyle?: SwiftUIButtonStyle;
    preserveLeadingAnchor?: boolean;
    rowAlignment?: "center" | "top";
    rowMinHeight?: number;
    titleLineLimit?: number;
    valueSfSymbol?: SFSymbol;
    ios15RowType?: "navigation" | "text";
}): import("react").JSX.Element;
declare function NativeListRoot({ automaticallyAdjustsScrollIndicatorInsets, backgroundColor, children, contextMenuProps, disabledStyle, contentInsetAdjustmentBehavior, contentMarginBottom, contentMarginTop, defaultSelectedIds, dismissKeyboardOnTap, editMode, editModeIcon, editModeSelectedIcon, editModeSelectedSfSymbol, editModeSfSymbol, fixesIOS26NestedScrollIndicatorSafeArea, initialScrollTarget, iosListStyle, nestedScrollEnabled, navigationBarScrollEdgeOptions, onRefresh, onSelectedIdsChange, nativeHaptics, iosPressFeedback, refreshColor: _refreshColor, refreshEnabledInEditMode, scrollIndicatorInsets, style, scrollable, selectedIds, tracksNavigationBarScrollEdge, webAutoRestoreScroll: _webAutoRestoreScroll, }: NativeListRootProps): import("react").JSX.Element;
declare function NativeListSection({ children, contextMenuProps, disabledStyle, nativeHaptics, footer, trailing, title, titleColor, titleFontSize, }: NativeListSectionProps): import("react").JSX.Element;
/**
 * Keeps a React Native text input inside the SwiftUI List row, which preserves
 * controlled values and the full `Input` API while retaining native list chrome.
 */
export declare const nativeListStyles: {
    customRowShell: {
        alignSelf: "stretch";
        maxWidth: "100%";
        minWidth: number;
        width: "100%";
    };
    disabledContent: {
        opacity: number;
    };
    hostedContent: {
        flexDirection: "row";
        alignItems: "center";
    };
    hostedIcon: {
        alignItems: "center";
        alignSelf: "flex-start";
        flexDirection: "row";
        justifyContent: "center";
    };
    input: {
        fontSize: number;
        height: number;
        maxHeight: number;
        minHeight: number;
        paddingHorizontal: number;
        paddingVertical: number;
        width: "100%";
    };
    inputRow: {
        height: number;
        width: "100%";
    };
    fullWidthInput: {
        paddingHorizontal: number;
    };
    inputTrailing: {
        width: number;
    };
    nativeRoot: {
        flex: number;
    };
    selectInlineTrigger: {
        alignItems: "center";
        flexDirection: "row";
        flexShrink: number;
        gap: number;
        maxWidth: number;
        minHeight: number;
        minWidth: number;
    };
    selectInlineLabel: {
        alignItems: "center";
        flexDirection: "row";
        flexShrink: number;
        gap: number;
        minWidth: number;
    };
    selectSwatch: {
        borderRadius: number;
        height: number;
        width: number;
    };
    trailingHostedContent: {
        alignItems: "center";
        alignSelf: "flex-start";
        flexDirection: "row";
        justifyContent: "flex-start";
    };
    textArea: {
        fontSize: number;
        minHeight: number;
        paddingHorizontal: number;
        paddingVertical: number;
        textAlignVertical: "top";
        width: "100%";
    };
    textAreaRow: {
        width: "100%";
    };
};
export declare const styles: {
    customRowShell: {
        alignSelf: "stretch";
        maxWidth: "100%";
        minWidth: number;
        width: "100%";
    };
    disabledContent: {
        opacity: number;
    };
    hostedContent: {
        flexDirection: "row";
        alignItems: "center";
    };
    hostedIcon: {
        alignItems: "center";
        alignSelf: "flex-start";
        flexDirection: "row";
        justifyContent: "center";
    };
    input: {
        fontSize: number;
        height: number;
        maxHeight: number;
        minHeight: number;
        paddingHorizontal: number;
        paddingVertical: number;
        width: "100%";
    };
    inputRow: {
        height: number;
        width: "100%";
    };
    fullWidthInput: {
        paddingHorizontal: number;
    };
    inputTrailing: {
        width: number;
    };
    nativeRoot: {
        flex: number;
    };
    selectInlineTrigger: {
        alignItems: "center";
        flexDirection: "row";
        flexShrink: number;
        gap: number;
        maxWidth: number;
        minHeight: number;
        minWidth: number;
    };
    selectInlineLabel: {
        alignItems: "center";
        flexDirection: "row";
        flexShrink: number;
        gap: number;
        minWidth: number;
    };
    selectSwatch: {
        borderRadius: number;
        height: number;
        width: number;
    };
    trailingHostedContent: {
        alignItems: "center";
        alignSelf: "flex-start";
        flexDirection: "row";
        justifyContent: "flex-start";
    };
    textArea: {
        fontSize: number;
        minHeight: number;
        paddingHorizontal: number;
        paddingVertical: number;
        textAlignVertical: "top";
        width: "100%";
    };
    textAreaRow: {
        width: "100%";
    };
};
export { NativeListRoot, NativeListRoot as NativeList, NativeListSection };
