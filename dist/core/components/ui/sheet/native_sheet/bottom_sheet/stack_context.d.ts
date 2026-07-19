type BottomSheetStackHostContextValue = {
    onRequestClose: () => void;
};
export declare function BottomSheetStackHostProvider({ children, onRequestClose, }: {
    children: React.ReactNode;
    onRequestClose: () => void;
}): import("react").JSX.Element;
export declare function useBottomSheetStackHost(): BottomSheetStackHostContextValue;
export {};
