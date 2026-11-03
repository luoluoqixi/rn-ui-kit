export type MenuSize = "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export const menuTextSizeClasses: Record<MenuSize, string> = {
  "default": "text-base",
  "2xs": "text-[10px]",
  "xs": "text-xs",
  "sm": "text-sm",
  "md": "text-base",
  "lg": "text-lg",
  "xl": "text-xl",
  "2xl": "text-2xl",
};

export const menuItemPaddingClasses: Record<MenuSize, string> = {
  "default": "py-2",
  "2xs": "py-1",
  "xs": "py-1.5",
  "sm": "py-1.5",
  "md": "py-2",
  "lg": "py-2.5",
  "xl": "py-3",
  "2xl": "py-4",
};

export const menuIconSizeClasses: Record<MenuSize, string> = {
  "default": "size-5",
  "2xs": "size-3",
  "xs": "size-3.5",
  "sm": "size-4",
  "md": "size-5",
  "lg": "size-6",
  "xl": "size-7",
  "2xl": "size-8",
};

/** Match a leading icon/check slot: px-2 + the default icon width + gap-2. */
export const menuItemInsetClasses: Record<MenuSize, string> = {
  default: "pl-9",
  "2xs": "pl-7",
  xs: "pl-7.5",
  sm: "pl-8",
  md: "pl-9",
  lg: "pl-10",
  xl: "pl-11",
  "2xl": "pl-12",
};
