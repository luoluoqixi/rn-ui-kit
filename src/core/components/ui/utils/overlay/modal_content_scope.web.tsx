import { TrueSheetProvider } from "@lodev09/react-native-true-sheet";
import type { ReactNode } from "react";
import { OverlayPortalScope } from "./overlay_portal_scope";

/** Place beside Dialog, inside Modal.Container: focus stays scoped without Dialog's clipping. */
export function ModalContentScope({ children }: { children?: ReactNode }) {
  return (
    <div className="ui-modal-content-scope" style={{ display: "contents" }}>
      <TrueSheetProvider>
        <OverlayPortalScope>{children}</OverlayPortalScope>
      </TrueSheetProvider>
    </div>
  );
}
