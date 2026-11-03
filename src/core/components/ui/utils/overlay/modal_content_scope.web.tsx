import { TrueSheetProvider } from "@lodev09/react-native-true-sheet";
import type { ReactNode } from "react";
import { OverlayPortalScope } from "./overlay_portal_scope";

/** 子菜单与 Sheet 保留在当前 modal 的 DOM 和焦点范围中。 */
export function ModalContentScope({ children }: { children?: ReactNode }) {
  return (
    <div className="ui-modal-content-scope" style={{ display: "contents" }}>
      <TrueSheetProvider>
        <OverlayPortalScope>{children}</OverlayPortalScope>
      </TrueSheetProvider>
    </div>
  );
}
