type ScheduleTooltipClose = (close: () => void) => void;
export declare function shouldSuppressTooltipHover(openOnPress: boolean): boolean;
export declare function closeTooltipAfterPress(openOnPress: boolean, close: () => void, schedule?: ScheduleTooltipClose): void;
export {};
