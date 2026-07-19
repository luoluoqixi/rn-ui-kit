import type { GetProps, TamaguiComponent, TamaguiComponentExpectingVariants, ViewProps } from "@tamagui/core";
import type { ForwardRefExoticComponent, FunctionComponent, RefAttributes } from "react";
import type { View as RNView } from "react-native";
import type { SheetProps, SheetScopedProps } from "./types";
type SharedSheetProps = {
    open?: boolean;
};
type BaseProps = ViewProps & SharedSheetProps;
type SheetStyledComponent = TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>;
export declare function createSheet<H extends TamaguiComponent | SheetStyledComponent, F extends TamaguiComponent | SheetStyledComponent, O extends TamaguiComponent | SheetStyledComponent>({ Handle, Frame, Overlay }: {
    Handle: H;
    Frame: F;
    Overlay: O;
}): ForwardRefExoticComponent<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: ((open: boolean) => void) | import("react").Dispatch<import("react").SetStateAction<boolean>>;
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: import("./types").SnapPointsMode;
    onPositionChange?: import("./types").PositionChangeHandler;
    children?: import("react").ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    disableRemoveScroll?: boolean;
    forceRemoveScrollEnabled?: boolean;
    transitionConfig?: import("@tamagui/web").AnimatedNumberStrategy;
    preferAdaptParentOpenState?: boolean;
    unmountChildrenWhenHidden?: boolean;
    native?: "ios"[] | boolean;
    transition?: import("tamagui").TransitionProp;
    handleDisableScroll?: boolean;
    disableDrag?: boolean;
    modal?: boolean;
    zIndex?: number;
    portalProps?: import("tamagui").PortalProps;
    moveOnKeyboardChange?: boolean;
    containerComponent?: React.ComponentType<any>;
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
} & {
    __scopeSheet?: import("tamagui").Scope<any>;
} & RefAttributes<RNView>> & {
    Controlled: FunctionComponent<Omit<SheetProps, "open" | "onOpenChange"> & RefAttributes<RNView>> & {
        Frame: ForwardRefExoticComponent<SheetScopedProps<Omit<GetProps<F>, keyof {
            /**
             * By default the sheet adds a view below its bottom that extends down another 50%,
             * this is useful if your Sheet has a spring animation that bounces "past" the top when
             * opening, preventing it from showing the content underneath.
             */
            disableHideBottomOverflow?: boolean;
            /**
             * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
             * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
             * turned on, the inner content is always set to the max height of the sheet.
             */
            adjustPaddingForOffscreenContent?: boolean;
        }> & {
            /**
             * By default the sheet adds a view below its bottom that extends down another 50%,
             * this is useful if your Sheet has a spring animation that bounces "past" the top when
             * opening, preventing it from showing the content underneath.
             */
            disableHideBottomOverflow?: boolean;
            /**
             * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
             * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
             * turned on, the inner content is always set to the max height of the sheet.
             */
            adjustPaddingForOffscreenContent?: boolean;
        }>>;
        Overlay: TamaguiComponent<Omit<BaseProps, "__scopeSheet"> & {
            __scopeSheet?: import("tamagui").Scope<any>;
        }, any, any, any, SharedSheetProps, {}> | TamaguiComponent<Omit<BaseProps, "__scopeSheet"> & {
            __scopeSheet?: import("tamagui").Scope<any>;
        }, any, {
            __scopeSheet?: import("tamagui").Scope<any>;
        }, {}, {}, {}>;
        Handle: TamaguiComponent<any, any, any, any, SharedSheetProps, {}> | TamaguiComponent<any, any, any, {}, {}, {}>;
        ScrollView: ForwardRefExoticComponent<import("./SheetScrollView").SheetScrollViewProps & RefAttributes<import("react-native").ScrollView>>;
    };
    Frame: ForwardRefExoticComponent<SheetScopedProps<Omit<GetProps<F>, keyof {
        /**
         * By default the sheet adds a view below its bottom that extends down another 50%,
         * this is useful if your Sheet has a spring animation that bounces "past" the top when
         * opening, preventing it from showing the content underneath.
         */
        disableHideBottomOverflow?: boolean;
        /**
         * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
         * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
         * turned on, the inner content is always set to the max height of the sheet.
         */
        adjustPaddingForOffscreenContent?: boolean;
    }> & {
        /**
         * By default the sheet adds a view below its bottom that extends down another 50%,
         * this is useful if your Sheet has a spring animation that bounces "past" the top when
         * opening, preventing it from showing the content underneath.
         */
        disableHideBottomOverflow?: boolean;
        /**
         * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
         * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
         * turned on, the inner content is always set to the max height of the sheet.
         */
        adjustPaddingForOffscreenContent?: boolean;
    }>>;
    Overlay: TamaguiComponent<Omit<BaseProps, "__scopeSheet"> & {
        __scopeSheet?: import("tamagui").Scope<any>;
    }, any, any, any, SharedSheetProps, {}> | TamaguiComponent<Omit<BaseProps, "__scopeSheet"> & {
        __scopeSheet?: import("tamagui").Scope<any>;
    }, any, {
        __scopeSheet?: import("tamagui").Scope<any>;
    }, {}, {}, {}>;
    Handle: TamaguiComponent<any, any, any, any, SharedSheetProps, {}> | TamaguiComponent<any, any, any, {}, {}, {}>;
    ScrollView: ForwardRefExoticComponent<import("./SheetScrollView").SheetScrollViewProps & RefAttributes<import("react-native").ScrollView>>;
};
export {};
