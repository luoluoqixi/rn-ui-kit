import { Avatar as HeroUIAvatar } from "heroui-native/avatar";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { normalizeSlotText } from "../utils/slot_content";
import { avatarFallbackSize, avatarFallbackText, resolveAvatarContent } from "./avatar_content";
import type { AvatarProps } from "./types";

export function AvatarHeroUI(props: AvatarProps) {
  const { alt, src, size, variant, color, fallback, showFallback } = resolveAvatarContent(props);
  const fallbackProps = props.fallbackProps?.herouiNativeProps;
  const textClass = cn(props.fallbackTextClassName, fallbackProps?.classNames?.text, fallbackProps?.textProps?.className);
  const textStyle = useDefaultTextStyle([fallbackProps?.styles?.text, fallbackProps?.textProps?.style], textClass);
  const source = src !== undefined ? { uri: src } : props.imageProps?.herouiNativeProps?.source;
  return (
    <HeroUIAvatar accessible={alt !== ""} accessibilityRole="image" accessibilityLabel={alt}
      accessibilityElementsHidden={alt === ""} importantForAccessibility={alt === "" ? "no-hide-descendants" : "auto"}
      {...props.herouiNativeProps}
      alt={alt} size={size} variant={variant} color={color} className={props.className}
    >
      {/* Keep the image mounted so removing its source resets HeroUI's loading state. */}
      <HeroUIAvatar.Image {...props.imageProps?.herouiNativeProps} source={source}
        className={cn(props.imageClassName, props.imageProps?.className)} />
      {showFallback && (
        <HeroUIAvatar.Fallback {...fallbackProps}
          className={cn(props.fallbackClassName, props.fallbackProps?.className)}
          textProps={{ ...fallbackProps?.textProps, className: textClass, style: textStyle }}
        >
          {fallback === undefined ? undefined : typeof fallback === "number" ? String(fallback) : (
            typeof fallback === "string" ? fallback : (
              <TextClassContext.Provider value={cn("font-medium", avatarFallbackSize[size],
                avatarFallbackText[fallbackProps?.color ?? color], textClass)}>
                {normalizeSlotText(fallback)}
              </TextClassContext.Provider>
            )
          )}
        </HeroUIAvatar.Fallback>
      )}
    </HeroUIAvatar>
  );
}
