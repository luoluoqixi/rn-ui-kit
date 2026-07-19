type TrueSheetStackHostContextValue = {
    onRequestClose: () => void;
};
export declare function TrueSheetStackHostProvider({ children, onRequestClose, }: {
    children: React.ReactNode;
    onRequestClose: () => void;
}): import("react").JSX.Element;
export declare function useTrueSheetStackHost(): TrueSheetStackHostContextValue;
export {};
