/** Each press owns its listeners and controls, so stale async callbacks cannot clear a later press. */
export function createBasicNavigationSelection(navigation, onChange) {
    let active;
    let timeout;
    let returnTimeout;
    let removeListeners = [];
    const stopTimeout = () => {
        if (timeout != null)
            clearTimeout(timeout);
        timeout = undefined;
    };
    const stopReturnTimeout = () => {
        if (returnTimeout != null)
            clearTimeout(returnTimeout);
        returnTimeout = undefined;
    };
    const clear = () => {
        stopTimeout();
        stopReturnTimeout();
        removeListeners.forEach((remove) => remove());
        removeListeners = [];
        if (active == null)
            return;
        active = undefined;
        onChange(false);
    };
    const select = ({ basicNavigationSelectionAutoClearDelay = 300, basicNavigationSelectionReturnClearDelay = 300, } = {}) => {
        clear();
        let didBlur = false;
        const controls = {
            cancel: () => {
                if (active === controls)
                    clear();
            },
            confirm: () => {
                if (active === controls)
                    stopTimeout();
            },
        };
        active = controls;
        onChange(true);
        if (navigation != null) {
            removeListeners = [
                navigation.addListener("blur", () => {
                    didBlur = true;
                    controls.confirm();
                    // Leaving again during the return delay must keep the row selected.
                    stopReturnTimeout();
                }),
                navigation.addListener("focus", () => {
                    // A committed return restores focus. A cancelled back gesture does not.
                    if (!didBlur || !navigation.isFocused() || returnTimeout != null)
                        return;
                    const delay = Math.max(0, basicNavigationSelectionReturnClearDelay);
                    if (delay === 0) {
                        controls.cancel();
                    }
                    else {
                        returnTimeout = setTimeout(() => {
                            returnTimeout = undefined;
                            if (navigation.isFocused())
                                controls.cancel();
                        }, delay);
                    }
                }),
            ];
        }
        timeout = setTimeout(controls.cancel, Math.max(0, basicNavigationSelectionAutoClearDelay));
        return controls;
    };
    return { select, clear };
}
