import { isIos26Plus, os } from "../platform";
/**
 * iOS 26 的透明导航栏默认返回按钮在部分场景下不会正确应用 `headerTintColor`。
 * 这里统一降级为原生 header item，并把系统版本判断收口在一个入口里。
 */
export function withNativeBackButton(screenOptions, options) {
    if (os() !== "ios" ||
        !isIos26Plus() ||
        screenOptions.unstable_headerLeftItems != null ||
        screenOptions.headerLeft != null) {
        return screenOptions;
    }
    return {
        ...screenOptions,
        headerBackVisible: false,
        unstable_headerLeftItems: ({ canGoBack, tintColor }) => {
            if (!canGoBack) {
                return [];
            }
            return [
                {
                    type: "button",
                    label: options.label,
                    icon: { type: "sfSymbol", name: "chevron.left" },
                    onPress: options.onPress,
                    tintColor,
                },
            ];
        },
    };
}
