import "rn-ui-kit/initialize";
import {
  Button,
  Menu,
  NativeListMenuItem,
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
void Menu;
void NativeListMenuItem;
void NativeTrigger;
void NativeTriggerPressable;
void Select.NativeTrigger;
void Select.NativeTriggerPressable;
void RnUiKitDebugPanel;

type PublicCoreProps = ButtonProps;
type PublicNativeTriggerProps = NativeTriggerProps;
type PublicNativeTriggerPressableProps = NativeTriggerPressableProps;
type PublicNativeListMenuItemProps = NativeListMenuItemProps;
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

const nativeMenuProps = {
  nativeTrigger: true,
  nativeTriggerIcon: "chevrons-up-down",
  nativeTriggerLabel: "菜单操作",
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

export type {
  PublicCoreProps,
  PublicDebugNativeSheetScreenOptions,
  PublicDebugPageScreenOptions,
  PublicDebugProps,
  PublicDebugSheetProps,
  PublicNativeTriggerPressableProps,
  PublicNativeTriggerProps,
  PublicNativeListMenuItemProps,
  PublicSelectNativeTriggerPressableProps,
  PublicSelectNativeTriggerProps,
};
