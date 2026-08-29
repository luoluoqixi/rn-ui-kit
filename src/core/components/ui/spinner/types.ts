import type { ActivityIndicatorProps } from "react-native";

export type SpinnerSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;

export type SpinnerProps = Omit<ActivityIndicatorProps, "size"> & {
  size?: SpinnerSize;
};
