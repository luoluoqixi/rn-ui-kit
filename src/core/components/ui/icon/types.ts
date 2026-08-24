import type { LucideIcon, LucideProps } from "lucide-react-native";

export type IconProps = LucideProps & {
  as: LucideIcon;
} & React.RefAttributes<LucideIcon>;
