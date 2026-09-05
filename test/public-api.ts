import "rn-ui-kit/initialize";
import {
  Button,
  GlassEffect,
  GlassEffectSearchBar,
  type GlassEffectProps,
  type GlassEffectSearchBarProps,
  type GlassEffectSearchBarCancelButtonProps,
  type GlassEffectSearchBarTrailingContext,
  Dropdown,
  type NativeListContextMenuProps,
  type NativeListInputItemProps,
  NativeListDropdownItem,
  NativeSheetStack,
  useTrueSheetStackHost,
  useNativeListEditMode,
  type NativeListRootProps,
  type NativeSheetStackHeaderButtonProps,
  type NativeSheetStackHeaderLeftItems,
  type NativeSheetStackHeaderRightItems,
  type NativeSheetStackProps,
  type NativeListSelectionId,
  NativeTrigger,
  NativeTriggerPressable,
  ScrollView,
  Select,
  useKeyboardAvoidance,
  useKeyboardVisibility,
  type ButtonProps,
  type KeyboardHiddenConfirmation,
  type KeyboardVisibilityOptions,
  type KeyboardVisibilityPhase,
  type NativeListDropdownItemProps,
  type NativeTriggerPressableProps,
  type NativeTriggerProps,
  type SelectProps,
  type ScrollViewProps,
  type CustomScrollbarOptions,
  Textarea,
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
void Dropdown;
void NativeListDropdownItem;
void NativeSheetStack;
void useTrueSheetStackHost;
void useNativeListEditMode;
void NativeTrigger;
void NativeTriggerPressable;
void ScrollView;
void Textarea;
void useKeyboardAvoidance;
void useKeyboardVisibility;
void RnUiKitDebugPanel;

type PublicCoreProps = ButtonProps;
type PublicGlassEffectProps = GlassEffectProps;
type PublicGlassEffectSearchBarProps = GlassEffectSearchBarProps;
type PublicGlassEffectSearchBarCancelButtonProps = GlassEffectSearchBarCancelButtonProps;
type PublicGlassEffectSearchBarTrailingContext = GlassEffectSearchBarTrailingContext;
type PublicNativeListContextMenuProps = NativeListContextMenuProps;
type PublicNativeTriggerProps = NativeTriggerProps;
type PublicNativeTriggerPressableProps = NativeTriggerPressableProps;
type PublicNativeListDropdownItemProps = NativeListDropdownItemProps;
type PublicNativeListRootProps = NativeListRootProps;
type PublicNativeSheetStackProps = NativeSheetStackProps;
type PublicNativeSheetStackHeaderButtonProps = NativeSheetStackHeaderButtonProps;
type PublicNativeSheetStackHeaderLeftItems = NativeSheetStackHeaderLeftItems;
type PublicNativeSheetStackHeaderRightItems = NativeSheetStackHeaderRightItems;
type PublicNativeListSelectionId = NativeListSelectionId;
type PublicSelectProps = SelectProps;
type PublicScrollViewProps = ScrollViewProps;
type PublicCustomScrollbarOptions = CustomScrollbarOptions;
type PublicDebugProps = RnUiKitDebugPanelProps;
type PublicDebugPageScreenOptions = RnUiKitDebugPanelPageScreenOptions;
type PublicDebugNativeSheetScreenOptions = RnUiKitDebugPanelNativeSheetScreenOptions;
type PublicDebugSheetProps = RnUiKitDebugPanelSheetProps;
type PublicKeyboardHiddenConfirmation = KeyboardHiddenConfirmation;
type PublicKeyboardVisibilityOptions = KeyboardVisibilityOptions;
type PublicKeyboardVisibilityPhase = KeyboardVisibilityPhase;

const hostPanelProps = {
  backButtonLabel: "返回",
  navigationMode: "host",
  nativeSheetScreenOptions: { headerShown: false },
  pageScreenOptions: { headerShown: false },
  panelSheetProps: { snapPoints: [0.92] },
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
  keyboardHiddenConfirmation: { consecutiveFrames: 3, finalHeight: -64, heightThreshold: 10 },
  onKeyboardHidden: () => {},
} satisfies Pick<
  PublicGlassEffectProps,
  "keyboardAvoidance" | "keyboardHiddenConfirmation" | "onKeyboardHidden"
>;

void glassKeyboardHiddenProps;

const keyboardVisibilityOptions = {
  hiddenConfirmation: { consecutiveFrames: 2, heightThreshold: 12 },
  onPhaseChange: (phase) => {
    void phase;
  },
} satisfies KeyboardVisibilityOptions;

void keyboardVisibilityOptions;
void ({} as PublicKeyboardHiddenConfirmation);
void ({} as PublicKeyboardVisibilityOptions);
void ({} as PublicKeyboardVisibilityPhase);

const searchBarCancelButtonProps = {
  cancelButtonProps: {
    nativeSystemImageSize: 24,
    title: "关闭",
  },
  cancelButtonStyle: "glassProminent",
} satisfies Pick<GlassEffectSearchBarProps, "cancelButtonProps" | "cancelButtonStyle">;

void searchBarCancelButtonProps;

const nativeIconButtonProps = {
  native: true,
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
  native: true,
  title: "完成",
} satisfies ButtonProps;

void nativeTextButtonProps;

const textButtonProps = {
  buttonColor: "#0f766e",
  loadingIcon: null,
  textClassName: "no-underline text-primary",
  textStyle: { textDecorationLine: "none" },
  title: "完成",
} satisfies ButtonProps;

void textButtonProps;

const nativeTriggerProps = {
  accessibilityHint: "打开菜单",
  android_ripple: { borderless: true },
  hitSlop: 8,
  label: "菜单操作",
  onLongPress: () => {},
} satisfies NativeTriggerProps;

void nativeTriggerProps;

const selectProps = {
  items: [{ label: "选项", value: "option" }],
  onValueChange: (_value: string | null) => {},
  value: "option",
} satisfies SelectProps;

void selectProps;

const customScrollbarOptions = {
  alwaysVisible: true,
  styling: {
    thumbBorderRadius: 6,
    thumbColor: "#666666",
    thumbHoverColor: "#777777",
    thumbPressedColor: "#888888",
    thumbShadow: {
      elevation: 2,
      offset: { height: 1, width: 0 },
      opacity: 0.2,
      radius: 3,
    },
    trackBorderRadius: 4,
    trackHoverColor: "#eeeeee",
    trackPressedColor: "#dddddd",
    trackWidth: 5,
  },
} satisfies CustomScrollbarOptions;

const scrollViewProps = {
  customScrollbar: customScrollbarOptions,
} satisfies Pick<ScrollViewProps, "customScrollbar">;

void customScrollbarOptions;
void scrollViewProps;
void ({} as PublicNativeSheetStackProps);

const nativeSheetStackProps = {
  children: null,
  headerLeft: () => null,
  headerLeftButtonProps: {
    accessibilityLabel: "添加",
    customButtonProps: { size: "sm", variant: "link" },
    iosButtonProps: {
      icon: { name: "plus", type: "sfSymbol" },
      variant: "plain",
    },
    label: "添加",
    onPress: () => {},
  } satisfies PublicNativeSheetStackHeaderButtonProps,
  headerLeftItems: (() => [
    {
      label: "添加",
      onPress: () => {},
      type: "button",
    },
  ]) satisfies PublicNativeSheetStackHeaderLeftItems,
  headerRight: () => null,
  headerRightButtonVisible: true,
  headerRightButtonProps: {
    accessibilityLabel: "关闭",
    closeSheetOnPress: true,
    customButtonProps: { nativeHaptics: true },
    iosButtonProps: { variant: "done" },
    onPress: () => {},
    label: "关闭",
  },
  headerRightItems: (() => [
    {
      label: "关闭",
      onPress: () => {},
      type: "button",
    },
  ]) satisfies PublicNativeSheetStackHeaderRightItems,
} satisfies Pick<
  PublicNativeSheetStackProps,
  | "children"
  | "headerLeft"
  | "headerLeftButtonProps"
  | "headerLeftItems"
  | "headerRight"
  | "headerRightButtonVisible"
  | "headerRightButtonProps"
  | "headerRightItems"
>;

void nativeSheetStackProps;

const nativeListMenuItemProps = {
  dropdownProps: {
    items: [{ label: "编辑", value: "edit" }],
  },
  title: "更多操作",
} satisfies NativeListDropdownItemProps;

void nativeListMenuItemProps;

const nativeListEditModeProps = {
  basicScrollViewProps: {
    customScrollbar: true,
    scrollEnabled: false,
  },
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
  PublicDebugNativeSheetScreenOptions,
  PublicDebugPageScreenOptions,
  PublicDebugProps,
  PublicDebugSheetProps,
  PublicNativeTriggerPressableProps,
  PublicNativeTriggerProps,
  PublicNativeListDropdownItemProps,
  PublicNativeListContextMenuProps,
  PublicNativeListRootProps,
  PublicNativeListSelectionId,
  PublicScrollViewProps,
  PublicCustomScrollbarOptions,
  PublicSelectProps,
};
