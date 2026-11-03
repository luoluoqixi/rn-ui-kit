type ScheduleTooltipClose = (close: () => void) => void;

export function shouldSuppressTooltipHover(openOnPress: boolean) {
  return !openOnPress;
}

export function closeTooltipAfterPress(
  openOnPress: boolean,
  close: () => void,
  schedule: ScheduleTooltipClose = queueMicrotask,
) {
  if (openOnPress) {
    return;
  }

  // The primitive toggles after its press callback on web and before it on native.
  // Closing in both phases prevents either ordering from reopening the tooltip.
  close();
  schedule(close);
}
