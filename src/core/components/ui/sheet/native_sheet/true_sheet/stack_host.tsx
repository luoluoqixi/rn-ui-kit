import { TrueSheet } from "@lodev09/react-native-true-sheet";
import type { TrueSheetProps } from "@lodev09/react-native-true-sheet";
import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { BackHandler, Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import type { ButtonProps } from "../../../button";
import { isIos26Plus, os } from "../../../utils/platform";
import { withNativeBackButton } from "../../../utils/navigation";
import { ScreenOverlayPortalProvider } from "../../../utils/overlay";
import { useAppBackgroundColors } from "../../../utils/theme";

import { TrueSheetOverlayLayoutProvider } from "./overlay_layout_context";
import {
  getTrueSheetGestureRootStyle,
  getTrueSheetStackHostScrollableProps,
} from "./platform_sheet_defaults";
import { TrueSheetStackHostProvider } from "./stack_context";
import { TrueSheetStackHeaderCloseButton } from "./stack_header";
import {
  TrueSheetStackNavigation,
  type TrueSheetStackNavigationRef,
  createTrueSheetStackNavigationRef,
} from "./stack_navigation";
import {
  type TrueSheetInnerStackScreenOptions,
  trueSheetUsesNativeStackNavigator,
} from "./stack_navigator";
import { createTrueSheetOverlayPortalHostName } from "./overlay_host_name";
import { TrueSheetScrollLayoutProvider } from "./true_sheet_scroll_context";
import { useTrueSheetOverlayLayoutSync } from "./use_true_sheet_overlay_layout_sync";
import {
  TrueSheetScrollableBindingProvider,
  useTrueSheetScrollableBindingController,
} from "./scrollable_binding_context";

const platform = os();

export type TrueSheetStackHostProps<ParamList extends ParamListBase = ParamListBase> = {
  children: ReactNode;
  /** 当前 True Sheet Stack 宿主专属 overlay host；省略时按 `name` 自动生成。 */
  overlayPortalHostName?: string;
  /** 可选的 Stack Header 左侧内容；默认不注入。 */
  headerLeft?: TrueSheetInnerStackScreenOptions["headerLeft"];
  /** 内置 iOS 右侧关闭按钮的完整 Button 属性；`onPress` 执行后仍会请求关闭。 */
  headerRightButtonProps?: ButtonProps;
  /** 关闭 Sheet 时重置栈到该路由名 */
  initialRouteName?: keyof ParamList & string;
  name: string;
  navigationRef?: TrueSheetStackNavigationRef<ParamList>;
  onDidDismiss?: () => void;
  onDidPresent?: () => void;
  onRequestClose?: () => void;
  screenOptions?: TrueSheetInnerStackScreenOptions;
  /** 透传 TrueSheet 属性（不含 name / children / header） */
  sheetProps?: Omit<TrueSheetProps, "children" | "header" | "name">;
};

const defaultSheetProps: Pick<
  TrueSheetProps,
  | "androidHideFriction"
  | "androidSignificantVelocityThreshold"
  | "detents"
  | "dismissible"
  | "disableStackingTranslation"
  | "grabber"
  | "insetAdjustment"
> &
  Pick<TrueSheetProps, "scrollable" | "scrollableOptions"> = {
  androidHideFriction: 2,
  androidSignificantVelocityThreshold: 10,
  detents: [1],
  dismissible: true,
  disableStackingTranslation: platform === "android",
  grabber: false,
  insetAdjustment: "automatic" as const,
  ...getTrueSheetStackHostScrollableProps(),
};

/**
 * 具名 True Sheet + 内嵌原生 Stack（替代自绘 header + useState 切屏）。
 * 默认以 `name` 注册独立 overlay host，避免 portal / floating 继续落到外层 sheet 或 app root 坐标系。
 */
function TrueSheetStackHostInner<ParamList extends ParamListBase = ParamListBase>({
  children,
  initialRouteName = "index",
  name,
  navigationRef: navigationRefProp,
  onDidDismiss,
  onDidPresent,
  onRequestClose,
  overlayPortalHostName,
  headerLeft,
  headerRightButtonProps,
  screenOptions,
  sheetProps,
}: TrueSheetStackHostProps<ParamList>) {
  const appBackgroundColors = useAppBackgroundColors();
  const navigationRef = navigationRefProp ?? createTrueSheetStackNavigationRef<ParamList>();
  const overlayLayoutSync = useTrueSheetOverlayLayoutSync(sheetProps);
  const customSheetBackHandler = sheetProps?.onBackPress;
  const [presented, setPresented] = useState(false);
  const scrollableBinding = useTrueSheetScrollableBindingController();

  const handleRequestClose = useCallback(() => {
    onRequestClose?.();
  }, [onRequestClose]);

  const handleAndroidBackPress = useCallback(() => {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
      return true;
    }

    const customHandled = customSheetBackHandler?.();
    if (customHandled !== undefined) {
      return customHandled;
    }

    handleRequestClose();
    return true;
  }, [customSheetBackHandler, handleRequestClose, navigationRef]);

  useEffect(() => {
    if (platform !== "android" || !presented) {
      return;
    }

    // TrueSheet 自身的 Android BackHandler 会先调用原生 dismiss，再触发 onBackPress。
    // 这里在 onDidPresent 后注册，利用 RN 后注册先执行的顺序，先处理内嵌 Stack 返回。
    const subscription = BackHandler.addEventListener("hardwareBackPress", handleAndroidBackPress);

    return () => subscription.remove();
  }, [handleAndroidBackPress, presented]);

  const handleDidDismiss = useCallback<NonNullable<TrueSheetProps["onDidDismiss"]>>(
    (event) => {
      scrollableBinding.setPresented(false);
      setPresented(false);

      if (navigationRef.isReady()) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: initialRouteName as string }],
        });
      }

      onDidDismiss?.();
      overlayLayoutSync.onDidDismiss(event);
      sheetProps?.onDidDismiss?.(event);
    },
    [
      initialRouteName,
      navigationRef,
      onDidDismiss,
      overlayLayoutSync,
      scrollableBinding,
      sheetProps?.onDidDismiss,
    ],
  );

  const handleDidPresent = useCallback<NonNullable<TrueSheetProps["onDidPresent"]>>(
    (event) => {
      scrollableBinding.setPresented(true);
      setPresented(true);
      onDidPresent?.();
      overlayLayoutSync.onDidPresent(event);
      sheetProps?.onDidPresent?.(event);
    },
    [onDidPresent, overlayLayoutSync, scrollableBinding, sheetProps?.onDidPresent],
  );

  const handleDetentChange = useCallback<NonNullable<TrueSheetProps["onDetentChange"]>>(
    (event) => {
      overlayLayoutSync.onDetentChange(event);
      sheetProps?.onDetentChange?.(event);
    },
    [overlayLayoutSync, sheetProps?.onDetentChange],
  );
  const handleDragChange = useCallback<NonNullable<TrueSheetProps["onDragChange"]>>(
    (event) => {
      overlayLayoutSync.onDragChange(event);
      sheetProps?.onDragChange?.(event);
    },
    [overlayLayoutSync, sheetProps?.onDragChange],
  );
  const handleDragEnd = useCallback<NonNullable<TrueSheetProps["onDragEnd"]>>(
    (event) => {
      overlayLayoutSync.onDragEnd(event);
      sheetProps?.onDragEnd?.(event);
    },
    [overlayLayoutSync, sheetProps?.onDragEnd],
  );
  const handlePositionChange = useCallback<NonNullable<TrueSheetProps["onPositionChange"]>>(
    (event) => {
      overlayLayoutSync.onPositionChange(event);
      sheetProps?.onPositionChange?.(event);
    },
    [overlayLayoutSync, sheetProps?.onPositionChange],
  );
  const handleWillPresent = useCallback<NonNullable<TrueSheetProps["onWillPresent"]>>(
    (event) => {
      overlayLayoutSync.onWillPresent(event);
      sheetProps?.onWillPresent?.(event);
    },
    [overlayLayoutSync, sheetProps?.onWillPresent],
  );

  const mergedScreenOptions: TrueSheetInnerStackScreenOptions = {
    // iOS Native Stack 会从上一页的 title/headerTitle 推导返回文案。
    ...(trueSheetUsesNativeStackNavigator
      ? {}
      : {
          // Android TrueSheet 使用 JS Stack。用代码图标避免依赖
          // @react-navigation/elements 的 back-icon 多倍率 PNG 资源。
          headerBackImage: ({ tintColor }: { tintColor: string }) => (
            <ArrowLeft color={tintColor as any} size={24} />
          ),
          headerBackTitle: "返回",
        }),
    ...(headerLeft === undefined ? {} : { headerLeft }),
    headerRight:
      platform === "ios"
        ? () => <TrueSheetStackHeaderCloseButton {...headerRightButtonProps} />
        : undefined,
    headerShown: true,
    ...screenOptions,
  };

  const nativeScreenOptions = mergedScreenOptions as NativeStackNavigationOptions;
  const resolvedScreenOptions: TrueSheetInnerStackScreenOptions = trueSheetUsesNativeStackNavigator
    ? withNativeBackButton(nativeScreenOptions)
    : mergedScreenOptions;

  const insetAdjustment = sheetProps?.insetAdjustment ?? defaultSheetProps.insetAdjustment;
  // iOS26 以上有透明背景, 默认不用自定义颜色覆盖它
  const resolvedBackgroundColor =
    sheetProps?.backgroundColor ?? (isIos26Plus() ? undefined : appBackgroundColors.sheet);
  const backgroundStyle =
    resolvedBackgroundColor != null ? { backgroundColor: resolvedBackgroundColor } : null;
  const resolvedOverlayPortalHostName = createTrueSheetOverlayPortalHostName(
    overlayPortalHostName ?? `${name}-overlay`,
  );
  const resolvedSheetProps = {
    ...sheetProps,
    backgroundColor: resolvedBackgroundColor,
    style: [
      sheetProps?.style,
      backgroundStyle,
      // React Navigation's web stack has no intrinsic height. TrueSheet Web
      // renders its scrollable content inside a flex container, so the stack
      // content must fill that container explicitly or the sheet appears blank.
      Platform.OS === "web" && styles.webStackContent,
    ],
  };

  const stackNavigation = (
    <TrueSheetStackHostProvider onRequestClose={handleRequestClose}>
      <TrueSheetStackNavigation
        initialRouteName={initialRouteName as string}
        navigationRef={navigationRef}
        screenOptions={resolvedScreenOptions}
      >
        {children}
      </TrueSheetStackNavigation>
    </TrueSheetStackHostProvider>
  );

  const sheetBody = (
    <TrueSheetScrollableBindingProvider value={scrollableBinding.providerValue}>
      <TrueSheetScrollLayoutProvider
        automaticContentInsetAdjustment={Platform.OS === "ios"}
        insetAdjustment={insetAdjustment}
        nativeScrollInsetsApplied={false}
        presentationActive={presented}
      >
        <GestureHandlerRootView style={[styles.gestureRoot, backgroundStyle]}>
          <ScreenOverlayPortalProvider hostName={resolvedOverlayPortalHostName}>
            {stackNavigation}
          </ScreenOverlayPortalProvider>
        </GestureHandlerRootView>
      </TrueSheetScrollLayoutProvider>
    </TrueSheetScrollableBindingProvider>
  );

  return (
    <TrueSheet
      ref={scrollableBinding.setSheetRef}
      name={name}
      {...defaultSheetProps}
      {...resolvedSheetProps}
      onBackPress={customSheetBackHandler}
      onDetentChange={handleDetentChange}
      onDidDismiss={handleDidDismiss}
      onDidPresent={handleDidPresent}
      onDragChange={handleDragChange}
      onDragEnd={handleDragEnd}
      onPositionChange={handlePositionChange}
      onWillPresent={handleWillPresent}
    >
      {sheetBody}
    </TrueSheet>
  );
}

export function TrueSheetStackHost<ParamList extends ParamListBase = ParamListBase>(
  props: TrueSheetStackHostProps<ParamList>,
) {
  return (
    <TrueSheetOverlayLayoutProvider>
      <TrueSheetStackHostInner {...props} />
    </TrueSheetOverlayLayoutProvider>
  );
}

const styles = StyleSheet.create({
  gestureRoot: getTrueSheetGestureRootStyle(),
  webStackContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    minHeight: 0,
  },
});
