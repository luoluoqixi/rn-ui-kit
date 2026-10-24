import { useToastPortalScope } from "../../../toast/toast_portal.web";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { OverlayPortalContainerContext } from "../../../utils/overlay/overlay_portal_scope.web";

/** 弹出层放在 Drawer 裁切容器之外，同时保留当前 modal 的 DOM 归属。 */
export function SheetContentScope({ children }: { children?: ReactNode }) {
  const marker = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLDivElement>();

  useToastPortalScope(container);

  useLayoutEffect(() => {
    const wrapper = marker.current?.closest("[data-vaul-detached-wrapper]");
    const parent = wrapper?.parentElement;
    if (!parent) return;
    const host = document.createElement("div");
    host.dataset.uiSheetOverlayScope = "";
    // 不创建 fixed containing block；菜单坐标仍以 viewport 为基准。
    // 该层仅高于同级 Drawer，不越过外层 Dialog 或标题栏的层叠边界。
    Object.assign(host.style, { position: "relative", zIndex: "1" });
    parent.appendChild(host);
    setContainer(host);
    return () => host.remove();
  }, []);

  return (
    <OverlayPortalContainerContext.Provider value={container}>
      <div ref={marker} style={{ display: "contents" }}>
        {children}
      </div>
    </OverlayPortalContainerContext.Provider>
  );
}
