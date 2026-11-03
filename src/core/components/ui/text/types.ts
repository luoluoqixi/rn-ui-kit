import type { VariantProps } from "class-variance-authority";
import type { Text as RNText } from "react-native";
import type { textVariants } from "./variants";

export type TextVariantProps = VariantProps<typeof textVariants>;

export type TextProps = React.ComponentProps<typeof RNText> &
  React.RefAttributes<RNText> &
  TextVariantProps & {
    asChild?: boolean;
  };

export type TextVariant = NonNullable<TextVariantProps["variant"]>;
export type TextSize = NonNullable<TextVariantProps["size"]>;
