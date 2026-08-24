import { ButtonExample } from "./examples/button";
import { CheckboxExample } from "./examples/checkbox";
import { SwitchExample } from "./examples/switch";
import { ToggleGroupExample } from "./examples/toggle_group";
import { SliderExample } from "./examples/slider";
import { SpinnerExample } from "./examples/spinner";
import { ProgressExample } from "./examples/progress";
import { ToastExample } from "./examples/toast";
import { NativeDialogExample } from "./examples/native_dialog";
import { InputExample } from "./examples/input";
import { TextAreaExample } from "./examples/text_area";
import { SelectExample } from "./examples/select";
import { RadioGroupExample } from "./examples/radio_group";
import { GlassEffectExample } from "./examples/glass_effect";
import { LabelExample } from "./examples/label";
import { AccordionExample } from "./examples/accordion";
import { TabsExample } from "./examples/tabs";
import { SplitLayoutExample } from "./examples/split_layout";
import { DialogExample } from "./examples/dialog";
import { AlertDialogExample } from "./examples/alert_dialog";
import { ContextMenuExample } from "./examples/context_menu";
import { DropdownExample } from "./examples/dropdown";
import { PopoverExample } from "./examples/popover";
import { SheetExample } from "./examples/sheet";
import { TooltipExample } from "./examples/tooltip";
import { NativeListExample } from "./examples/native_list";
import { ScrollViewExample } from "./examples/scroll_view";
import { AvatarExample } from "./examples/avatar";
import { TextExample } from "./examples/text";
import { CardExample } from "./examples/card";
import { SeparatorExample } from "./examples/separator";
import { LinkExample } from "./examples/link";
import { AlertExample } from "./examples/alert";
import { BadgeExample } from "./examples/badge";
import { AspectRatioExample } from "./examples/aspect_ratio";
import { CollapsibleExample } from "./examples/collapsible";
import { SkeletonExample } from "./examples/skeleton";
import { ToggleExample } from "./examples/toggle";
import { IconExample } from "./examples/icon";
import { MenubarExample } from "./examples/menubar";

import type { ComponentExampleDefinition } from "./types";

export const componentExampleDefinitions: ComponentExampleDefinition[] = [
  { Component: ButtonExample, group: "动作与反馈", key: "button", label: "Button" },
  { Component: CheckboxExample, group: "动作与反馈", key: "checkbox", label: "Checkbox" },
  { Component: SwitchExample, group: "动作与反馈", key: "switch", label: "Switch" },
  { Component: ToggleGroupExample, group: "动作与反馈", key: "toggle-group", label: "ToggleGroup" },
  { Component: SliderExample, group: "动作与反馈", key: "slider", label: "Slider" },
  { Component: SpinnerExample, group: "动作与反馈", key: "spinner", label: "Spinner" },
  { Component: ProgressExample, group: "动作与反馈", key: "progress", label: "Progress" },
  { Component: ToastExample, group: "动作与反馈", key: "toast", label: "Toast" },
  {
    Component: NativeDialogExample,
    group: "动作与反馈",
    key: "native-dialog",
    label: "NativeDialog",
  },
  { Component: InputExample, group: "输入与表单", key: "input", label: "Input" },
  { Component: TextAreaExample, group: "输入与表单", key: "text-area", label: "TextArea" },
  { Component: SelectExample, group: "输入与表单", key: "select", label: "Select" },
  { Component: RadioGroupExample, group: "输入与表单", key: "radio-group", label: "RadioGroup" },
  {
    Component: GlassEffectExample,
    group: "组合与布局",
    key: "glass-effect",
    label: "GlassEffect",
    layout: "fill",
  },
  { Component: LabelExample, group: "输入与表单", key: "label", label: "Label" },
  { Component: AccordionExample, group: "组合与布局", key: "accordion", label: "Accordion" },
  { Component: TabsExample, group: "组合与布局", key: "tabs", label: "Tabs" },
  {
    Component: SplitLayoutExample,
    group: "组合与布局",
    key: "split-view",
    label: "SplitView / SplitLayout",
    layout: "fill",
  },
  { Component: DialogExample, group: "浮层与菜单", key: "dialog", label: "Dialog" },
  { Component: AlertDialogExample, group: "浮层与菜单", key: "alert-dialog", label: "AlertDialog" },
  { Component: ContextMenuExample, group: "浮层与菜单", key: "context-menu", label: "ContextMenu" },
  {
    Component: DropdownExample,
    group: "浮层与菜单",
    key: "dropdown",
    label: "Dropdown",
  },
  { Component: PopoverExample, group: "浮层与菜单", key: "popover", label: "Popover" },
  { Component: SheetExample, group: "浮层与菜单", key: "sheet", label: "Sheet" },
  { Component: TooltipExample, group: "浮层与菜单", key: "tooltip", label: "Tooltip" },
  {
    Component: NativeListExample,
    group: "列表与滚动",
    key: "native-list",
    label: "NativeList",
    layout: "fill",
  },
  { Component: ScrollViewExample, group: "列表与滚动", key: "scroll-view", label: "ScrollView" },
  { Component: AvatarExample, group: "内容展示", key: "avatar", label: "Avatar" },
  { Component: TextExample, group: "内容展示", key: "text", label: "Text" },
  { Component: CardExample, group: "内容展示", key: "card", label: "Card" },
  { Component: SeparatorExample, group: "内容展示", key: "separator", label: "Separator" },
  { Component: LinkExample, group: "内容展示", key: "link", label: "Link" },
  { Component: AlertExample, group: "内容展示", key: "alert", label: "Alert" },
  { Component: BadgeExample, group: "内容展示", key: "badge", label: "Badge" },
  { Component: AspectRatioExample, group: "组合与布局", key: "aspect-ratio", label: "AspectRatio" },
  { Component: CollapsibleExample, group: "组合与布局", key: "collapsible", label: "Collapsible" },
  { Component: SkeletonExample, group: "内容展示", key: "skeleton", label: "Skeleton" },
  { Component: ToggleExample, group: "动作与反馈", key: "toggle", label: "Toggle" },
  { Component: IconExample, group: "内容展示", key: "icon", label: "Icon" },
  { Component: MenubarExample, group: "浮层与菜单", key: "menubar", label: "Menubar" },
];
