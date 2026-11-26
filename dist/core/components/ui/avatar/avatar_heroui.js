import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar as HeroUIAvatar } from "@heroui/react/avatar";
import { User } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { Icon } from "../icon";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { avatarFallbackSize, avatarFallbackText, resolveAvatarContent } from "./avatar_content";
export function AvatarHeroUI(props) {
    const { alt, src, size, variant, color, fallback, showFallback } = resolveAvatarContent(props);
    const fallbackColor = props.fallbackProps?.herouiWebProps?.color ?? color;
    const textClass = cn("font-medium", avatarFallbackSize[size], avatarFallbackText[fallbackColor], props.fallbackTextClassName);
    const font = StyleSheet.flatten(useDefaultTextStyle(undefined, props.fallbackTextClassName));
    return (_jsxs(HeroUIAvatar, { role: "img", "aria-label": alt || undefined, "aria-hidden": alt === "" || undefined, ...props.herouiWebProps, size: size, variant: variant, color: color, className: props.className, children: [_jsx(HeroUIAvatar.Image, { ...props.imageProps?.herouiWebProps, src: src, alt: "", className: cn(props.imageClassName, props.imageProps?.className) }), showFallback && (_jsx(HeroUIAvatar.Fallback, { ...props.fallbackProps?.herouiWebProps, className: cn(props.fallbackClassName, props.fallbackProps?.className, props.fallbackTextClassName), style: { fontFamily: font?.fontFamily, ...props.fallbackProps?.herouiWebProps?.style }, children: _jsx(TextClassContext.Provider, { value: textClass, children: fallback === undefined ? (_jsx(Icon, { as: User, size: { sm: 14, md: 16, lg: 20 }[size], className: avatarFallbackText[fallbackColor] })) : fallback }) }))] }));
}
