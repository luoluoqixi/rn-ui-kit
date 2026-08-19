import "rn-ui-kit/initialize";
import {
  Button,
  GlassEffect,
  GlassEffectSearchBar,
  type GlassEffectProps,
  type GlassEffectSearchBarProps,
  type GlassEffectSearchBarCancelButtonProps,
  type GlassEffectSearchBarTrailingContext,
  type ContextMenuItemData,
  Menu,
  type NativeListContextMenuProps,
  type NativeListInputItemProps,
  NativeListMenuItem,
  useNativeListEditMode,
  type NativeListRootProps,
  type NativeListSelectionId,
  NativeTrigger,
  NativeTriggerPressable,
  Select,
  type ButtonProps,
  type MenuProps,
  type NativeListMenuItemProps,
  type NativeTriggerPressableProps,
  type NativeTriggerProps,
  type SelectNativeTriggerPressableProps,
  type SelectNativeTriggerProps,
} from "rn-ui-kit";
import {
  RnUiKitDebugPanel,
  type RnUiKitDebugPanelNativeSheetScreenOptions,
  type RnUiKitDebugPanelPageScreenOptions,
  type RnUiKitDebugPanelProps,
  type RnUiKitDebugPanelSheetProps,
} from "rn-ui-kit/debug";

void Button;
void GlassEffect;
void GlassEffectSearchBar;
void Menu;
void NativeListMenuItem;
void useNativeListEditMode;
void NativeTrigger;
void NativeTriggerPressable;
void Select.NativeTrigger;
void Select.NativeTriggerPressable;
void RnUiKitDebugPanel;

type PublicCoreProps = ButtonProps;
type PublicGlassEffectProps = GlassEffectProps;
type PublicGlassEffectSearchBarProps = GlassEffectSearchBarProps;
type PublicGlassEffectSearchBarCancelButtonProps = GlassEffectSearchBarCancelButtonProps;
type PublicGlassEffectSearchBarTrailingContext = GlassEffectSearchBarTrailingContext;
type PublicContextMenuItemData = ContextMenuItemData;
type PublicNativeListContextMenuProps = NativeListContextMenuProps;
type PublicNativeTriggerProps = NativeTriggerProps;
type PublicNativeTriggerPressableProps = NativeTriggerPressableProps;
type PublicNativeListMenuItemProps = NativeListMenuItemProps;
type PublicNativeListRootProps = NativeListRootProps;
type PublicNativeListSelectionId = NativeListSelectionId;
type PublicSelectNativeTriggerProps = SelectNativeTriggerProps;
type PublicSelectNativeTriggerPressableProps = SelectNativeTriggerPressableProps;
type PublicDebugProps = RnUiKitDebugPanelProps;
type PublicDebugPageScreenOptions = RnUiKitDebugPanelPageScreenOptions;
type PublicDebugNativeSheetScreenOptions = RnUiKitDebugPanelNativeSheetScreenOptions;
type PublicDebugSheetProps = RnUiKitDebugPanelSheetProps;

const hostPanelProps = {
  backButtonLabel: "返回",
  navigationMode: "host",
  nativeSheetScreenOptions: { headerShown: false },
  pageScreenOptions: { headerShown: false },
  panelSheetProps: { snapPoints: [92], snapPointsMode: "percent" },
} satisfies RnUiKitDebugPanelProps;

void hostPanelProps;

const searchBarTrailingProps = {
  focusedTrailing: ({ cancel }: PublicGlassEffectSearchBarTrailingContext) => {
    void cancel;
    return null;
  },
  unfocusedTrailing: false,
} satisfies Pick<GlassEffectSearchBarProps, "focusedTrailing" | "unfocusedTrailing">;

void searchBarTrailingProps;

const glassKeyboardHiddenProps = {
  keyboardAvoidance: true,
  keyboardHiddenConfirmation: { consecutiveFrames: 3, heightThreshold: 10 },
  onKeyboardHidden: () => {},
} satisfies Pick<
  PublicGlassEffectProps,
  "keyboardAvoidance" | "keyboardHiddenConfirmation" | "onKeyboardHidden"
