import type { ComponentProps } from "react";
import type { ButtonProps as ExpoSwiftUIButtonProps } from "@expo/ui/swift-ui";
import type { SFSymbol } from "sf-symbols-typescript";
import type { Button as TamaguiButton } from "tamagui";
import type { NativeHapticsSetting } from "../utils";
/**
 * 原生 Button 渲染模式。
 *
 * `true` 保留 React Native Button 的既有行为；`"swift-ui"` 仅在 iOS 使用
 * Expo UI SwiftUI Button，不支持的平台会回退到本库的普通 Button。
 */
export type ButtonNativeMode = boolean | "swift-ui";
/** `native="swift-ui"` 时可传给 Expo SwiftUI Button 的属性。 */
export type ButtonNativeSwiftProps = Omit<ExpoSwiftUIButtonProps, "onPress">;
/** Button 在所有渲染路径中共享的宽高设置。 */
export type ButtonSize = {
    height?: number;
    width?: number;
};
export type ButtonProps = ComponentProps<typeof TamaguiButton> & {
    delayLongPress?: number;
    nativeHaptics?: NativeHapticsSetting;
    native?: ButtonNativeMode;
    /** `native="swift-ui"` 时使用的 SF Symbol。 */
    nativeSystemImage?: SFSymbol;
    /** `native="swift-ui"` 下 SF Symbol 的尺寸。默认 20。 */
    nativeSystemImageSize?: number;
    /** `native="swift-ui"` 下的 SwiftUI buttonStyle。默认 automatic。 */
    nativeButtonStyle?: "automatic" | "glass" | "glassProminent";
    /** 所有 Button 渲染路径共享的宽高设置。 */
    buttonSize?: ButtonSize;
    /** @deprecated 请使用 `buttonSize`。 */
    nativeSwiftButtonSize?: ButtonSize;
    /**
     * `native="swift-ui"` 时传给 Expo SwiftUI Button 的附加属性。
     * `onPress` 由本库保留以处理回调与触感；`modifiers` 会在默认修饰器之后应用，可覆盖默认样式。
     * `children` 可替换默认标题或 SF Symbol 标签。
     */
    nativeSwiftProps?: ButtonNativeSwiftProps;
    title?: string;
};
