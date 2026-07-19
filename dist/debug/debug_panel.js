import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DarkTheme, DefaultTheme, NavigationContainer, useIsFocused, useNavigation, } from "@react-navigation/native";
import { createNativeStackNavigator, } from "@react-navigation/native-stack";
import { useState } from "react";
import { Platform, View } from "react-native";
import { YStack, useTheme } from "tamagui";
import { NativeSheet, NativeSheetStack, isIos26Plus, nativeStackStatusBarOptions, useAppBackgroundColors, useColorSchemeSettings, withNativeBackButton, withNativeStackGestureOptions, RN_UI_KIT_PACKAGE_NAME, RN_UI_KIT_PACKAGE_VERSION, } from "rn-ui-kit/core";
import { RnUiKitDebugHomePage } from "./pages/debug_home_page";
import { RnUiKitDebugSectionPage } from "./pages/debug_section_page";
import { getComponentExampleRouteName, RnUiKitComponentExampleDetailPage, RnUiKitComponentExamplesDebugPage, } from "./pages/component_examples/component_examples_page";
import { componentExampleDefinitions } from "./pages/component_examples/catalog";
import { rnUiKitDebugRouteDefinitions } from "./routes";
import { blurActiveElementOnWeb } from "./web_focus";
const Stack = createNativeStackNavigator();
const DEBUG_PANEL_SHEET_OVERLAY_HOST = "rn-ui-kit-debug-panel-sheet-overlay";
const DEBUG_SECTION_SHEET_OVERLAY_HOST = "rn-ui-kit-debug-section-sheet-overlay";
const DEBUG_SECTION_SHEET_SNAP_POINTS = [50, 75, 100];
function useDebugStackScreenOptions() {
    const appBackgroundColors = useAppBackgroundColors();
    const { resolvedColorScheme } = useColorSchemeSettings();
    const theme = useTheme();
    const transparentHeader = isIos26Plus();
    const nativeScrollEdgeHeader = Platform.OS === "ios" && !transparentHeader;
    return withNativeStackGestureOptions({
        ...nativeStackStatusBarOptions(resolvedColorScheme),
        contentStyle: { backgroundColor: appBackgroundColors.screen },
        ...(nativeScrollEdgeHeader
            ? {
                // iOS 15–25 会在普通小标题导航栏上原生切换
                // scrollEdgeAppearance 与带系统材质的 standardAppearance。
                headerBlurEffect: "systemThinMaterial",
                headerLargeStyle: { backgroundColor: "transparent" },
                headerShadowVisible: true,
            }
            : { headerShadowVisible: false }),
        headerStyle: {
            backgroundColor: transparentHeader || nativeScrollEdgeHeader ? "transparent" : appBackgroundColors.header,
        },
        // iOS 15–25 需要让原生导航栏保持 translucent，UIKit 才会让滚动内容
        // 延伸到 bar 下方并在 scrollEdgeAppearance / standardAppearance 间切换。
        // standardAppearance 仍使用上面的实体 header 色，并非始终透明。
        headerTransparent: transparentHeader || nativeScrollEdgeHeader,
        headerTintColor: theme.color10.val,
        headerTitleStyle: { color: theme.gray12.val },
    });
}
function useDebugSheetStackScreenOptions() {
    const appBackgroundColors = useAppBackgroundColors();
    const theme = useTheme();
    const transparentHeader = isIos26Plus();
    const nativeScrollEdgeHeader = Platform.OS === "ios" && !transparentHeader;
    return {
        contentStyle: {
            backgroundColor: transparentHeader ? "transparent" : appBackgroundColors.sheet,
        },
        headerRight: undefined,
        ...(nativeScrollEdgeHeader
            ? {
                // TrueSheet 内同样使用 iOS Native Stack。scrollEdgeAppearance 保持透明，
                // standardAppearance 使用系统半透明材质，并由当前页面的原生 ScrollView 驱动切换。
                headerBlurEffect: "systemThinMaterial",
                headerLargeStyle: { backgroundColor: "transparent" },
                headerShadowVisible: true,
            }
            : { headerShadowVisible: false }),
        headerStatusBarHeight: 0,
        headerStyle: {
            backgroundColor: transparentHeader || nativeScrollEdgeHeader ? "transparent" : appBackgroundColors.header,
            height: 56,
        },
        // iOS 15–25 必须保持 translucent，内容才能延伸到导航栏下方并触发
        // scrollEdgeAppearance / standardAppearance 原生切换。
        headerTransparent: transparentHeader || nativeScrollEdgeHeader,
        headerTintColor: theme.color10.val,
        headerTitleStyle: { color: theme.gray12.val },
    };
}
function FocusedNativeSheetDebugSectionPage(props) {
    const isFocused = useIsFocused();
    return _jsx(RnUiKitDebugSectionPage, { ...props, bindToNativeSheet: isFocused });
}
export function RnUiKitDebugPanel({ defaultOpen = true, initialRouteKey = "components", onOpenChange, open: openProp, pages: pagesProp, sheetMode = false, ...props }) {
    const pages = Array.from(new Map([...rnUiKitDebugRouteDefinitions, ...(pagesProp ?? [])].map((page) => [page.key, page])).values());
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;
    const handleOpenChange = (nextOpen) => {
        if (openProp == null)
            setUncontrolledOpen(nextOpen);
        onOpenChange?.(nextOpen);
    };
    if (sheetMode) {
        return (_jsx(RnUiKitDebugPanelSheet, { initialRouteKey: initialRouteKey, onOpenChange: handleOpenChange, open: open, pages: pages, ...props }));
    }
    return _jsx(RnUiKitDebugPanelContent, { initialRouteKey: initialRouteKey, pages: pages, ...props });
}
function RnUiKitDebugPanelSheet({ onOpenChange, open, pages, ...props }) {
    const debugSheetStackScreenOptions = useDebugSheetStackScreenOptions();
    const headerTransparent = debugSheetStackScreenOptions.headerTransparent === true;
    const [openSectionsInSheet, setOpenSectionsInSheet] = useState(false);
    const [sectionSheetPosition, setSectionSheetPosition] = useState(0);
    const [openSectionSheets, setOpenSectionSheets] = useState(new Set());
    const handlePanelOpenChange = (nextOpen) => {
        if (!nextOpen)
            setOpenSectionSheets(new Set());
        onOpenChange(nextOpen);
    };
    function HomeRoute() {
        return (_jsx(RnUiKitDebugHomeRoute, { layoutHost: "nativeSheet", onOpenInSheet: (key) => setOpenSectionSheets((current) => new Set(current).add(key)), pages: pages, onOpenSectionsInSheetChange: (enabled) => {
                setOpenSectionsInSheet(enabled);
                if (!enabled)
                    setOpenSectionSheets(new Set());
            }, onSectionSheetPositionChange: setSectionSheetPosition, openSectionsInSheet: openSectionsInSheet, sectionSheetPosition: sectionSheetPosition }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs(NativeSheetStack, { initialRouteName: "index", name: "rn-ui-kit-debug-panel-sheet", onOpenChange: handlePanelOpenChange, open: open, overlayPortalHostName: DEBUG_PANEL_SHEET_OVERLAY_HOST, screenOptions: debugSheetStackScreenOptions, sheetProps: { snapPoints: [88], snapPointsMode: "percent" }, children: [_jsx(NativeSheetStack.Screen, { name: "index", options: { title: `${RN_UI_KIT_PACKAGE_NAME} - ${RN_UI_KIT_PACKAGE_VERSION}` }, children: () => _jsx(HomeRoute, {}) }), pages.map((definition) => (_jsx(NativeSheetStack.Screen, { name: definition.key, options: { title: definition.label }, children: () => (_jsx(FocusedNativeSheetDebugSectionPage, { contentTitle: definition.contentTitle, instanceId: `panel-sheet-stack-${definition.key}`, layoutHost: "nativeSheet", pages: pages, sectionKey: definition.key })) }, definition.key))), componentExampleDefinitions.map((definition) => (_jsx(NativeSheetStack.Screen, { name: getComponentExampleRouteName(definition.key), options: {
                            title: definition.label,
                            ...(definition.fullScreenBackGestureEnabled === false
                                ? { fullScreenGestureEnabled: false }
                                : {}),
                        }, children: () => (_jsx(RnUiKitComponentExampleDetailPage, { definition: definition, headerTransparent: headerTransparent, layoutHost: "nativeSheet" })) }, getComponentExampleRouteName(definition.key))))] }), _jsx(RnUiKitDebugSectionSheets, { pages: pages, instancePrefix: "panel-sheet-section", onOpenChange: setOpenSectionSheets, openKeys: openSectionSheets, position: sectionSheetPosition })] }));
}
function RnUiKitDebugPanelContent({ initialRouteKey = "components", pages, ...props }) {
    const debugStackScreenOptions = useDebugStackScreenOptions();
    const headerTransparent = debugStackScreenOptions.headerTransparent === true;
    const { resolvedColorScheme } = useColorSchemeSettings();
    const navigationTheme = resolvedColorScheme === "dark" ? DarkTheme : DefaultTheme;
    const [openSectionsInSheet, setOpenSectionsInSheet] = useState(false);
    const [panelSheetOpen, setPanelSheetOpen] = useState(false);
    const [sectionSheetPosition, setSectionSheetPosition] = useState(0);
    const [openSectionSheets, setOpenSectionSheets] = useState(new Set());
    return (_jsxs(YStack, { background: "$background", flex: 1, ...props, children: [_jsx(NavigationContainer, { theme: navigationTheme, children: _jsxs(Stack.Navigator, { id: "rn-ui-kit-debug-stack", initialRouteName: "index", screenOptions: ({ navigation }) => withNativeBackButton(debugStackScreenOptions, {
                        label: "返回",
                        onPress: () => {
                            blurActiveElementOnWeb();
                            navigation.goBack();
                        },
                    }), children: [_jsx(Stack.Screen, { name: "index", options: { title: `${RN_UI_KIT_PACKAGE_NAME} - ${RN_UI_KIT_PACKAGE_VERSION}` }, children: () => (_jsx(RnUiKitDebugHomeRoute, { onOpenInSheet: (key) => setOpenSectionSheets((current) => new Set(current).add(key)), onOpenPanelSheet: () => setPanelSheetOpen(true), pages: pages, onOpenSectionsInSheetChange: (enabled) => {
                                    setOpenSectionsInSheet(enabled);
                                    if (!enabled)
                                        setOpenSectionSheets(new Set());
                                }, onSectionSheetPositionChange: setSectionSheetPosition, openSectionsInSheet: openSectionsInSheet, sectionSheetPosition: sectionSheetPosition })) }), pages.map((definition) => (_jsx(Stack.Screen, { name: definition.key, options: { title: definition.label }, children: () => (_jsx(RnUiKitDebugSectionPage, { contentTitle: definition.contentTitle, headerTransparent: headerTransparent, instanceId: `stack-${definition.key}`, pages: pages, sectionKey: definition.key })) }, definition.key))), componentExampleDefinitions.map((definition) => (_jsx(Stack.Screen, { name: getComponentExampleRouteName(definition.key), options: {
                                title: definition.label,
                                ...(definition.fullScreenBackGestureEnabled === false
                                    ? { fullScreenGestureEnabled: false }
                                    : {}),
                            }, children: () => (_jsx(RnUiKitComponentExampleDetailPage, { definition: definition, headerTransparent: headerTransparent })) }, getComponentExampleRouteName(definition.key))))] }) }), _jsx(RnUiKitDebugSectionSheets, { pages: pages, instancePrefix: "sheet", onOpenChange: setOpenSectionSheets, openKeys: openSectionSheets, position: sectionSheetPosition }), _jsx(RnUiKitDebugPanel, { onOpenChange: setPanelSheetOpen, open: panelSheetOpen, pages: pages, sheetMode: true })] }));
}
function RnUiKitDebugHomeRoute({ layoutHost = "default", onOpenInSheet, pages, onOpenPanelSheet, onOpenSectionsInSheetChange, onSectionSheetPositionChange, openSectionsInSheet, sectionSheetPosition, }) {
    const navigation = useNavigation();
    return (_jsx(RnUiKitDebugHomePage, { layoutHost: layoutHost, onOpenSection: (key) => {
            if (openSectionsInSheet)
                return onOpenInSheet(key);
            blurActiveElementOnWeb();
            navigation.navigate(key);
        }, onOpenPanelSheet: onOpenPanelSheet, onOpenSectionsInSheetChange: onOpenSectionsInSheetChange, onSectionSheetPositionChange: onSectionSheetPositionChange, openSectionsInSheet: openSectionsInSheet, pages: pages, sectionSheetPosition: sectionSheetPosition }));
}
function RnUiKitDebugSectionSheets({ instancePrefix, pages, onOpenChange, openKeys, position, }) {
    const debugSheetStackScreenOptions = useDebugSheetStackScreenOptions();
    const headerTransparent = debugSheetStackScreenOptions.headerTransparent === true;
    const closeSheet = (key, nextOpen) => {
        if (!nextOpen) {
            const next = new Set(openKeys);
            next.delete(key);
            onOpenChange(next);
        }
    };
    return pages.map((definition) => {
        const name = `rn-ui-kit-debug-${instancePrefix}-${definition.key}`;
        const overlayPortalHostName = `${DEBUG_SECTION_SHEET_OVERLAY_HOST}:${instancePrefix}:${definition.key}`;
        // The examples list needs actual stack history even when a section is opened directly in a sheet.
        if (definition.key === "component-examples") {
            return (_jsxs(NativeSheetStack, { initialRouteName: "index", name: name, onOpenChange: (nextOpen) => closeSheet(definition.key, nextOpen), open: openKeys.has(definition.key), overlayPortalHostName: overlayPortalHostName, screenOptions: debugSheetStackScreenOptions, sheetProps: {
                    initialDetentIndex: position,
                    snapPoints: DEBUG_SECTION_SHEET_SNAP_POINTS,
                    snapPointsMode: "percent",
                }, children: [_jsx(NativeSheetStack.Screen, { name: "index", options: { title: definition.label }, children: () => _jsx(RnUiKitComponentExamplesDebugPage, { layoutHost: "nativeSheet" }) }), componentExampleDefinitions.map((example) => (_jsx(NativeSheetStack.Screen, { name: getComponentExampleRouteName(example.key), options: {
                            title: example.label,
                            ...(example.fullScreenBackGestureEnabled === false
                                ? { fullScreenGestureEnabled: false }
                                : {}),
                        }, children: () => (_jsx(RnUiKitComponentExampleDetailPage, { definition: example, headerTransparent: headerTransparent, layoutHost: "nativeSheet" })) }, getComponentExampleRouteName(example.key))))] }, definition.key));
        }
        return (_jsx(NativeSheet, { handle: true, name: name, onOpenChange: (nextOpen) => closeSheet(definition.key, nextOpen), open: openKeys.has(definition.key), overlayPortalHostName: overlayPortalHostName, position: position, snapPoints: DEBUG_SECTION_SHEET_SNAP_POINTS, snapPointsMode: "percent", children: _jsx(View, { style: { flex: 1 }, children: _jsx(RnUiKitDebugSectionPage, { bindToNativeSheet: openKeys.has(definition.key), contentTitle: definition.contentTitle, instanceId: `${instancePrefix}-${definition.key}`, layoutHost: Platform.OS === "ios" || Platform.OS === "android" ? "nativeSheet" : "default", pages: pages, sectionKey: definition.key }) }) }, definition.key));
    });
}
