import { Platform } from "react-native";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";

// Keep unmigrated AlertDialog actions unchanged until their migration.
const buttonVariants = cva(
  cn(
    "group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none",
    Platform.select({
      web: "focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 aria-invalid:border-danger whitespace-nowrap outline-none focus-visible:ring-[3px] [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    }),
  ),
  {
    variants: {
      variant: {
        default: "bg-accent shadow-sm shadow-black/5",
        destructive: cn(
          "bg-danger shadow-sm shadow-black/5",
          Platform.select({
            web: "focus-visible:ring-danger/20 dark:focus-visible:ring-danger/40",
          }),
        ),
        outline: cn(
          "border-border bg-background active:bg-accent-soft dark:bg-field-border/30 dark:border-field-border border shadow-sm shadow-black/5",
          Platform.select({
            web: "hover:bg-accent03 disabled:hover:bg-background disabled:active:bg-background",
            // Native 中 dark 背景会覆盖单独的 active，组合状态需明确提高优先级。
            native: "dark:active:bg-accent-soft",
          }),
        ),
        secondary: cn(
          "bg-default active:bg-field-border shadow-sm shadow-black/5",
          Platform.select({ web: "hover:bg-field-border/70" }),
        ),
        ghost: cn(
          "active:bg-accent-soft",
          Platform.select({ web: "hover:bg-accent03" }),
        ),
        link: Platform.select({ web: "hover:opacity-80" }),
        icon: cn(
          "bg-transparent active:bg-accent-soft",
          Platform.select({ web: "hover:bg-accent03" }),
        ),
      },
      size: {
        "2xs": cn(
          "h-8 min-w-8 gap-1 rounded-md px-2 py-1",
          Platform.select({ web: "has-[>svg]:px-1.5" }),
        ),
        "xs": cn(
          "h-9 min-w-9 gap-1 rounded-md px-3 py-1.5",
          Platform.select({ web: "has-[>svg]:px-2" }),
        ),
        "sm": cn(
          "h-10 min-w-10 gap-1.5 rounded-md px-4 py-2",
          Platform.select({ web: "has-[>svg]:px-3" }),
        ),
        "md": cn("h-11 min-w-11 px-5 py-2.5", Platform.select({ web: "has-[>svg]:px-4" })),
        // `default` remains an alias for the former default size.
        "default": cn("h-11 min-w-11 px-5 py-2.5", Platform.select({ web: "has-[>svg]:px-4" })),
        "lg": cn(
          "h-12 min-w-12 rounded-md px-6 py-2.5",
          Platform.select({ web: "has-[>svg]:px-5" }),
        ),
        "xl": cn(
          "h-14 min-w-14 gap-2.5 rounded-md px-8 py-3",
          Platform.select({ web: "has-[>svg]:px-6" }),
        ),
        "2xl": cn(
          "h-16 min-w-16 gap-3 rounded-md px-10 py-4",
          Platform.select({ web: "has-[>svg]:px-8" }),
        ),
      },
    },
    compoundVariants: [
      { variant: "icon", size: "2xs", class: "w-8 px-0" },
      { variant: "icon", size: "xs", class: "w-9 px-0" },
      { variant: "icon", size: "sm", class: "w-10 px-0" },
      { variant: "icon", size: "md", class: "w-11 px-0" },
      { variant: "icon", size: "default", class: "w-11 px-0" },
      { variant: "icon", size: "lg", class: "w-12 px-0" },
      { variant: "icon", size: "xl", class: "w-14 px-0" },
      { variant: "icon", size: "2xl", class: "w-16 px-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  cn(
    "text-foreground text-sm font-medium",
    Platform.select({ web: "pointer-events-none transition-colors" }),
  ),
  {
    variants: {
      variant: {
        default: "text-accent-foreground",
        destructive: "text-danger-foreground",
        outline: cn(
          "group-active:text-accent-soft-foreground",
          Platform.select({
            web: "group-hover:text-accent-soft-foreground disabled:group-hover:text-foreground disabled:group-active:text-foreground",
          }),
        ),
        secondary: "text-default-foreground",
        ghost: "group-active:text-accent-soft-foreground",
        icon: "group-active:text-accent-soft-foreground",
        link: cn(
          "text-accent underline underline-offset-4 group-active:opacity-70",
          Platform.select({ web: "group-hover:opacity-80" }),
        ),
      },
      size: {
        "2xs": "text-xs",
        "xs": "text-xs",
        "sm": "text-sm",
        "md": "text-base",
        "default": "text-base",
        "lg": "text-base",
        "xl": "text-lg",
        "2xl": "text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export { buttonVariants, buttonTextVariants };
