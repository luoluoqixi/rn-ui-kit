import type { ReactNode } from "react";

export function SheetContentScope({
  children,
}: {
  children?: ReactNode;
  dismissOnOverlayPress?: boolean;
  onRequestClose?: () => void;
}) {
  return <>{children}</>;
}
