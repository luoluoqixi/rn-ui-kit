import { AlertHeroUI } from "./alert_heroui";
import type { AlertProps } from "./types";

export function Alert(props: AlertProps) {
  return <AlertHeroUI {...props} />;
}
