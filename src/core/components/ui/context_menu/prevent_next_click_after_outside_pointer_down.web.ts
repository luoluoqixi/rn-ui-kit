type PointerDownOutsideEvent = {
  defaultPrevented: boolean;
  detail: { originalEvent: PointerEvent };
};

export function preventNextClickAfterOutsidePointerDown(event: PointerDownOutsideEvent) {
  if (event.defaultPrevented) return;

  const originalEvent = event.detail.originalEvent;
  if (originalEvent.button !== 0) return;

  const target = originalEvent.target;
  const ownerDocument =
    target instanceof Document
      ? target
      : target instanceof Node
        ? target.ownerDocument
        : document;
  if (ownerDocument == null) return;
  const clickOwnerDocument = ownerDocument;
  let cleanupTimer: ReturnType<typeof setTimeout> | undefined;

  function cleanup() {
    if (cleanupTimer !== undefined) clearTimeout(cleanupTimer);
    clickOwnerDocument.removeEventListener("click", preventClickThrough, true);
    clickOwnerDocument.removeEventListener("pointercancel", cleanup, true);
    clickOwnerDocument.removeEventListener("pointerup", scheduleCleanup, true);
  }

  function preventClickThrough(clickEvent: MouseEvent) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    clickEvent.stopImmediatePropagation();
    cleanup();
  }

  function scheduleCleanup() {
    cleanupTimer = setTimeout(cleanup, 0);
  }

  clickOwnerDocument.addEventListener("click", preventClickThrough, true);
  clickOwnerDocument.addEventListener("pointercancel", cleanup, true);
  clickOwnerDocument.addEventListener("pointerup", scheduleCleanup, true);
}
