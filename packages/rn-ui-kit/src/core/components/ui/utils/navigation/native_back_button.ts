import type {
  NativeStackHeaderBackProps,
  NativeStackHeaderItemProps,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";

import { isIos26Plus, os } from "../platform";

type NativeBackButtonOptions = {
  /** 省略时沿用 React Navigation 推导出的上一页标题。 */
  label?: string;
  /** 上一页没有标题时使用的兜底文案。 */
  fallbackLabel?: string;
  onPress: () => void;
};

/**
 * iOS 26 的透明导航栏默认返回按钮在部分场景下不会正确应用 `headerTintColor`。
 * 这里统一降级为原生 header item，并把系统版本判断收口在一个入口里。
 */
export function withNativeBackButton<T extends NativeStackNavigationOptions>(
  screenOptions: T,
  options: NativeBackButtonOptions,
): T {
  if (
    os() !== "ios" ||
    !isIos26Plus() ||
    screenOptions.unstable_headerLeftItems != null ||
    screenOptions.headerLeft != null
  ) {
    return screenOptions;
  }

  let inferredLabel: string | undefined;

  return {
    ...screenOptions,
    headerBackVisible: false,
    // unstable_headerLeftItems 的参数没有上一页标题；headerLeft 会先收到完整的 back props，
    // 即使最终由原生 item 覆盖，也可用它把系统推导的标题传给 iOS 26 原生按钮。
    ...(options.label == null
      ? {
          headerLeft: ({ label }: NativeStackHeaderBackProps) => {
            inferredLabel = label;
            return null;
          },
        }
      : {}),
    unstable_headerLeftItems: ({ canGoBack, tintColor }: NativeStackHeaderItemProps) => {
      if (!canGoBack) {
        return [];
      }

      return [
        {
          type: "button" as const,
          label: options.label ?? inferredLabel ?? options.fallbackLabel ?? "返回",
          icon: { type: "sfSymbol" as const, name: "chevron.left" as const },
          onPress: options.onPress,
          tintColor,
        },
      ];
    },
  };
}
