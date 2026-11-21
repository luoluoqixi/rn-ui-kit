import { Button as HeroUIButton } from "@heroui/react/button";
import { forwardRef, type ComponentRef } from "react";
import { type Pressable } from "react-native";
import { Text } from "../text";
import { TextClassContext } from "../text/text_context";
import { Spinner } from "../spinner";
import { cn } from "../utils/cn";
import { buttonChildren, buttonDimensions, buttonTextClass } from "./button_content";
import { ButtonLoadingIcon } from "./button_loading_icon";
import { useButtonWebInterop } from "./button_web_interop";
import type { ButtonProps } from "./types";

export const ButtonHeroUI = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(function ButtonHeroUI({
  native: _, nativeMatchContents: _match, nativeButtonStyle: _buttonStyle,
  nativeComposeProps: _compose, nativeSwiftProps: _swift, nativeSystemImage: _image,
  nativeSystemImageSize: _imageSize, nativeHaptics: _haptics, herouiNativeProps: _native,
  herouiWebProps, buttonSize, buttonColor, circular, children, title,
  loading, loadingIcon, textClassName, textStyle, className, style,
  size = "md", variant = "primary", isIconOnly, disabled, isDisabled, ...props
}, ref) {
  const unavailable = !!(disabled || isDisabled || loading);
  const bridge = useButtonWebInterop({ ...props, disabled: unavailable,
    style: (state) => [buttonDimensions(buttonSize), typeof style === "function" ? style(state) : style],
  }, ref, herouiWebProps?.ref);
  const webStyle = herouiWebProps?.style;
  return <TextClassContext.Provider value={buttonTextClass(variant, size)}>
    <HeroUIButton
      {...bridge.domProps}
      {...herouiWebProps}
      ref={bridge.ref}
      variant={variant} size={size} isIconOnly={isIconOnly} isDisabled={unavailable}
      isPending={!!loading}
      aria-busy={loading || bridge.domProps["aria-busy"] || undefined}
      className={cn(bridge.domProps.className, circular && "rounded-full", className)}
      style={typeof webStyle === "function" ? (state) => ({ ...bridge.domProps.style, ...webStyle(state) })
        : { ...bridge.domProps.style, ...webStyle }}
      onClick={(event) => {
        if (unavailable) return;
        herouiWebProps?.onClick?.(event);
        if (!event.defaultPrevented) bridge.domProps.onClick?.(event);
      }}
      onFocus={(event) => { bridge.domProps.onFocus?.(event); herouiWebProps?.onFocus?.(event); }}
      onBlur={(event) => { bridge.domProps.onBlur?.(event); herouiWebProps?.onBlur?.(event); }}
      onContextMenu={(event) => { bridge.domProps.onContextMenu?.(event); herouiWebProps?.onContextMenu?.(event); }}
    >
      {loading ? loadingIcon != null ? <ButtonLoadingIcon>{loadingIcon}</ButtonLoadingIcon> : <Spinner size="sm" color="current" /> : null}
      {buttonChildren(title ?? (typeof children === "function" ? children(bridge.state) : children),
        (child) => <Text className={textClassName} style={[textStyle, buttonColor == null ? undefined : { color: buttonColor }]}>{child}</Text>)}
    </HeroUIButton>
  </TextClassContext.Provider>;
});
