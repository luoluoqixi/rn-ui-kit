import { Branch } from "@radix-ui/react-dismissable-layer";
import { useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// 按呈现顺序记录 modal；嵌套 scope 的 effect 可能先于父级执行，选择时需保留最深层。
const scopes: HTMLElement[] = [];
const listeners = new Set<() => void>();
function currentScope(ownerDocument: Document) {
  let active: HTMLElement | undefined;
  for (const scope of scopes) {
    if (scope.ownerDocument !== ownerDocument || !scope.isConnected) continue;
    if (!active || !scope.contains(active)) active = scope;
  }
  return active;
}

export function useToastPortalScope(container: HTMLElement | null | undefined) {
  useLayoutEffect(() => {
    if (!container) return;
    scopes.push(container);
    listeners.forEach((notify) => notify());
    return () => {
      scopes.splice(scopes.indexOf(container), 1);
      listeners.forEach((notify) => notify());
    };
  }, [container]);
}

/** 移动稳定的 host 而非更换 React Portal target，保留 Sonner 的通知、计时与内部状态。 */
export function ToastPortal({ children }: { children: ReactNode }) {
  const [host, setHost] = useState<HTMLDivElement>();
  useLayoutEffect(() => {
    const node = document.createElement("div");
    node.dataset.uiToastPortal = "";
    // 不建立 containing block，也不让透明区域拦截点击；Toast 本身恢复 pointer events。
    node.style.display = "contents";
    const relocate = () => {
      const parent =
        currentScope(node.ownerDocument) ?? node.ownerDocument.body;
      if (node.parentElement !== parent) parent.appendChild(node);
    };
    listeners.add(relocate);
    relocate();
    setHost(node);
    return () => {
      listeners.delete(relocate);
      node.remove();
    };
  }, []);
  // Sheet 的浮层 host 位于 Drawer.Content 之外；Branch 将通知标记为合法交互区域，
  // 避免关闭按钮、操作和拖动被识别成点击遮罩，同时保留事件与滑动手势。
  return host
    ? createPortal(
        <Branch style={{ display: "contents" }}>{children}</Branch>,
        host,
      )
    : null;
}
