import { forwardRef } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView as TamaguiScrollView } from "tamagui";

import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { isWeb, os } from "../utils/platform";

import type { ScrollViewProps } from "./types";

export const ScrollView = forwardRef<any, ScrollViewProps>((props, ref) => {
  const { active: insideTrueSheet } = useTrueSheetScrollLayout();
  const insets = useSafeAreaInsets();

  if (isWeb()) {
    const { bottomSheetScrollable: _bottomSheetScrollable, ...webProps } = props;
    void _bottomSheetScrollable;
    return <TamaguiScrollView ref={ref} {...webProps} />;
  }

  const {
    automaticallyAdjustsScrollIndicatorInsets,
    bottomSheetScrollable = true,
    nestedScrollEnabled,
    scrollIndicatorInsets,
    ...restProps
  } = props as ScrollViewProps & {
    nestedScrollEnabled?: boolean;
  };
  void bottomSheetScrollable;
  const manuallyAdjustNormalPageIndicator =
    os() === "ios" && !insideTrueSheet && automaticallyAdjustsScrollIndicatorInsets == null;

  return (
    <ReactNativeScrollView
      ref={ref}
      automaticallyAdjustsScrollIndicatorInsets={
        manuallyAdjustNormalPageIndicator ? false : automaticallyAdjustsScrollIndicatorInsets
      }
      nestedScrollEnabled={nestedScrollEnabled ?? true}
      scrollIndicatorInsets={
        manuallyAdjustNormalPageIndicator
          ? {
              ...scrollIndicatorInsets,
              // 只取消普通页面重复的顶部自动 inset，底部继续避让实际安全区。
              bottom: scrollIndicatorInsets?.bottom ?? insets.bottom,
            }
          : scrollIndicatorInsets
      }
      {...(restProps as any)}
    />
  );
});
