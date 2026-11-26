import type { NativeListNavigationItemProps, NativeListNavigationSelectionControls } from "./types";

export type BasicNavigationSelectionOptions = Pick<
  NativeListNavigationItemProps,
  "basicNavigationSelectionAutoClearDelay" | "basicNavigationSelectionReturnClearDelay"
>;

type Navigation = {
  addListener: (event: "blur" | "focus", listener: () => void) => () => void;
  isFocused: () => boolean;
};

/** Each press owns its listeners and controls, so stale async callbacks cannot clear a later press. */
export function createBasicNavigationSelection(
  navigation: Navigation | undefined,
  onChange: (selected: boolean) => void,
) {
  let active: NativeListNavigationSelectionControls | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let returnTimeout: ReturnType<typeof setTimeout> | undefined;
  let removeListeners: (() => void)[] = [];

  const stopTimeout = () => {
    if (timeout != null) clearTimeout(timeout);
    timeout = undefined;
  };
  const stopReturnTimeout = () => {
    if (returnTimeout != null) clearTimeout(returnTimeout);
    returnTimeout = undefined;
  };
  const clear = () => {
    stopTimeout();
    stopReturnTimeout();
    removeListeners.forEach((remove) => remove());
    removeListeners = [];
    if (active == null) return;
    active = undefined;
    onChange(false);
  };
  const select = ({
    basicNavigationSelectionAutoClearDelay = 300,
    basicNavigationSelectionReturnClearDelay = 300,
  }: BasicNavigationSelectionOptions = {}): NativeListNavigationSelectionControls => {
    clear();
    let didBlur = false;
    const controls = {
      cancel: () => {
        if (active === controls) clear();
      },
      confirm: () => {
        if (active === controls) stopTimeout();
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
          if (!didBlur || !navigation.isFocused() || returnTimeout != null) return;
          const delay = Math.max(0, basicNavigationSelectionReturnClearDelay);
          if (delay === 0) {
            controls.cancel();
          } else {
            returnTimeout = setTimeout(() => {
              returnTimeout = undefined;
              if (navigation.isFocused()) controls.cancel();
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
