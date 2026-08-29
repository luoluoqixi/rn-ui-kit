import * as React from "react";
import type { ContextMenuProps } from "./types";
declare function ContextMenu({ children, items, itemProps, itemNativeHaptics, nativeHaptics, onOpenChange, onOpenWillChange, trigger, triggerProps, nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem, __menuRef, __unsafeIosProps, ...props }: ContextMenuProps): React.JSX.Element;
declare function ContextMenuTrigger({ children, ...props }: any): React.JSX.Element;
declare function ContextMenuContent({ children, ...props }: any): React.JSX.Element;
declare function ContextMenuSubContent({ children, ...props }: any): React.JSX.Element;
declare function ContextMenuSubTrigger({ children, ...props }: any): React.JSX.Element;
declare function ContextMenuItem({ children, variant, ...props }: any): React.JSX.Element;
declare function ContextMenuCheckboxItem({ children, checked, onCheckedChange, ...props }: any): React.JSX.Element;
declare function ContextMenuRadioGroup({ children, onValueChange, value }: any): React.JSX.Element;
declare function ContextMenuRadioItem({ children, value, ...props }: any): React.JSX.Element;
declare function ContextMenuLabel({ children, ...props }: any): React.JSX.Element;
declare function ContextMenuShortcut(): null;
declare const ContextMenuComponent: typeof ContextMenu & {
    Arrow: React.FC<import("@radix-ui/react-context-menu").ContextMenuArrowProps & React.RefAttributes<SVGSVGElement>>;
    Auxiliary: React.FC<import("zeego/lib/typescript/menu").ContextMenuAuxliliaryProps>;
    CheckboxItem: typeof ContextMenuCheckboxItem;
    Content: typeof ContextMenuContent;
    Group: React.FC<import("@radix-ui/react-context-menu").ContextMenuGroupProps & React.RefAttributes<HTMLDivElement>>;
    Item: typeof ContextMenuItem;
    ItemIcon: React.FC<import("zeego/lib/typescript/menu").MenuItemIconProps>;
    ItemImage: React.FC<Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "src" | "ref" | "width" | "height"> & {
        source: (number | import("react-native").ImageURISource) | {
            src: string;
        };
        width?: number;
        height?: number;
        ios?: {
            style?: import("react-native-ios-utilities").ImageOptions;
            lazy?: boolean;
        };
        accessibilityLabel?: string;
    }>;
    ItemIndicator: React.FC<import("@radix-ui/react-context-menu").ContextMenuItemIndicatorProps & React.RefAttributes<HTMLSpanElement>>;
    ItemSubtitle: React.FC<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "children"> & {
        children: string;
    }>;
    ItemTitle: React.FC<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "children"> & {
        children: string | React.ReactNode;
    }>;
    Label: typeof ContextMenuLabel;
    Portal: React.ExoticComponent<React.FragmentProps>;
    Preview: React.FC<import("zeego/lib/typescript/menu").ContextMenuPreviewProps>;
    RadioGroup: typeof ContextMenuRadioGroup;
    RadioItem: typeof ContextMenuRadioItem;
    Root: typeof ContextMenu;
    Separator: React.FC<import("@radix-ui/react-context-menu").ContextMenuSeparatorProps & React.RefAttributes<HTMLDivElement>>;
    Shortcut: typeof ContextMenuShortcut;
    Sub: React.FC<import("zeego/lib/typescript/menu").MenuSubProps>;
    SubContent: typeof ContextMenuSubContent;
    SubTrigger: typeof ContextMenuSubTrigger;
    Trigger: typeof ContextMenuTrigger;
};
export { ContextMenuComponent as ContextMenu };
export declare const ContextMenuNative: typeof ContextMenu & {
    Arrow: React.FC<import("@radix-ui/react-context-menu").ContextMenuArrowProps & React.RefAttributes<SVGSVGElement>>;
    Auxiliary: React.FC<import("zeego/lib/typescript/menu").ContextMenuAuxliliaryProps>;
    CheckboxItem: typeof ContextMenuCheckboxItem;
    Content: typeof ContextMenuContent;
    Group: React.FC<import("@radix-ui/react-context-menu").ContextMenuGroupProps & React.RefAttributes<HTMLDivElement>>;
    Item: typeof ContextMenuItem;
    ItemIcon: React.FC<import("zeego/lib/typescript/menu").MenuItemIconProps>;
    ItemImage: React.FC<Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "src" | "ref" | "width" | "height"> & {
        source: (number | import("react-native").ImageURISource) | {
            src: string;
        };
        width?: number;
        height?: number;
        ios?: {
            style?: import("react-native-ios-utilities").ImageOptions;
            lazy?: boolean;
        };
        accessibilityLabel?: string;
    }>;
    ItemIndicator: React.FC<import("@radix-ui/react-context-menu").ContextMenuItemIndicatorProps & React.RefAttributes<HTMLSpanElement>>;
    ItemSubtitle: React.FC<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "children"> & {
        children: string;
    }>;
    ItemTitle: React.FC<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "children"> & {
        children: string | React.ReactNode;
    }>;
    Label: typeof ContextMenuLabel;
    Portal: React.ExoticComponent<React.FragmentProps>;
    Preview: React.FC<import("zeego/lib/typescript/menu").ContextMenuPreviewProps>;
    RadioGroup: typeof ContextMenuRadioGroup;
    RadioItem: typeof ContextMenuRadioItem;
    Root: typeof ContextMenu;
    Separator: React.FC<import("@radix-ui/react-context-menu").ContextMenuSeparatorProps & React.RefAttributes<HTMLDivElement>>;
    Shortcut: typeof ContextMenuShortcut;
    Sub: React.FC<import("zeego/lib/typescript/menu").MenuSubProps>;
    SubContent: typeof ContextMenuSubContent;
    SubTrigger: typeof ContextMenuSubTrigger;
    Trigger: typeof ContextMenuTrigger;
};
