export declare function useWebSheetCommands(name: string, open: boolean, index: number, enabled?: boolean, initialDetentIndex?: number): {
    initialIndex: number;
    queue: {
        update(open: boolean, index: number): void;
        didPresent(index: number): boolean;
        didDetentChange(index: number): boolean;
        didDismiss(): boolean;
        activate(): void;
        dispose(): void;
    };
};
