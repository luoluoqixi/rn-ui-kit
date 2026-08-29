import type { LucideIcon, LucideProps } from "lucide-react-native";

export type IconSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type IconProps = Omit<LucideProps, "size"> & {
  as: LucideIcon;
  size?: IconSize | LucideProps["size"];
} & React.RefAttributes<LucideIcon>;
