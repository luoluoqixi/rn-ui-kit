type SheetCommands = {
    present: (index: number) => Promise<void>;
    dismiss: () => Promise<void>;
    resize: (index: number) => Promise<void>;
};
/** Serialize v4 animation promises and coalesce rapid controlled state changes. */
export declare function createWebSheetCommandQueue(commands: SheetCommands, initialOpen: boolean, initialIndex: number): {
    update(open: boolean, index: number): void;
    didPresent(index: number): boolean;
    didDetentChange(index: number): boolean;
    didDismiss(): boolean;
    activate(): void;
    dispose(): void;
};
export {};
