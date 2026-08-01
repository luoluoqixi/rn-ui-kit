import React from "react";
import { View } from "react-native";
import type { SnapPointsMode } from "./types";
export declare const SheetImplementationCustom: React.ForwardRefExoticComponent<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: ((open: boolean) => void) | React.Dispatch<React.SetStateAction<boolean>>;
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: SnapPointsMode;
    onPositionChange?: import("./types").PositionChangeHandler;
    children?: React.ReactNode;
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
} & React.RefAttributes<View>>;
