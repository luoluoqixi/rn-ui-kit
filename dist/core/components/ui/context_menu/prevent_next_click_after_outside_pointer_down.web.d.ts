type PointerDownOutsideEvent = {
    defaultPrevented: boolean;
    detail: {
        originalEvent: PointerEvent;
    };
};
export declare function preventNextClickAfterOutsidePointerDown(event: PointerDownOutsideEvent): void;
export {};
