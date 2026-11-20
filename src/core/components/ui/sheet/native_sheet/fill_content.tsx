import { useTrueSheetStackContentSize } from "./true_sheet/auto_stack_layout_context";
import { useTrueSheetScrollLayout } from "./true_sheet/true_sheet_scroll_context";
import { type ReactNode } from "react";
import { View, type ViewProps, type StyleProp, type ViewStyle } from "react-native";

export type NativeSheetFillContentProps = Omit<ViewProps, "children"> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** v4 propagates the visible sheet height through Yoga, including native stack pages. */
export function NativeSheetFillContent({ children, onLayout, style, ...props }: NativeSheetFillContentProps) {
  const reportContentSize = useTrueSheetStackContentSize();
  const { autoDetent } = useTrueSheetScrollLayout();
  return <View onLayout={(event) => { if (autoDetent) reportContentSize(event.nativeEvent.layout.width, event.nativeEvent.layout.height); onLayout?.(event); }} style={[autoDetent ? { flexGrow: 0, flexBasis: "auto", flexShrink: 1 } : { flex: 1, minHeight: 0 }, style]} {...props}>{children}</View>;
}
