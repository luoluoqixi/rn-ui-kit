import { jsx as _jsx } from "react/jsx-runtime";
import { StatusBar } from "expo-status-bar";
import { resolveExpoStatusBarStyle, usesNativeStackStatusBar } from "./status_bar";
/**
 * 根布局状态栏：iOS 移动端交给 Native Stack（见 `nativeStackStatusBarOptions`），
 * 避免 `expo-status-bar` 与 RN Screens 对 Info.plist 的冲突。
 */
export function AppStatusBar({ colorScheme }) {
    if (usesNativeStackStatusBar()) {
        return null;
    }
    return _jsx(StatusBar, { style: resolveExpoStatusBarStyle(colorScheme) });
}
