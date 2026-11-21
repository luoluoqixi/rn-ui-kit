import { Avatar as HeroUIAvatar } from "@heroui/react/avatar";
import { User } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { Icon } from "../icon";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { avatarFallbackSize, avatarFallbackText, resolveAvatarContent } from "./avatar_content";
import type { AvatarProps } from "./types";

export function AvatarHeroUI(props: AvatarProps) {
  const { alt, src, size, variant, color, fallback, showFallback } = resolveAvatarContent(props);
  const fallbackColor = props.fallbackProps?.herouiWebProps?.color ?? color;
  const textClass = cn("font-medium", avatarFallbackSize[size], avatarFallbackText[fallbackColor], props.fallbackTextClassName);
  const font = StyleSheet.flatten(useDefaultTextStyle(undefined, props.fallbackTextClassName));
  return (
    <HeroUIAvatar role="img" aria-label={alt || undefined} aria-hidden={alt === "" || undefined}
      {...props.herouiWebProps} size={size} variant={variant} color={color} className={props.className}
    >
      <HeroUIAvatar.Image {...props.imageProps?.herouiWebProps} src={src} alt=""
        className={cn(props.imageClassName, props.imageProps?.className)} />
      {showFallback && (
        <HeroUIAvatar.Fallback {...props.fallbackProps?.herouiWebProps}
          className={cn(props.fallbackClassName, props.fallbackProps?.className, props.fallbackTextClassName)}
          style={{ fontFamily: font?.fontFamily, ...props.fallbackProps?.herouiWebProps?.style }}
        >
          <TextClassContext.Provider value={textClass}>
            {fallback === undefined ? (
              <Icon as={User} size={{ sm: 14, md: 16, lg: 20 }[size]} className={avatarFallbackText[fallbackColor]} />
            ) : fallback}
          </TextClassContext.Provider>
        </HeroUIAvatar.Fallback>
      )}
    </HeroUIAvatar>
  );
}
