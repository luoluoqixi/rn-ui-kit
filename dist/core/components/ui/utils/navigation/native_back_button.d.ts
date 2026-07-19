import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
type NativeBackButtonOptions = {
    label: string;
    onPress: () => void;
};
/**
 * iOS 26 的透明导航栏默认返回按钮在部分场景下不会正确应用 `headerTintColor`。
 * 这里统一降级为原生 header item，并把系统版本判断收口在一个入口里。
 */
export declare function withNativeBackButton<T extends NativeStackNavigationOptions>(screenOptions: T, options: NativeBackButtonOptions): T;
export {};
