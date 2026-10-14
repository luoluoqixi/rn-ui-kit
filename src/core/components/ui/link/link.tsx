import { forwardRef } from "react";
import { Linking, Pressable } from "react-native";

import { Button } from "../button";
import type { LinkProps } from "./types";

export const DEFAULT_LINK_PRESS_STYLE = { opacity: 0.5 } as const;
export const DEFAULT_LINK_FOCUS_VISIBLE_STYLE = {} as const;

/** Link uses the RNR Button link variant so native and web share the same button semantics. */
export const Link = forwardRef<React.ComponentRef<typeof Pressable>, LinkProps>(function Link(
  { children, href, nativeHaptics, onPress, pressStyle, style, ...props },
  ref,
) {
  return (
    <Button
      {...(props as React.ComponentProps<typeof Button>)}
      accessibilityRole="link"
      nativeHaptics={nativeHaptics}
      onPress={(event) => {
        onPress?.(event);
        if (event.defaultPrevented) return;
        if (href != null) void Linking.openURL(href);
      }}
      ref={ref}
      style={({ pressed }) => [style, pressed ? (pressStyle ?? DEFAULT_LINK_PRESS_STYLE) : null]}
      variant="link"
    >
      {children}
    </Button>
  );
});
