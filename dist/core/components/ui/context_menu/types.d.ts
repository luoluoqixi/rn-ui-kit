import type { ComponentProps, KeyboardEventHandler, MouseEventHandler, RefObject } from "react";
import type { Menu } from "heroui-native/menu";
import type { Dropdown } from "@heroui/react/dropdown";
import type { MenuContentProps, MenuEntry } from "../menu/types";
import type { PressableProps, ViewProps } from "react-native";
import type { NativeHapticsDelay, NativeHapticsSetting } from "../utils";
import type { RenderProp } from "../utils/render";
import type { MenuAdapterProps } from "../menu/menu_adapter_types";
export type ContextMenuRenderContext = {
    native: boolean;
    open: boolean;
};
export type ContextMenuItemData = {
    "aria-label"?: string;
    "checked"?: boolean;
    "destructive"?: boolean;
    "disabled"?: boolean;
    "icon"?: RenderProp<ContextMenuItemData>;
    /** Custom menus: set false to omit this item's empty icon slot. Defaults to false; supplied icons remain visible. */
    reserveIconSpace?: boolean;
    "iconProps"?: Record<string, unknown>;
    /** 外部菜单适配器的附加数据；不会从 React 图标或文案中猜测宿主配置。 */
    hostData?: Readonly<Record<string, unknown>>;
    "indicator"?: RenderProp<ContextMenuItemData>;
    "itemProps"?: Record<string, unknown>;
    "label"?: RenderProp<ContextMenuItemData>;
    "nativeHaptics"?: NativeHapticsSetting;
    "nativeHapticsDelay"?: NativeHapticsDelay;
    "onPress"?: () => void;
    "onCheckedChange"?: (checked: boolean) => void;
    "onSelect"?: () => void;
    "selected"?: boolean;
    "separator"?: boolean;
    "subMenu"?: ContextMenuItemData[];
    "subMenuTitle"?: RenderProp<ContextMenuItemData> | false;
    "triggerProps"?: Record<string, unknown>;
    "subMenuProps"?: Record<string, unknown>;
    "contentProps"?: Record<string, unknown>;
    "subtitle"?: string;
    "textValue"?: string;
    separatorVariant?: MenuEntry["separatorVariant"];
    shortcut?: string;
    shouldCloseOnSelect?: boolean;
    selectionIndicatorPosition?: MenuEntry["selectionIndicatorPosition"];
    selectionIndicatorVariant?: MenuEntry["selectionIndicatorVariant"];
    herouiNativeProps?: MenuEntry["herouiNativeProps"];
    herouiWebProps?: MenuEntry["herouiWebProps"];
    "value": string;
};
export type ContextMenuItemProps = Partial<ContextMenuItemData> & Record<string, unknown>;
export type ContextMenuNativeIosProps = {
    shouldWaitForMenuToHideBeforeFiringOnPressMenuItem?: boolean;
    [key: string]: unknown;
};
export type ContextMenuContentProps = MenuContentProps;
export type ContextMenuProps = ViewProps & ContextMenuRootExtensions;
export type ContextMenuRootExtensions = MenuAdapterProps & {
    /** Internal handle used by NativeList's Android programmatic anchor. */
    __menuRef?: RefObject<{
        presentMenu: () => void;
    } | null>;
    __unsafeIosProps?: ContextMenuNativeIosProps;
    items?: ContextMenuItemData[];
    itemProps?: ContextMenuItemProps;
    itemNativeHaptics?: NativeHapticsSetting;
    itemNativeHapticsDelay?: NativeHapticsDelay;
    native?: boolean;
    /** 自绘菜单内容配置；系统原生菜单继续由系统布局。 */
    contentProps?: ContextMenuContentProps;
    nativeHaptics?: NativeHapticsSetting;
    nativeHapticsDelay?: NativeHapticsDelay;
    /** iOS native only. Defaults to false so item callbacks run before menu-dismiss animation. */
    nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem?: boolean;
    onOpenWillChange?: (open: boolean) => void;
    trigger?: RenderProp<ContextMenuRenderContext>;
    /** Native 非交互 View/Text/Image 区域自动包装 Pressable；自定义布局组件可设 asChild=false。
     * 自定义按钮默认直接接收按压 props，需要转发 ref 和 Pressable 事件。 */
    triggerProps?: Omit<PressableProps, "children"> & {
        asChild?: boolean;
        onContextMenu?: MouseEventHandler<HTMLElement>;
        onKeyDown?: KeyboardEventHandler<HTMLElement>;
    };
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    accessibilityLabel?: string;
    /** Native 自绘默认相对 trigger 居中；显式设为 touch 才以长按触点定位。Web 始终沿用平台右键定位。 */
    anchor?: "trigger" | "touch";
    herouiNativeProps?: Omit<ComponentProps<typeof Menu>, "children" | "isOpen" | "isDefaultOpen" | "onOpenChange">;
    herouiWebProps?: Omit<ComponentProps<typeof Dropdown>, "children" | "isOpen" | "defaultOpen" | "onOpenChange" | "trigger">;
};
