import { ListItem } from "../list_item";
import { Separator } from "../separator";
import type { ListGroupGroupItemProps, ListGroupItemData, ListGroupProps } from "./types";
declare function ListGroupItemSlot(props: ListGroupGroupItemProps): import("react").JSX.Element;
declare function ListGroupRoot(props: ListGroupProps): import("react").JSX.Element;
export declare const ListGroup: typeof ListGroupRoot & {
    Group: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }>, keyof import("tamagui").GroupExtraProps | "__scopeGroup"> & import("tamagui").GroupExtraProps & {
        __scopeGroup?: import("tamagui").Scope;
    } & import("react").RefAttributes<import("tamagui").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }>, keyof import("tamagui").GroupExtraProps | "__scopeGroup"> & import("tamagui").GroupExtraProps & {
        __scopeGroup?: import("tamagui").Scope;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").GroupExtraProps & {
        __scopeGroup?: import("tamagui").Scope;
    }, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
        __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
            elevation?: number | import("tamagui").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            size?: any;
        }>, keyof import("tamagui").GroupExtraProps | "__scopeGroup"> & import("tamagui").GroupExtraProps & {
            __scopeGroup?: import("tamagui").Scope;
        }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").GroupExtraProps & {
            __scopeGroup?: import("tamagui").Scope;
        }, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
            elevation?: number | import("tamagui").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            size?: any;
        }, import("@tamagui/web").StaticConfigPublic];
    } & {
        Item: (props: import("tamagui").GroupItemProps & Record<string, any> & {
            __scopeGroup?: import("tamagui").Scope;
        }) => any;
    };
    GroupItem: typeof ListGroupItemSlot;
    Item: typeof ListItem;
    Separator: typeof Separator;
};
export type { ListGroupGroupItemProps, ListGroupItemData, ListGroupProps };
