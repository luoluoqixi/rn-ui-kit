import type { SemanticColors } from "../utils/theme/ui_theme";
import type { AlertDialogActionProps } from "./types";
type SolidActionProps = AlertDialogActionProps & {
    colors: Pick<SemanticColors, "primary" | "destructive">;
    variant: "default" | "destructive";
};
export declare function AlertDialogSolidAction({ colors, variant, asChild, style, children, ...props }: SolidActionProps): import("react").JSX.Element;
export {};
