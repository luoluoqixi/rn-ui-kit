/** 仅在 hover 等待或显示期间监听，捕获阶段不受标题栏 stopPropagation 影响。 */
export function listenForTooltipHoverDismiss(trigger: HTMLElement, dismiss: () => void) {
  const ownerDocument = trigger.ownerDocument;
  const ownerWindow = ownerDocument.defaultView;
  ownerDocument.addEventListener("pointerdown", dismiss, true);
  ownerWindow?.addEventListener("blur", dismiss);
  return () => {
    ownerDocument.removeEventListener("pointerdown", dismiss, true);
    ownerWindow?.removeEventListener("blur", dismiss);
  };
}
