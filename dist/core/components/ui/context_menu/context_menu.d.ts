import type { ContextMenuProps } from "./types";
declare function ContextMenuRoot(p: ContextMenuProps): import("react").JSX.Element;
export declare const ContextMenu: typeof ContextMenuRoot & (({ children, items, itemProps, itemNativeHaptics, itemNativeHapticsDelay, nativeHaptics, nativeHapticsDelay, onOpenChange, onOpenWillChange, trigger, triggerProps, nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem, __menuRef, __unsafeIosProps, ...props }: ContextMenuProps) => import("react").JSX.Element) & {
    Arrow: import("react").FC<import("@radix-ui/react-context-menu").ContextMenuArrowProps & import("react").RefAttributes<SVGSVGElement>>;
    Auxiliary: import("react").FC<import("zeego/lib/typescript/menu").ContextMenuAuxliliaryProps>;
    CheckboxItem: ({ children, checked, onCheckedChange, ...props }: any) => import("react").JSX.Element;
    Content: ({ children, ...props }: any) => import("react").JSX.Element;
    Group: import("react").FC<import("@radix-ui/react-context-menu").ContextMenuGroupProps & import("react").RefAttributes<HTMLDivElement>>;
    Item: ({ children, variant, ...props }: any) => import("react").JSX.Element;
    ItemIcon: import("react").FC<import("zeego/lib/typescript/menu").MenuItemIconProps>;
    ItemImage: import("react").FC<Omit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "src" | "ref" | "height" | "width"> & {
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
    ItemIndicator: import("react").FC<import("@radix-ui/react-context-menu").ContextMenuItemIndicatorProps & import("react").RefAttributes<HTMLSpanElement>>;
    ItemSubtitle: import("react").FC<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "children"> & {
        children: string;
    }>;
    ItemTitle: import("react").FC<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "children"> & {
        children: string | React.ReactNode;
    }>;
    Label: ({ children, ...props }: any) => import("react").JSX.Element;
    Portal: import("react").ExoticComponent<import("react").FragmentProps>;
    Preview: import("react").FC<import("zeego/lib/typescript/menu").ContextMenuPreviewProps>;
    RadioGroup: ({ children, onValueChange, value }: any) => import("react").JSX.Element;
    RadioItem: ({ children, value, ...props }: any) => import("react").JSX.Element;
    Root: ({ children, items, itemProps, itemNativeHaptics, itemNativeHapticsDelay, nativeHaptics, nativeHapticsDelay, onOpenChange, onOpenWillChange, trigger, triggerProps, nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem, __menuRef, __unsafeIosProps, ...props }: ContextMenuProps) => import("react").JSX.Element;
    Separator: import("react").FC<import("@radix-ui/react-context-menu").ContextMenuSeparatorProps & import("react").RefAttributes<HTMLDivElement>>;
    Shortcut: () => null;
    Sub: import("react").FC<import("zeego/lib/typescript/menu").MenuSubProps>;
    SubContent: ({ children, ...props }: any) => import("react").JSX.Element;
    SubTrigger: ({ children, ...props }: any) => import("react").JSX.Element;
    Trigger: ({ children, ...props }: any) => import("react").JSX.Element;
} & {
    Root: typeof ContextMenuRoot;
};
export {};
