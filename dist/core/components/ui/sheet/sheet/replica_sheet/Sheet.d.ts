export { createSheetScope } from "./SheetContext";
export * from "./types";
export declare const Handle: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("tamagui").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    open?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const Overlay: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("tamagui").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    open?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const Frame: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("tamagui").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const Sheet: import("react").ForwardRefExoticComponent<{
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
} & import("react").RefAttributes<import("react-native").View>> & {
    Controlled: import("react").FunctionComponent<Omit<import("./types").SheetProps, "open" | "onOpenChange"> & import("react").RefAttributes<import("react-native").View>> & {
        Frame: import("react").ForwardRefExoticComponent<import("./types").SheetScopedProps<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
            elevation?: number | import("tamagui").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
        }>, keyof {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }> & {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }>>;
        Overlay: import("tamagui").TamaguiComponent<Omit<import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
            open?: boolean;
        }, "__scopeSheet"> & {
            __scopeSheet?: import("tamagui").Scope<any>;
        }, any, any, any, {
            open?: boolean;
        }, {}> | import("tamagui").TamaguiComponent<Omit<import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
            open?: boolean;
        }, "__scopeSheet"> & {
            __scopeSheet?: import("tamagui").Scope<any>;
        }, any, {
            __scopeSheet?: import("tamagui").Scope<any>;
        }, {}, {}, {}>;
        Handle: import("tamagui").TamaguiComponent<any, any, any, any, {
            open?: boolean;
        }, {}> | import("tamagui").TamaguiComponent<any, any, any, {}, {}, {}>;
        ScrollView: import("react").ForwardRefExoticComponent<import("./SheetScrollView").SheetScrollViewProps & import("react").RefAttributes<import("react-native").ScrollView>>;
    };
    Frame: import("react").ForwardRefExoticComponent<import("./types").SheetScopedProps<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof {
        disableHideBottomOverflow?: boolean;
        adjustPaddingForOffscreenContent?: boolean;
    }> & {
        disableHideBottomOverflow?: boolean;
        adjustPaddingForOffscreenContent?: boolean;
    }>>;
    Overlay: import("tamagui").TamaguiComponent<Omit<import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
        open?: boolean;
    }, "__scopeSheet"> & {
        __scopeSheet?: import("tamagui").Scope<any>;
    }, any, any, any, {
        open?: boolean;
    }, {}> | import("tamagui").TamaguiComponent<Omit<import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, import("tamagui").Longhands>> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
        open?: boolean;
    }, "__scopeSheet"> & {
        __scopeSheet?: import("tamagui").Scope<any>;
    }, any, {
        __scopeSheet?: import("tamagui").Scope<any>;
    }, {}, {}, {}>;
    Handle: import("tamagui").TamaguiComponent<any, any, any, any, {
        open?: boolean;
    }, {}> | import("tamagui").TamaguiComponent<any, any, any, {}, {}, {}>;
    ScrollView: import("react").ForwardRefExoticComponent<import("./SheetScrollView").SheetScrollViewProps & import("react").RefAttributes<import("react-native").ScrollView>>;
};
