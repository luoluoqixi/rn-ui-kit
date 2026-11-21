import { Typography } from "@heroui/react/typography";
import { TextContext } from "react-aria-components/Text";
import { useContext } from "react";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "../utils/cn";
import { textWebStyle } from "./text_style_web";
import { textClassName } from "./text_classes";
import { TextClassContext } from "./text_context";
import type { TextProps } from "./types";

// HeroUI 3.2.7 forwards RAC props after its default tag. Its declaration omits
// elementType; keep this version-tested inline bridge local to the adapter.
const inlineElementProps = { elementType: "span" } as const;

export function TextHeroUI({
  children,
  className,
  type,
  align,
  color,
  weight,
  truncate,
  style,
  nativeID,
  testID,
  accessibilityLabel,
  numberOfLines,
  ellipsizeMode,
  selectable,
  herouiNativeProps: _,
  herouiWebProps,
}: TextProps) {
  const inherited = useContext(TextClassContext);
  const classes = textClassName(
    { type, color, align, weight, className },
    inherited,
  );
  const sharedStyle = useDefaultTextStyle(
    style,
    cn(type === "code" && "font-mono", classes),
  );
  const css = {
    ...textWebStyle(sharedStyle),
    ...(selectable == null
      ? {}
      : { userSelect: selectable ? ("text" as const) : ("none" as const) }),
    ...(numberOfLines && numberOfLines > 1
      ? {
          display: "-webkit-box",
          WebkitLineClamp: numberOfLines,
          WebkitBoxOrient: "vertical" as const,
          overflow: "hidden",
        }
      : {}),
    ...(ellipsizeMode === "clip" ? { textOverflow: "clip" } : {}),
    ...herouiWebProps?.style,
  };
  const text = (
    <Typography
      id={nativeID}
      data-testid={testID}
      aria-label={accessibilityLabel}
      {...herouiWebProps}
      type={type}
      align={align}
      color={color}
      weight={weight}
      truncate={numberOfLines == null ? truncate : numberOfLines === 1}
      className={classes}
      style={css}
      // Default Text is inline inside labels/buttons/other Text; explicit body types are paragraphs.
      {...(type == null ? inlineElementProps : {})}
    >
      {children}
    </Typography>
  );
  // Ordinary typography must not claim a form field's description/error slot.
  return herouiWebProps?.slot === undefined ? (
    <TextContext.Provider value={null}>{text}</TextContext.Provider>
  ) : (
    text
  );
}
