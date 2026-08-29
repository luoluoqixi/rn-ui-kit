import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  ScrollView as ReactNativeScrollView,
  type ScrollViewProps as ReactNativeScrollViewProps,
  StyleSheet,
  View,
} from "react-native";

import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { useNavigationBarScrollEdge } from "../utils/navigation";
import { isWeb, os } from "../utils/platform";

import { useScrollTrack, type ScrollTrackOptions } from "./scroll_track";
import type { ScrollViewProps } from "./types";

const AndroidTrackedScrollView = forwardRef<any, ScrollViewProps>((props, ref) => {
  const {
    navigationBarScrollEdgeOptions,
    onScroll,
    scrollEventThrottle,
    tracksNavigationBarScrollEdge,
    ...restProps
  } = props;
  const trackedOnScroll = useNavigationBarScrollEdge({
    navigationBarScrollEdgeOptions,
    onScroll: onScroll as any,
    tracksNavigationBarScrollEdge,
  });

  return (
    <ReactNativeScrollView
      ref={ref}
      nestedScrollEnabled
      onScroll={trackedOnScroll}
      scrollEventThrottle={scrollEventThrottle ?? 16}
      {...(restProps as any)}
    />
  );
});
AndroidTrackedScrollView.displayName = "AndroidTrackedScrollView";

const WebTrackedScrollView = forwardRef<any, ScrollViewProps>((props, ref) => {
  const {
    navigationBarScrollEdgeOptions,
    onScroll,
    scrollEventThrottle,
    tracksNavigationBarScrollEdge,
    ...webProps
  } = props;
  const trackedOnScroll = useNavigationBarScrollEdge({
    navigationBarScrollEdgeOptions,
    onScroll: onScroll as any,
    tracksNavigationBarScrollEdge,
  });

  return (
    <ReactNativeScrollView
      ref={ref}
      onScroll={trackedOnScroll as any}
      scrollEventThrottle={scrollEventThrottle ?? (trackedOnScroll == null ? undefined : 16)}
      {...(webProps as ReactNativeScrollViewProps)}
    />
  );
});
WebTrackedScrollView.displayName = "WebTrackedScrollView";

const BaseScrollView = forwardRef<any, ScrollViewProps>((props, ref) => {
  const { active: insideTrueSheet } = useTrueSheetScrollLayout();

  if (isWeb()) {
    return <WebTrackedScrollView ref={ref} {...props} />;
  }

  const {
    automaticallyAdjustsScrollIndicatorInsets,
    customScrollbar: _customScrollbar,
    iosEmptyViewportScrollEnabled = true,
    navigationBarScrollEdgeOptions,
    nestedScrollEnabled,
    scrollIndicatorInsets,
    tracksNavigationBarScrollEdge = false,
    ...restProps
  } = props as ScrollViewProps & {
    nestedScrollEnabled?: boolean;
  };

  if (os() === "android" && tracksNavigationBarScrollEdge) {
    return (
      <AndroidTrackedScrollView
        ref={ref}
        automaticallyAdjustsScrollIndicatorInsets={automaticallyAdjustsScrollIndicatorInsets}
        navigationBarScrollEdgeOptions={navigationBarScrollEdgeOptions}
        nestedScrollEnabled={nestedScrollEnabled ?? true}
        scrollIndicatorInsets={scrollIndicatorInsets}
        tracksNavigationBarScrollEdge
        {...restProps}
      />
    );
  }

  // 普通 native-stack 页面已位于 header 下方，默认关闭系统的重复 indicator 调整。
  // 不能在这里补窗口 safe-area bottom：该 ScrollView 也可能只是页面中的局部滚动区域。
  // 页面级透明 header / safe-area 避让应显式开启 automaticallyAdjustsScrollIndicatorInsets。
  const manuallyAdjustNormalPageIndicator =
    os() === "ios" && !insideTrueSheet && automaticallyAdjustsScrollIndicatorInsets == null;

  return (
    <ReactNativeScrollView
      ref={ref}
      automaticallyAdjustsScrollIndicatorInsets={
        manuallyAdjustNormalPageIndicator ? false : automaticallyAdjustsScrollIndicatorInsets
      }
      iosEmptyViewportScrollEnabled={os() === "ios" ? iosEmptyViewportScrollEnabled : undefined}
      nestedScrollEnabled={nestedScrollEnabled ?? true}
      scrollIndicatorInsets={scrollIndicatorInsets}
      {...(restProps as any)}
    />
  );
});

const CustomScrollbarScrollView = forwardRef<any, ScrollViewProps>((props, ref) => {
  const { customScrollbar, style, ...scrollViewProps } = props;
  const nativeScrollRef = useRef<any>(null);
  const customScrollbarOptions: ScrollTrackOptions =
    typeof customScrollbar === "object" ? customScrollbar : {};
  const scrollTrack = useScrollTrack({
    ...customScrollbarOptions,
    onContentSizeChange: scrollViewProps.onContentSizeChange,
    onLayout: scrollViewProps.onLayout,
    onScroll: scrollViewProps.onScroll,
    scrollRef: nativeScrollRef,
  });

  useImperativeHandle(ref, () => nativeScrollRef.current);

  return (
    <View style={[style, styles.customScrollbarContainer]}>
      <BaseScrollView
        {...scrollViewProps}
        ref={nativeScrollRef}
        onContentSizeChange={scrollTrack.onContentSizeChange}
        onLayout={scrollTrack.onLayout}
        onScroll={scrollTrack.onScroll}
        scrollEventThrottle={scrollViewProps.scrollEventThrottle ?? 16}
        showsVerticalScrollIndicator={false}
        style={styles.customScrollbarScrollView}
      />
      {scrollTrack.ScrollTrack}
    </View>
  );
});
CustomScrollbarScrollView.displayName = "CustomScrollbarScrollView";

export const ScrollView = forwardRef<any, ScrollViewProps>((props, ref) => {
  if (props.customScrollbar) {
    return <CustomScrollbarScrollView ref={ref} {...props} />;
  }

  return <BaseScrollView ref={ref} {...props} />;
});

const styles = StyleSheet.create({
  customScrollbarContainer: {
    position: "relative",
  },
  customScrollbarScrollView: {
    flex: 1,
  },
});
