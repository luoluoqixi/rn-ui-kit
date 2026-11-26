import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import { isIos26Plus, os } from "../platform";

type LegacyNativeBackButtonOptions = {
  /** @deprecated 保留仅用于源码兼容；系统按钮会读取上一页的 `title`。 */
  label?: string;
  /** @deprecated 保留仅用于源码兼容；无 title 时 UIKit 会显示本地化的“返回”。 */
  fallbackLabel?: string;
  /** @deprecated 保留仅用于源码兼容；系统按钮由 UINavigationController 执行 pop。 */
  onPress?: () => void;
};

/**
 * iOS 26 保留 UINavigationController 生成的系统返回按钮。
 *
 * 不要用 `headerLeft` / `unstable_headerLeftItems` 模拟返回按钮：它们只是普通的
 * leading bar item，不会获得系统返回按钮的长按历史菜单。透明导航栏不影响这项
 * 原生能力。菜单优先使用上一页 title；没有 title 时由 UIKit 提供本地化兜底。
 * 颜色继续交给 `headerTintColor` 和 iOS Liquid Glass 处理。
 */
export function withNativeBackButton<T extends NativeStackNavigationOptions>(
  screenOptions: T,
  _legacyOptions?: LegacyNativeBackButtonOptions,
): T {
  if (
    os() !== "ios" ||
    !isIos26Plus() ||
    screenOptions.unstable_headerLeftItems != null ||
    screenOptions.headerLeft != null
  ) {
    return screenOptions;
  }

  return {
    ...screenOptions,
    // React Navigation 默认为 true；显式保留调用方的 false。
    headerBackButtonMenuEnabled: screenOptions.headerBackButtonMenuEnabled ?? true,
  };
}
