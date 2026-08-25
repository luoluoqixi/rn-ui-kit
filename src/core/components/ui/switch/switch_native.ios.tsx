import { Host, Toggle as SwiftToggle } from "@luoluoqixi/expo-ui-55/swift-ui";
import type { ToggleProps as ExpoSwiftToggleProps } from "@luoluoqixi/expo-ui-55/swift-ui";
import {
  disabled as disabledModifier,
  tint,
  toggleStyle,
} from "@luoluoqixi/expo-ui-55/swift-ui/modifiers";

import { toSwiftUIHexColor, useUiTheme } from "../utils";
import type { SwitchNativeProps } from "./types";

export function SwitchNative({
  disabled,
  nativeSwiftProps,
  onValueChange,
  style,
  value,
}: SwitchNativeProps) {
  const theme = useUiTheme();
  const {
    isOn: _overriddenIsOn,
    modifiers: overriddenModifiers,
    onIsOnChange,
    ...props
  } = (nativeSwiftProps ?? {}) as Partial<ExpoSwiftToggleProps>;
  // NativeList uses the same semantic primary token for the SwiftUI switch tint.
  const themeTint = toSwiftUIHexColor(theme.primary) ?? theme.primary;

  return (
    <Host
      // SwiftUI Host 在滚动容器靠近上下边缘时可能按可见 safe area 重新约束原生控件，
      // 导致 Switch 初次位置偏移，触摸后重新布局才恢复。Switch 与 Slider 一样忽略 safe area。
      ignoreSafeArea="all"
      matchContents
      style={style}
    >
      <SwiftToggle
        {...props}
        isOn={value}
        modifiers={[
          toggleStyle("switch"),
          ...(themeTint != null ? [tint(themeTint)] : []),
          disabledModifier(disabled === true),
          ...(overriddenModifiers ?? []),
        ]}
        onIsOnChange={(nextValue) => {
          onValueChange(nextValue);
          onIsOnChange?.(nextValue);
        }}
      />
    </Host>
  );
}
