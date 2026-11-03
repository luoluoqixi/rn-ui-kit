import type { PressableProps } from "react-native";
import { getSolidButtonInteractionColor } from "./solid_button_colors";
export declare function useSolidButtonInteraction({ colors, variant, disabled, onHoverIn, onHoverOut, }: {
    colors: Parameters<typeof getSolidButtonInteractionColor>[0];
    variant?: string | null;
    disabled?: boolean;
    onHoverIn?: PressableProps["onHoverIn"];
    onHoverOut?: PressableProps["onHoverOut"];
}): {
    onHoverIn: NonNullable<PressableProps["onHoverIn"]>;
    onHoverOut: NonNullable<PressableProps["onHoverOut"]>;
    backgroundStyle: (pressed: boolean) => {
        backgroundColor: string;
    } | null;
};
