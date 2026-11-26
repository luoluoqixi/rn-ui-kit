import type { LucideIcon, LucideProps } from "lucide-react-native";
/** Library presets, not a global HeroUI icon size scale: 16 / 20 / 24. */
export type IconSize = "sm" | "md" | "lg";
export type IconColor = "inherit" | "foreground" | "muted" | "accent" | "success" | "warning" | "danger";
export type IconProps = Omit<LucideProps, "size" | "color"> & {
    as: LucideIcon;
    /** Defaults to md; numeric values use native points / web CSS pixels. */
    size?: IconSize | number;
    /** Semantic token, or a raw SVG color for custom artwork. Defaults to inherit. */
    color?: IconColor | (LucideProps["color"] & {});
} & React.RefAttributes<LucideIcon>;
