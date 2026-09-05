import { SplitLayoutPriority } from "./types";
const clamp = (value, minimum, maximum) => {
    return Math.min(Math.max(value, minimum), maximum);
};
const range = (from, to, step = from <= to ? 1 : -1) => {
    const result = [];
    if (step > 0) {
        for (let value = from; value < to; value += step)
            result.push(value);
    }
    else {
        for (let value = from; value > to; value += step)
            result.push(value);
    }
    return result;
};
const pushToStart = (items, item) => {
    const index = items.indexOf(item);
    if (index < 0)
        return;
    items.splice(index, 1);
    items.unshift(item);
};
const pushToEnd = (items, item) => {
    const index = items.indexOf(item);
    if (index < 0)
        return;
    items.splice(index, 1);
    items.push(item);
};
class ViewItem {
    view;
    cachedVisibleSize;
    size;
    get maximumSize() {
        return this.visible ? this.view.maximumSize : 0;
    }
    get minimumSize() {
        return this.visible ? this.view.minimumSize : 0;
    }
    get priority() {
        return this.view.priority;
    }
    get snap() {
        return this.view.snap;
    }
    get viewMaximumSize() {
        return this.view.maximumSize;
    }
    get viewMinimumSize() {
        return this.view.minimumSize;
    }
    get visible() {
        return this.cachedVisibleSize === undefined;
    }
    constructor(view, size) {
        this.view = view;
        if (typeof size === "number") {
            this.size = size;
            this.cachedVisibleSize = undefined;
        }
        else {
            this.size = 0;
            this.cachedVisibleSize = size.cachedVisibleSize;
        }
    }
    setVisible(visible, cachedVisibleSize) {
        if (visible === this.visible)
            return false;
        if (visible) {
            this.size = clamp(this.cachedVisibleSize ?? this.viewMinimumSize, this.viewMinimumSize, this.viewMaximumSize);
            this.cachedVisibleSize = undefined;
        }
        else {
            this.cachedVisibleSize =
                typeof cachedVisibleSize === "number" ? cachedVisibleSize : this.size;
            this.size = 0;
        }
        return true;
    }
}
export class SplitViewModel {
    contentSize = 0;
    onDidChange;
    onDidVisibleChange;
    proportionalLayout;
    proportions;
    sashDragState;
    size = 0;
    viewItems = [];
    constructor(options) {
        this.proportionalLayout = options.proportionalLayout ?? true;
        this.size = options.descriptor.size;
        this.viewItems = options.descriptor.views.map((descriptor) => new ViewItem(descriptor.view, descriptor.size));
        this.contentSize = this.viewItems.reduce((sum, item) => sum + item.size, 0);
        this.saveProportions();
    }
    getState() {
        return {
            sizes: this.viewItems.map((item) => item.size),
            visible: this.viewItems.map((item) => item.visible),
        };
    }
    getViewSize(index) {
        return index < 0 || index >= this.viewItems.length ? -1 : this.viewItems[index].size;
    }
    isViewVisible(index) {
        if (index < 0 || index >= this.viewItems.length)
            return false;
        return this.viewItems[index].visible;
    }
    layout(size = this.size) {
        const previousSize = Math.max(this.size, this.contentSize);
        this.size = size;
        if (this.proportions) {
            for (let index = 0; index < this.viewItems.length; index++) {
                const item = this.viewItems[index];
                item.size = clamp(Math.round(this.proportions[index] * size), item.minimumSize, item.maximumSize);
            }
        }
        else {
            const indexes = range(0, this.viewItems.length);
            const lowPriorityIndexes = indexes.filter((index) => this.viewItems[index].priority === SplitLayoutPriority.Low);
            const highPriorityIndexes = indexes.filter((index) => this.viewItems[index].priority === SplitLayoutPriority.High);
            this.resize(this.viewItems.length - 1, size - previousSize, undefined, lowPriorityIndexes, highPriorityIndexes);
        }
        this.distributeEmptySpace();
        this.layoutViews();
    }
    resizeView(index, size) {
        if (index < 0 || index >= this.viewItems.length)
            return;
        const indexes = range(0, this.viewItems.length).filter((item) => item !== index);
        const lowPriorityIndexes = [
            ...indexes.filter((item) => this.viewItems[item].priority === SplitLayoutPriority.Low),
            index,
        ];
        const highPriorityIndexes = indexes.filter((item) => this.viewItems[item].priority === SplitLayoutPriority.High);
        const viewItem = this.viewItems[index];
        viewItem.size = clamp(Math.round(size), viewItem.minimumSize, Math.min(viewItem.maximumSize, this.size));
        this.relayout(lowPriorityIndexes, highPriorityIndexes);
    }
    resizeViews(sizes) {
        for (let index = 0; index < sizes.length && index < this.viewItems.length; index++) {
            const viewItem = this.viewItems[index];
            viewItem.size = clamp(Math.round(sizes[index]), viewItem.minimumSize, Math.min(viewItem.maximumSize, this.size));
        }
        this.contentSize = this.viewItems.reduce((sum, item) => sum + item.size, 0);
        this.saveProportions();
        this.layout(this.size);
    }
    restoreState(state) {
        if (state.sizes.length !== this.viewItems.length ||
            state.visible.length !== this.viewItems.length) {
            return;
        }
        this.sashDragState = undefined;
        for (let index = 0; index < this.viewItems.length; index++) {
            this.applyViewState(index, state.visible[index], state.sizes[index]);
        }
        this.distributeEmptySpace();
        this.layoutViews();
        this.saveProportions();
    }
    resetSash(index, state) {
        if (index < 0 || index + 1 >= this.viewItems.length)
            return;
        if (state.sizes.length !== this.viewItems.length ||
            state.visible.length !== this.viewItems.length) {
            return;
        }
        const beforeItem = this.viewItems[index];
        const afterItem = this.viewItems[index + 1];
        if (!beforeItem.visible || !afterItem.visible)
            return;
        const currentCombinedSize = beforeItem.size + afterItem.size;
        if (currentCombinedSize <= 0)
            return;
        const initialBeforeSize = state.visible[index] ? state.sizes[index] : 0;
        const initialAfterSize = state.visible[index + 1] ? state.sizes[index + 1] : 0;
        const initialCombinedSize = initialBeforeSize + initialAfterSize;
        const beforeRatio = initialCombinedSize > 0 ? initialBeforeSize / initialCombinedSize : 0.5;
        const minimumBeforeSize = Math.max(beforeItem.minimumSize, currentCombinedSize - afterItem.maximumSize);
        const maximumBeforeSize = Math.min(beforeItem.maximumSize, currentCombinedSize - afterItem.minimumSize);
        const nextBeforeSize = clamp(Math.round(currentCombinedSize * beforeRatio), minimumBeforeSize, maximumBeforeSize);
        this.sashDragState = undefined;
        beforeItem.size = nextBeforeSize;
        afterItem.size = currentCombinedSize - nextBeforeSize;
        this.layoutViews();
        this.saveProportions();
    }
    distributeViewSizes() {
        const resizableItems = this.viewItems.filter((item) => item.maximumSize - item.minimumSize > 0);
        const totalSize = resizableItems.reduce((sum, item) => sum + item.size, 0);
        const average = resizableItems.length > 0 ? Math.floor(totalSize / resizableItems.length) : 0;
        for (const item of resizableItems) {
            item.size = clamp(average, item.minimumSize, item.maximumSize);
        }
        const indexes = range(0, this.viewItems.length);
        const lowPriorityIndexes = indexes.filter((index) => this.viewItems[index].priority === SplitLayoutPriority.Low);
        const highPriorityIndexes = indexes.filter((index) => this.viewItems[index].priority === SplitLayoutPriority.High);
        this.relayout(lowPriorityIndexes, highPriorityIndexes);
    }
    setViewVisible(index, visible) {
        if (index < 0 || index >= this.viewItems.length)
            return;
        if (this.setItemVisible(index, visible)) {
            this.distributeEmptySpace(index);
            this.layoutViews();
            this.saveProportions();
        }
    }
    startSashDrag(index, start) {
        if (index < 0 || index + 1 >= this.viewItems.length)
            return;
        const sizes = this.viewItems.map((item) => item.size);
        const upIndexes = range(index, -1, -1);
        const downIndexes = range(index + 1, this.viewItems.length);
        const minDeltaUp = upIndexes.reduce((sum, item) => sum + (this.viewItems[item].minimumSize - sizes[item]), 0);
        const maxDeltaUp = upIndexes.reduce((sum, item) => sum + (this.viewItems[item].viewMaximumSize - sizes[item]), 0);
        const maxDeltaDown = downIndexes.length === 0
            ? Number.POSITIVE_INFINITY
            : downIndexes.reduce((sum, item) => sum + (sizes[item] - this.viewItems[item].minimumSize), 0);
        const minDeltaDown = downIndexes.length === 0
            ? Number.NEGATIVE_INFINITY
            : downIndexes.reduce((sum, item) => sum + (sizes[item] - this.viewItems[item].viewMaximumSize), 0);
        const minDelta = Math.max(minDeltaUp, minDeltaDown);
        const maxDelta = Math.min(maxDeltaDown, maxDeltaUp);
        const beforeItem = this.viewItems[index];
        const afterItem = this.viewItems[index + 1];
        this.sashDragState = {
            index,
            start,
            sizes,
            minDelta,
            maxDelta,
            snapBefore: beforeItem.snap ? this.createSnapState(index, minDelta, true) : undefined,
            snapAfter: afterItem.snap ? this.createSnapState(index + 1, maxDelta, false) : undefined,
        };
    }
    changeSashDrag(current) {
        if (!this.sashDragState)
            return;
        const { index, start, sizes, minDelta, maxDelta, snapBefore, snapAfter } = this.sashDragState;
        const delta = current - start;
        this.resize(index, delta, sizes, undefined, undefined, minDelta, maxDelta, snapBefore, snapAfter);
        this.distributeEmptySpace();
        this.layoutViews();
    }
    endSashDrag() {
        this.sashDragState = undefined;
        this.saveProportions();
    }
    createSnapState(index, limitDelta, before) {
        if (typeof index !== "number")
            return undefined;
        const item = this.viewItems[index];
        const halfMinimum = Math.floor(item.viewMinimumSize / 2);
        return {
            index,
            limitDelta: item.visible
                ? before
                    ? limitDelta - halfMinimum
                    : limitDelta + halfMinimum
                : before
                    ? limitDelta + halfMinimum
                    : limitDelta - halfMinimum,
            size: item.size,
        };
    }
    distributeEmptySpace(lowPriorityIndex) {
        const totalSize = this.viewItems.reduce((sum, item) => sum + item.size, 0);
        let emptySpace = this.size - totalSize;
        const indexes = range(0, this.viewItems.length);
        const high = indexes.filter((index) => this.viewItems[index].priority === SplitLayoutPriority.High);
        const normal = indexes.filter((index) => this.viewItems[index].priority === SplitLayoutPriority.Normal);
        const low = indexes.filter((index) => this.viewItems[index].priority === SplitLayoutPriority.Low);
        const resizeOrder = [...high, ...normal, ...low];
        if (typeof lowPriorityIndex === "number")
            pushToEnd(resizeOrder, lowPriorityIndex);
        for (let index = 0; emptySpace !== 0 && index < resizeOrder.length; index++) {
            const item = this.viewItems[resizeOrder[index]];
            const size = clamp(item.size + emptySpace, item.minimumSize, item.maximumSize);
            emptySpace -= size - item.size;
            item.size = size;
        }
    }
    findFirstSnapIndex(indexes) {
        for (const index of indexes) {
            const item = this.viewItems[index];
            if (item.visible && item.snap)
                return index;
        }
        for (const index of indexes) {
            const item = this.viewItems[index];
            if (item.visible && item.maximumSize - item.minimumSize > 0)
                return undefined;
            if (!item.visible && item.snap)
                return index;
        }
        return undefined;
    }
    layoutViews() {
        this.contentSize = this.viewItems.reduce((sum, item) => sum + item.size, 0);
        this.onDidChange?.(this.viewItems.map((item) => item.size));
    }
    relayout(lowPriorityIndexes, highPriorityIndexes) {
        const contentSize = this.viewItems.reduce((sum, item) => sum + item.size, 0);
        this.resize(this.viewItems.length - 1, this.size - contentSize, undefined, lowPriorityIndexes, highPriorityIndexes);
        this.distributeEmptySpace();
        this.layoutViews();
        this.saveProportions();
    }
    resize(index, delta, sizes = this.viewItems.map((item) => item.size), lowPriorityIndexes, highPriorityIndexes, overloadMinDelta = Number.NEGATIVE_INFINITY, overloadMaxDelta = Number.POSITIVE_INFINITY, snapBefore, snapAfter) {
        if (index < 0 || index >= this.viewItems.length)
            return 0;
        const upIndexes = range(index, -1, -1);
        const downIndexes = range(index + 1, this.viewItems.length);
        if (highPriorityIndexes) {
            for (const priorityIndex of highPriorityIndexes) {
                pushToStart(upIndexes, priorityIndex);
                pushToStart(downIndexes, priorityIndex);
            }
        }
        if (lowPriorityIndexes) {
            for (const priorityIndex of lowPriorityIndexes) {
                pushToEnd(upIndexes, priorityIndex);
                pushToEnd(downIndexes, priorityIndex);
            }
        }
        const minDeltaUp = upIndexes.reduce((sum, item) => sum + (this.viewItems[item].minimumSize - sizes[item]), 0);
        const maxDeltaUp = upIndexes.reduce((sum, item) => sum + (this.viewItems[item].maximumSize - sizes[item]), 0);
        const maxDeltaDown = downIndexes.length === 0
            ? Number.POSITIVE_INFINITY
            : downIndexes.reduce((sum, item) => sum + (sizes[item] - this.viewItems[item].minimumSize), 0);
        const minDeltaDown = downIndexes.length === 0
            ? Number.NEGATIVE_INFINITY
            : downIndexes.reduce((sum, item) => sum + (sizes[item] - this.viewItems[item].maximumSize), 0);
        const minDelta = Math.max(minDeltaUp, minDeltaDown, overloadMinDelta);
        const maxDelta = Math.min(maxDeltaDown, maxDeltaUp, overloadMaxDelta);
        let snapped = false;
        if (snapBefore) {
            const visible = delta >= snapBefore.limitDelta;
            snapped = this.setItemVisible(snapBefore.index, visible, snapBefore.size);
        }
        if (!snapped && snapAfter) {
            const visible = delta < snapAfter.limitDelta;
            snapped = this.setItemVisible(snapAfter.index, visible, snapAfter.size);
        }
        if (snapped)
            return this.resize(index, delta, sizes, lowPriorityIndexes, highPriorityIndexes, overloadMinDelta, overloadMaxDelta);
        let upDelta = clamp(delta, minDelta, maxDelta);
        for (let itemIndex = 0; itemIndex < upIndexes.length; itemIndex++) {
            const viewIndex = upIndexes[itemIndex];
            const item = this.viewItems[viewIndex];
            const size = clamp(sizes[viewIndex] + upDelta, item.minimumSize, item.maximumSize);
            upDelta -= size - sizes[viewIndex];
            item.size = size;
        }
        let downDelta = clamp(delta, minDelta, maxDelta);
        for (let itemIndex = 0; itemIndex < downIndexes.length; itemIndex++) {
            const viewIndex = downIndexes[itemIndex];
            const item = this.viewItems[viewIndex];
            const size = clamp(sizes[viewIndex] - downDelta, item.minimumSize, item.maximumSize);
            downDelta += size - sizes[viewIndex];
            item.size = size;
        }
        return delta;
    }
    saveProportions() {
        if (this.proportionalLayout && this.contentSize > 0) {
            this.proportions = this.viewItems.map((item) => item.size / this.contentSize);
        }
    }
    applyViewState(index, visible, size) {
        const item = this.viewItems[index];
        const nextSize = clamp(Math.round(size), item.viewMinimumSize, item.viewMaximumSize);
        const visibilityChanged = item.visible !== visible;
        if (visible) {
            item.cachedVisibleSize = undefined;
            item.size = nextSize;
        }
        else {
            item.cachedVisibleSize = nextSize;
            item.size = 0;
        }
        if (visibilityChanged) {
            this.onDidVisibleChange?.(index, visible);
        }
    }
    setItemVisible(index, visible, cachedVisibleSize) {
        const changed = this.viewItems[index].setVisible(visible, cachedVisibleSize);
        if (changed)
            this.onDidVisibleChange?.(index, visible);
        return changed;
    }
}
