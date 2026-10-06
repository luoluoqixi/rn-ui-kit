import { LayoutService } from "./layout_service";
import { SplitLayoutPriority } from "./types";
export type PaneViewOptions = {
    maximumSize?: number;
    minimumSize?: number;
    preferredSize?: number | string;
    priority?: SplitLayoutPriority;
    snap?: boolean;
};
export declare class PaneView {
    private layoutService;
    maximumSize: number;
    minimumSize: number;
    priority: SplitLayoutPriority;
    snap: boolean;
    private layoutStrategy;
    get preferredSize(): number | string | undefined;
    set preferredSize(preferredSize: number | string | undefined);
    constructor(layoutService: LayoutService, options: PaneViewOptions);
}
