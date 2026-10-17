import { getDefaultHeaderHeight } from "@react-navigation/elements";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type NavigationContainerRef,
  NavigationIndependentTree,
  type ParamListBase,
  createNavigationContainerRef,
} from "@react-navigation/native";
import type { ReactNode, Ref } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";

import { withNativeStackGestureOptions } from "../../../utils/navigation";
import { useResolvedeColorScheme } from "../../../utils/theme";

import { type StackNavigationOptions, createStackNavigator } from "./stack_js_stack";
import {
  type NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "./stack_native_stack";
import {
  type TrueSheetInnerStackScreenOptions,
  trueSheetUsesNativeStackNavigator,
} from "./stack_navigator";

const NativeStack = createNativeStackNavigator();
const JsStack = createStackNavigator();

export type TrueSheetStackNavigationRef<ParamList extends ParamListBase = ParamListBase> =
  NavigationContainerRef<ParamList>;

export function createTrueSheetStackNavigationRef<
  ParamList extends ParamListBase = ParamListBase,
>() {
  return createNavigationContainerRef<ParamList>();
}

type TrueSheetStackNavigationProps = {
  children: ReactNode;
  initialRouteName?: string;
  navigationRef?: TrueSheetStackNavigationRef;
  screenOptions?: TrueSheetInnerStackScreenOptions;
};

function TrueSheetStackNavigationInner({
  children,
  initialRouteName,
  navigationRef,
  screenOptions,
}: TrueSheetStackNavigationProps) {
  const ref = navigationRef as unknown as Ref<NavigationContainerRef<ParamListBase>>;
  const layout = useWindowDimensions();
  const resolvedColorScheme = useResolvedeColorScheme();
  const navigationTheme = resolvedColorScheme === "dark" ? DarkTheme : DefaultTheme;

  if (trueSheetUsesNativeStackNavigator) {
    const configuredScreenOptions = (screenOptions ?? {}) as NativeStackNavigationOptions;
    const configuredGestureDistance = configuredScreenOptions.gestureResponseDistance ?? {};
    // Keep the native header as a TrueSheet drag surface; full-screen back starts below it.
    const defaultHeaderHeight = getDefaultHeaderHeight(layout, true, 0);
    const configuredTop = configuredGestureDistance.top;
    const fullScreenGestureTop =
      configuredScreenOptions.headerShown === false
        ? configuredTop
        : Math.max(defaultHeaderHeight, configuredTop ?? 0);
    const nativeScreenOptions = withNativeStackGestureOptions({
      ...configuredScreenOptions,
      gestureResponseDistance: {
        ...configuredGestureDistance,
        ...(fullScreenGestureTop == null ? {} : { top: fullScreenGestureTop }),
      },
    });

    return (
      <NavigationIndependentTree>
        <NavigationContainer ref={ref} theme={navigationTheme}>
          <View style={styles.nativeStackRoot}>
            <NativeStack.Navigator
              initialRouteName={initialRouteName}
              screenOptions={nativeScreenOptions}
            >
              {children}
            </NativeStack.Navigator>
          </View>
        </NavigationContainer>
      </NavigationIndependentTree>
    );
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer ref={ref} theme={navigationTheme}>
        <View style={styles.stackRoot}>
          <JsStack.Navigator
            // Web 的 react-native-screens 在 disabled 分支不会转发 Screen 的
            // absoluteFill style，导致当前卡片高度为 0；原生 Android 仍需
            // 保持 false，避免 TrueSheet 内嵌 Stack 的 screens 容器干预布局。
            detachInactiveScreens={Platform.OS === "web" ? true : false}
            initialRouteName={initialRouteName}
            screenOptions={({ route }) => {
              const configuredScreenOptions = screenOptions as StackNavigationOptions;

              // Sheet 根页没有可返回的宿主页面。JS Stack 在场景切换期间可能保留
              // previous scene，从而错误地绘制默认返回按钮；显式占用根页左侧位置。
              // 屏幕级的 headerLeft 仍会覆盖此默认值。
              if (
                route.name === initialRouteName &&
                configuredScreenOptions?.headerLeft === undefined
              ) {
                return { ...configuredScreenOptions, headerLeft: () => null };
              }

              return configuredScreenOptions;
            }}
          >
            {children}
          </JsStack.Navigator>
        </View>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

/**
 * True Sheet 内独立 NavigationContainer + Stack（iOS 原生 / Android JS）。
 */
export function TrueSheetStackNavigation(props: TrueSheetStackNavigationProps) {
  return <TrueSheetStackNavigationInner {...props} />;
}

/** 与当前平台匹配的 Stack.Screen */
export const TrueSheetInnerStack = trueSheetUsesNativeStackNavigator ? NativeStack : JsStack;

const styles = StyleSheet.create({
  nativeStackRoot: {
    flex: Platform.OS === "ios" ? 1 : undefined,
    minHeight: Platform.OS === "ios" ? 0 : undefined,
  },
  stackRoot: {
    flex: 1,
    width: "100%",
    height: "100%",
    minHeight: 0,
  },
});
