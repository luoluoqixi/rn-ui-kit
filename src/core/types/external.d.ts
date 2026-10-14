import type { ViewProps } from "react-native";

declare module "@react-native-picker/picker" {
  export interface PickerProps<T> {
    dropdownHorizontalOffset?: number;
    dropdownWidth?: number;
  }
}

declare module "@lodev09/react-native-true-sheet" {
  export interface TrueSheetProps extends ViewProps {
    disableStackingTranslation?: boolean;
    androidHideFriction?: number;
    androidSignificantVelocityThreshold?: number;
  }
}

declare module "react-native" {
  export interface ViewProps {
    className?: string;
  }
}
