import { cn } from "../utils/cn";
import { Slot } from "@rn-primitives/slot";
import * as React from "react";
import { Platform, Text as RNText, type Role } from "react-native";

import { TextProps, TextVariant } from "./types";
import { textVariants } from "./variants";

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  blockquote: Platform.select({ web: "blockquote" as Role }),
  code: Platform.select({ web: "code" as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: "1",
  h2: "2",
  h3: "3",
  h4: "4",
};

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<RNText, TextProps>(function Text(
  { className, asChild = false, size, variant = "default", ...props },
  ref,
) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      className={cn(textVariants({ size, variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      ref={ref}
      {...props}
    />
  );
});

export { Text, TextClassContext, textVariants };
