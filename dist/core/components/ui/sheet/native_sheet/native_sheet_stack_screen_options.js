import { ArrowLeft } from "@tamagui/lucide-icons-2";
import { createElement } from "react";
import { Platform } from "react-native";
import { os } from "../../utils/platform";
import { getIosNativeScrollEdgeHeaderOptions } from "../../utils/navigation";
import { nativeStackStatusBarOptions } from "../../utils/navigation/status_bar";
/** NativeSheetStack 的统一 screenOptions：iOS 走 Native Stack，其它平台走 JS Stack。 */
export function nativeSheetStackScreenOptions(colorScheme, backgroundColor, tintColor, titleColor) {
    if (Platform.OS === "ios") {
        return {
            ...nativeStackStatusBarOptions(colorScheme),
            contentStyle: {
                backgroundColor,
                flex: 1,
            },
            headerShadowVisible: false,
            headerTransparent: true,
            headerStyle: {
                backgroundColor: "transparent",
            },
            headerTintColor: tintColor,
            headerTitleStyle: {
                color: titleColor,
            },
            ...getIosNativeScrollEdgeHeaderOptions(),
        };
    }
    return {
        cardStyle: {
            backgroundColor,
        },
        headerBackImage: ({ tintColor: backTintColor }) => createElement(ArrowLeft, { color: backTintColor, size: 24 }),
        headerBackTitle: os() === "ios" ? "返回" : undefined,
        headerStatusBarHeight: 0,
        headerStyle: {
            backgroundColor,
        },
        headerTintColor: tintColor,
        headerTitleStyle: {
            color: titleColor,
        },
    };
}
