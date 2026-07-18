import { NavigationContext } from "@react-navigation/native";
import { type ReactNode, forwardRef, useCallback, useContext, useEffect, useRef } from "react";
import {
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { os } from "../../utils/platform";

import { AndroidClippedScrollView } from "./true_sheet/android_clipped_scroll_view";
import {
  getTrueSheetScrollBottomPadding,
  getTrueSheetScrollIndicatorBottomInset,
} from "./true_sheet/sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "./true_sheet/true_sheet_scroll_context";
import { useOptionalTrueSheetScrollableBinding } from "./true_sheet/scrollable_binding_context";

export type NativeSheetScrollContentProps = Omit<ScrollViewProps, "children"> & {
  children: ReactNode;
  /** 追加在底部安全区与默认留白之后 */
  extraBottomPadding?: number;
  /**
   * 将当前 ScrollView 显式注册为所在 TrueSheet 的滚动视图。
   * NativeSheetStack 页面应传入当前页面的 focus 状态；默认不注册，保留 TrueSheet 原有查找逻辑。
   */
  bindToNativeSheet?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

type NativeStackTransitionEndNavigation = {
  addListener: (
    event: "transitionEnd",
    listener: (event: { data?: { closing?: boolean } }) => void,
  ) => () => void;
};

/**
 * NativeSheet 内滚动容器：
 * - iOS TrueSheet 子树下复用现有 inset / detent 补偿
 * - Android TrueSheet 下使用裁剪滚动容器，避免滚动内容溢出圆角区域
 */
export const NativeSheetScrollContent = forwardRef<ScrollView, NativeSheetScrollContentProps>(
  (
    { bindToNativeSheet = false, children, contentContainerStyle, extraBottomPadding, style, ...rest },
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    const binding = useOptionalTrueSheetScrollableBinding();
    const navigation = useContext(NavigationContext) as
      | NativeStackTransitionEndNavigation
      | undefined;
    const bindingOwnerRef = useRef<object>({});
    const scrollViewRef = useRef<ScrollView | null>(null);
    const shouldBindToNativeSheet = os() === "ios" && bindToNativeSheet;
    const { automaticContentInsetAdjustment, insetAdjustment, nativeScrollInsetsApplied } =
      useTrueSheetScrollLayout();
    // Once the exact ScrollView is registered, TrueSheet applies its native content/indicator
    // insets even though deep Stack pages historically reported that native pinning was absent.
    const effectiveNativeScrollInsetsApplied =
      nativeScrollInsetsApplied || shouldBindToNativeSheet;

    const setScrollViewRef = useCallback(
      (scrollView: ScrollView | null) => {
        scrollViewRef.current = scrollView;

        if (typeof ref === "function") {
          ref(scrollView);
        } else if (ref != null) {
          ref.current = scrollView;
        }

        if (shouldBindToNativeSheet) {
          binding?.registerScrollableView(bindingOwnerRef.current, scrollView);
        }
      },
      [binding, ref, shouldBindToNativeSheet],
    );

    useEffect(() => {
      if (os() !== "ios") return;

      const owner = bindingOwnerRef.current;
      if (shouldBindToNativeSheet) {
        binding?.registerScrollableView(owner, scrollViewRef.current);
      } else {
        binding?.registerScrollableView(owner, null);
      }

      return () => binding?.registerScrollableView(owner, null);
    }, [binding, shouldBindToNativeSheet]);

    useEffect(() => {
      if (!shouldBindToNativeSheet || navigation == null) return;

      const owner = bindingOwnerRef.current;
      return navigation.addListener("transitionEnd", (event) => {
        if (event.data?.closing) return;
        binding?.refreshScrollableView(owner);
      });
    }, [binding, navigation, shouldBindToNativeSheet]);

    if (os() === "android") {
      return (
        <AndroidClippedScrollView
          ref={ref}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          showsVerticalScrollIndicator
          style={[styles.androidScroll, style]}
          contentContainerStyle={[styles.androidContent, contentContainerStyle]}
          {...rest}
        >
          {children}
        </AndroidClippedScrollView>
      );
    }

    const bottomPadding = getTrueSheetScrollBottomPadding({
      extraBottom: extraBottomPadding,
      insetAdjustment,
      nativeScrollInsetsApplied: effectiveNativeScrollInsetsApplied,
      safeAreaBottom: insets.bottom,
    });
    const indicatorBottomInset = getTrueSheetScrollIndicatorBottomInset({
      automaticContentInsetAdjustment,
      nativeScrollInsetsApplied: effectiveNativeScrollInsetsApplied,
      safeAreaBottom: insets.bottom,
    });

    return (
      <ScrollView
        ref={setScrollViewRef}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        showsVerticalScrollIndicator
        style={[styles.iosScroll, style]}
        contentContainerStyle={[
          styles.iosContent,
          { paddingBottom: bottomPadding },
          contentContainerStyle,
        ]}
        scrollIndicatorInsets={{
          bottom: indicatorBottomInset,
        }}
        contentInsetAdjustmentBehavior={automaticContentInsetAdjustment ? "automatic" : "never"}
        {...rest}
      >
        {children}
      </ScrollView>
    );
  },
);
NativeSheetScrollContent.displayName = "NativeSheetScrollContent";

const styles = StyleSheet.create({
  androidContent: {
    flexGrow: 1,
  },
  androidScroll: {
    flexGrow: 1,
  },
  iosContent: {
    flexGrow: 0,
  },
  iosScroll: {
    flex: 1,
    minHeight: 0,
  },
});
