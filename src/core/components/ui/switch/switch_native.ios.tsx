import { Host, Toggle as SwiftToggle } from "@expo/ui/swift-ui";
import type { ToggleProps as ExpoSwiftToggleProps } from "@expo/ui/swift-ui";
import { disabled as disabledModifier, tint, toggleStyle } from "@expo/ui/swift-ui/modifiers";

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
    <Host matchContents style={style}>
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
