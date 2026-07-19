import type { SheetContextValue } from "./useSheetProviderProps";
export declare const createSheetContext: <ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType) => readonly [(props: ContextValueType & {
    scope: import("tamagui").Scope<ContextValueType>;
    children: React.ReactNode;
}) => import("react").JSX.Element, (consumerName: string, scope: import("tamagui").Scope<ContextValueType | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<ContextValueType>;
}) => ContextValueType], createSheetScope: import("tamagui").CreateScope;
export declare const SheetProvider: (props: {
    screenSize: number;
    maxSnapPoint: string | number;
    disableRemoveScroll: boolean;
    scrollBridge: import("./types").ScrollBridge;
    modal: boolean;
    open: boolean;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    hidden: boolean;
    contentRef: import("react").RefObject<import("tamagui").TamaguiElement | null>;
    handleRef: import("react").RefObject<import("tamagui").TamaguiElement | null>;
    frameSize: number;
    setFrameSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    dismissOnOverlayPress: boolean;
    dismissOnSnapToBottom: boolean;
    onOverlayComponent: ((comp: any) => void) | undefined;
    scope: import("tamagui").Scope<any>;
    hasFit: boolean;
    position: number;
    snapPoints: (string | number)[];
    snapPointsMode: import("./types").SnapPointsMode;
    setMaxContentSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    setPosition: (next: number) => void;
    setPositionImmediate: import("react").Dispatch<import("react").SetStateAction<number>>;
    onlyShowFrame: boolean;
} & {
    keyboardOccludedHeight: number;
    setHasScrollView: (val: boolean) => void;
} & {
    scope: import("tamagui").Scope<SheetContextValue>;
    children: React.ReactNode;
}) => import("react").JSX.Element, useSheetContext: (consumerName: string, scope: import("tamagui").Scope<SheetContextValue | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<SheetContextValue> | undefined;
} | undefined) => SheetContextValue;
