import type { SheetControlledProps, SheetControllerProps, SheetFrameProps, SheetHandleProps, SheetOverlayProps, SheetProps } from "./types";
declare function SheetRoot(props: SheetProps): import("react").JSX.Element;
declare function SheetControlled(props: SheetControlledProps): import("react").JSX.Element;
declare function SheetController(props: SheetControllerProps): import("react").JSX.Element;
declare function SheetFrame(props: SheetFrameProps): import("react").JSX.Element;
declare function SheetOverlay(props: SheetOverlayProps): import("react").JSX.Element;
declare function SheetHandle(props: SheetHandleProps): import("react").JSX.Element;
export declare const Sheet: typeof SheetRoot & {
    Controlled: typeof SheetControlled;
    Controller: typeof SheetController;
    Frame: typeof SheetFrame;
    Overlay: typeof SheetOverlay;
    Handle: typeof SheetHandle;
    ScrollView: import("react").ForwardRefExoticComponent<Omit<import("./replica_sheet/SheetScrollView").SheetScrollViewProps & import("react").RefAttributes<import("react-native").ScrollView>, "ref"> & import("react").RefAttributes<import("react-native").ScrollView>>;
};
export {};
