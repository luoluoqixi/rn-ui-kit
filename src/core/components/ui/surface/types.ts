import type { ComponentProps, ReactNode } from "react";
import type { Surface as NativeSurface } from "heroui-native/surface";
import type { Surface as WebSurface } from "@heroui/react/surface";
import type { FieldSlotProps } from "../utils/field_types";
export type SurfaceProps = FieldSlotProps<ComponentProps<typeof NativeSurface>, ComponentProps<typeof WebSurface<"div">>, "variant"> & {
  variant?: "default" | "secondary" | "tertiary" | "transparent";
  children?: ReactNode;
};
