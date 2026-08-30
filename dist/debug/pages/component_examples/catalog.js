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
export const componentExampleDefinitions = [
    { Component: AccordionExample, key: "accordion", label: "Accordion" },
    { Component: AlertExample, key: "alert", label: "Alert" },
    { Component: AlertDialogExample, key: "alert-dialog", label: "AlertDialog" },
    { Component: AspectRatioExample, key: "aspect-ratio", label: "AspectRatio" },
    { Component: AvatarExample, key: "avatar", label: "Avatar" },
    { Component: BadgeExample, key: "badge", label: "Badge" },
    { Component: ButtonExample, key: "button", label: "Button" },
    { Component: CardExample, key: "card", label: "Card" },
    { Component: CheckboxExample, key: "checkbox", label: "Checkbox" },
    { Component: CollapsibleExample, key: "collapsible", label: "Collapsible" },
    { Component: ContextMenuExample, key: "context-menu", label: "ContextMenu" },
    { Component: DialogExample, key: "dialog", label: "Dialog" },
    { Component: DropdownExample, key: "dropdown", label: "Dropdown" },
    {
        Component: GlassEffectExample,
        key: "glass-effect",
        label: "GlassEffect",
        layout: "fill",
    },
    {
        Component: IconExample,
        key: "icon",
        label: "Icon",
    },
    { Component: InputExample, key: "input", label: "Input" },
    { Component: LabelExample, key: "label", label: "Label" },
    { Component: LinkExample, key: "link", label: "Link" },
    {
        Component: MenubarExample,
        key: "menubar",
        label: "Menubar",
    },
    {
        Component: NativeDialogExample,
        key: "native-dialog",
        label: "NativeDialog",
    },
    {
        Component: NativeListExample,
        key: "native-list",
        label: "NativeList",
        layout: "fill",
    },
    { Component: PopoverExample, key: "popover", label: "Popover" },
    { Component: ProgressExample, key: "progress", label: "Progress" },
    { Component: RadioGroupExample, key: "radio-group", label: "RadioGroup" },
    { Component: ScrollViewExample, key: "scroll-view", label: "ScrollView" },
    { Component: SelectExample, key: "select", label: "Select" },
    { Component: SeparatorExample, key: "separator", label: "Separator" },
    { Component: SheetExample, key: "sheet", label: "Sheet" },
    { Component: SkeletonExample, key: "skeleton", label: "Skeleton" },
    { Component: SliderExample, key: "slider", label: "Slider" },
    { Component: SpinnerExample, key: "spinner", label: "Spinner" },
    {
        Component: SplitLayoutExample,
        key: "split-view",
        label: "SplitView / SplitLayout",
        layout: "fill",
    },
    { Component: SwitchExample, key: "switch", label: "Switch" },
    { Component: TabsExample, key: "tabs", label: "Tabs" },
    { Component: TextExample, key: "text", label: "Text" },
    { Component: TextAreaExample, key: "text-area", label: "TextArea" },
    { Component: ToastExample, key: "toast", label: "Toast" },
    { Component: ToggleExample, key: "toggle", label: "Toggle" },
    { Component: ToggleGroupExample, key: "toggle-group", label: "ToggleGroup" },
    { Component: TooltipExample, key: "tooltip", label: "Tooltip" },
];
