import { type ReactNode, forwardRef } from "react";
import { ScrollView, type ScrollViewProps, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type NavigationBarScrollEdgeTrackingProps, useNavigationBarScrollEdge } from "../../utils/navigation";
import { os } from "../../utils/platform";
import { AndroidClippedScrollView } from "./true_sheet/android_clipped_scroll_view";
import { getTrueSheetScrollBottomPadding } from "./true_sheet/sheet_scroll_layout";
import { useTrueSheetStackContentSize } from "./true_sheet/auto_stack_layout_context";
import { useTrueSheetScrollLayout } from "./true_sheet/true_sheet_scroll_context";
import { useTrueSheetScrollableRegistration } from "./true_sheet/scrollable_binding_context";

export type NativeSheetScrollContentProps = Omit<ScrollViewProps, "children"> &
  NavigationBarScrollEdgeTrackingProps & {
    children: ReactNode;
    extraBottomPadding?: number;
    /** Defaults to registering the focused page. Explicit false retains automatic discovery. */
    bindToNativeSheet?: boolean;
    /**
     * @deprecated v4 always bounds the viewport synchronously; false no longer
     * requests full-window overflow. Use a Portal for content outside the sheet.
     */
    constrainToNativeSheetViewport?: boolean;
    iosEmptyViewportScrollEnabled?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
  };

export const NativeSheetScrollContent = forwardRef<ScrollView, NativeSheetScrollContentProps>(({
  bindToNativeSheet = true,
  constrainToNativeSheetViewport: _constrainToNativeSheetViewport,
  children, contentContainerStyle, extraBottomPadding,
  navigationBarScrollEdgeOptions, onContentSizeChange, onScroll, scrollEventThrottle, style,
  tracksNavigationBarScrollEdge, ...rest
}, ref) => {
  const insets = useSafeAreaInsets();
  const { active, autoDetent, automaticContentInsetAdjustment, insetAdjustment, nativeScrollInsetsApplied } = useTrueSheetScrollLayout();
  const setRef = useTrueSheetScrollableRegistration(ref, active && bindToNativeSheet && (os() === "web" || nativeScrollInsetsApplied));
  const contentSizeChanged = useTrueSheetStackContentSize(onContentSizeChange);
  const trackedOnScroll = useNavigationBarScrollEdge({
    navigationBarScrollEdgeOptions, onScroll,
    tracksNavigationBarScrollEdge: os() === "web" && tracksNavigationBarScrollEdge === true,
  });
  const paddingBottom = getTrueSheetScrollBottomPadding({
    extraBottom: extraBottomPadding, insetAdjustment,
    nativeScrollInsetsApplied, safeAreaBottom: insets.bottom,
  });
  const scrollStyle: StyleProp<ViewStyle> = [
    autoDetent ? { flexGrow: 0, flexBasis: "auto", flexShrink: 1 } : { flex: 1 }, { minHeight: 0 }, style,
  ];
  const contentStyle: StyleProp<ViewStyle> = [{ flexGrow: 0, paddingBottom }, contentContainerStyle];
  if (os() === "android") {
    return <AndroidClippedScrollView
      ref={setRef} keyboardShouldPersistTaps="handled" nestedScrollEnabled
      navigationBarScrollEdgeOptions={navigationBarScrollEdgeOptions}
      onContentSizeChange={contentSizeChanged}
      onScroll={onScroll} scrollEventThrottle={scrollEventThrottle} showsVerticalScrollIndicator
      style={scrollStyle} contentContainerStyle={contentStyle}
      tracksNavigationBarScrollEdge={tracksNavigationBarScrollEdge} {...rest}
    >{children}</AndroidClippedScrollView>;
  }
  return <ScrollView
    ref={setRef} keyboardShouldPersistTaps="handled" nestedScrollEnabled
    onContentSizeChange={contentSizeChanged}
    onScroll={trackedOnScroll} showsVerticalScrollIndicator style={scrollStyle}
    contentContainerStyle={contentStyle}
    scrollEventThrottle={scrollEventThrottle ?? (trackedOnScroll ? 16 : undefined)}
    contentInsetAdjustmentBehavior={automaticContentInsetAdjustment ? "automatic" : "never"}
    {...rest}
  >{children}</ScrollView>;
});
NativeSheetScrollContent.displayName = "NativeSheetScrollContent";
