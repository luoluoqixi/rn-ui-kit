import { SplitLayoutPriority } from "./types";
class PixelLayout {
    size;
    constructor(size) {
        this.size = size;
    }
    getPreferredSize() {
        return this.size;
    }
}
class ProportionLayout {
    proportion;
    layoutService;
    constructor(proportion, layoutService) {
        this.proportion = proportion;
        this.layoutService = layoutService;
    }
    getPreferredSize() {
        return this.proportion * this.layoutService.getSize();
    }
}
class NullLayout {
    getPreferredSize() {
        return undefined;
    }
}
export class PaneView {
    layoutService;
    maximumSize = Number.POSITIVE_INFINITY;
    minimumSize = 0;
    priority;
    snap;
    layoutStrategy;
    get preferredSize() {
        return this.layoutStrategy.getPreferredSize();
    }
    set preferredSize(preferredSize) {
        this.layoutStrategy = createLayoutStrategy(preferredSize, this.layoutService);
    }
    constructor(layoutService, options) {
        this.layoutService = layoutService;
        this.minimumSize = typeof options.minimumSize === "number" ? options.minimumSize : 30;
        this.maximumSize =
            typeof options.maximumSize === "number" ? options.maximumSize : Number.POSITIVE_INFINITY;
        this.priority = options.priority ?? SplitLayoutPriority.Normal;
        this.snap = typeof options.snap === "boolean" ? options.snap : false;
        this.layoutStrategy = createLayoutStrategy(options.preferredSize, layoutService);
    }
}
function createLayoutStrategy(preferredSize, layoutService) {
    if (typeof preferredSize === "number")
        return new PixelLayout(preferredSize);
    if (typeof preferredSize === "string") {
        const value = preferredSize.trim();
        if (value.endsWith("%")) {
            const proportion = Number(value.slice(0, -1)) / 100;
            return Number.isFinite(proportion)
                ? new ProportionLayout(proportion, layoutService)
                : new NullLayout();
        }
        if (value.endsWith("px")) {
            const pixels = Number(value.slice(0, -2));
            return Number.isFinite(pixels) ? new PixelLayout(pixels) : new NullLayout();
        }
        const number = Number.parseFloat(value);
        return Number.isFinite(number) ? new PixelLayout(number) : new NullLayout();
    }
    return new NullLayout();
}
