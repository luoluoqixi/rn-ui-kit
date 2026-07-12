import type { ViewProps } from "react-native";
import type { ModifierConfig } from "@expo/ui/swift-ui/modifiers/createModifier";

declare module "@expo/ui/swift-ui/modifiers" {
  export function contentMargins(options: {
    edges?: "top" | "bottom" | "leading" | "trailing" | "all";
    length?: number;
    placement?: "automatic" | "scrollContent";
  }): ModifierConfig;

  export function viewID(id: string | number): ModifierConfig;
}

declare module "@expo/ui/swift-ui" {
  export interface ListProps {
    compensatesForViewportClipping?: boolean;
    initialScrollAnchor?: string;
    initialScrollTarget?: string | number;
  }
}

declare module "@react-native-picker/picker" {
  export interface PickerProps<T> {
    dropdownHorizontalOffset?: number;
    dropdownWidth?: number;
  }
}

declare module "@lodev09/react-native-true-sheet" {
  export interface TrueSheetProps extends ViewProps {
    disableStackingTranslation?: boolean;
  }
}

declare module "react-native" {
  export interface ViewProps {
    className?: string;
  }
}