>;

void glassKeyboardHiddenProps;

const searchBarCancelButtonProps = {
  cancelButtonProps: {
    chromeless: true,
    nativeSystemImageSize: 24,
    opacity: 0.8,
    title: "关闭",
  },
  cancelButtonStyle: "glassProminent",
} satisfies Pick<GlassEffectSearchBarProps, "cancelButtonProps" | "cancelButtonStyle">;

void searchBarCancelButtonProps;

const nativeIconButtonProps = {
  native: "swift-ui",
  nativeButtonStyle: "glass",
  nativeSystemImage: "xmark",
  nativeSystemImageSize: 22,
  buttonSize: { height: 60, width: 60 },
  nativeSwiftProps: {
    label: "关闭",
    modifiers: [],
    role: "cancel",
    systemImage: "xmark.circle",
    target: "close-search",
  },
} satisfies ButtonProps;

void nativeIconButtonProps;

const nativeTextButtonProps = {
  native: "swift-ui",
  title: "完成",
} satisfies ButtonProps;

void nativeTextButtonProps;

const nativeMenuProps = {
  nativeTrigger: true,
  nativeTriggerIcon: "chevrons-up-down",
  nativeTriggerLabel: "菜单操作",
  items: [
    {
      icon: "更多操作图标",
      iconProps: {
        androidIconName: "ic_menu_more",
        ios: { name: "ellipsis.circle", weight: "semibold" },
      },
      label: "更多操作",
      subMenu: [
        { label: "编辑", value: "edit" },
        { label: "分隔线", separator: true, value: "nested-separator" },
        { destructive: true, label: "删除", value: "delete" },
      ],
      subMenuTitle: "操作",
      value: "more",
    },
  ],
} satisfies MenuProps;

const nativeTriggerProps = {
  accessibilityHint: "打开菜单",
  android_ripple: { borderless: true },
  hitSlop: 8,
  label: "菜单操作",
  onLongPress: () => {},
} satisfies NativeTriggerProps;

void nativeMenuProps;
void nativeTriggerProps;

const nativeListMenuItemProps = {
  menuProps: {
    items: [{ label: "编辑", value: "edit" }],
  },
  title: "更多操作",
} satisfies NativeListMenuItemProps;

void nativeListMenuItemProps;

const nativeListEditModeProps = {
  editMode: true,
  onSelectedIdsChange: (_selectedIds: NativeListSelectionId[]) => {},
  refreshColor: "#7c3aed",
  refreshEnabledInEditMode: true,
  selectedIds: ["first-row"],
} satisfies NativeListRootProps;

void nativeListEditModeProps;

const nativeListSelectionDisabledProps = {
  inputProps: {},
  inputWidth: 200,
  selectionDisabled: true,
  title: "不可选择的输入项",
} satisfies NativeListInputItemProps;

void nativeListSelectionDisabledProps;

const nativeListContextMenuProps = {
  items: [
    {
      label: "更多操作",
      subMenu: [
        { label: "编辑", value: "edit" },
        { destructive: true, label: "删除", value: "delete" },
      ],
      value: "more",
    },
  ],
} satisfies NativeListContextMenuProps;

void nativeListContextMenuProps;

export type {
  PublicCoreProps,
  PublicContextMenuItemData,
  PublicDebugNativeSheetScreenOptions,
  PublicDebugPageScreenOptions,
  PublicDebugProps,
  PublicDebugSheetProps,
  PublicNativeTriggerPressableProps,
  PublicNativeTriggerProps,
  PublicNativeListMenuItemProps,
  PublicNativeListContextMenuProps,
  PublicNativeListRootProps,
  PublicNativeListSelectionId,
  PublicSelectNativeTriggerPressableProps,
  PublicSelectNativeTriggerProps,
};
