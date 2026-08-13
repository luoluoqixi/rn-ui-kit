import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DarkTheme, DefaultTheme, NavigationContainer, StackActions, useIsFocused, useNavigation, useRoute, } from "@react-navigation/native";
import { createNativeStackNavigator, } from "@react-navigation/native-stack";
import { useLayoutEffect, useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { YStack, useTheme } from "tamagui";
import { NativeSheet, NativeSheetStack, getNativeStackScrollEdgeHeaderOptions, isIos26Plus, nativeStackStatusBarOptions, useAppBackgroundColors, useColorSchemeSettings, withNativeBackButton, withNativeStackGestureOptions, RN_UI_KIT_PACKAGE_NAME, RN_UI_KIT_PACKAGE_VERSION, } from "rn-ui-kit/core";
import { RnUiKitDebugHomePage } from "./pages/debug_home_page";
import { RnUiKitDebugSectionPage } from "./pages/debug_section_page";
import { getComponentExampleRouteName, getRnUiKitComponentExampleTitle, RnUiKitComponentExampleDebugPage, RnUiKitComponentExampleDetailPage, RnUiKitComponentExamplesDebugPage, } from "./pages/component_examples/component_examples_page";
import { componentExampleDefinitions } from "./pages/component_examples/catalog";
import { getRnUiKitDebugRouteDefinition, rnUiKitDebugRouteDefinitions } from "./routes";
import { blurActiveElementOnWeb } from "./web_focus";
const Stack = createNativeStackNavigator();
const DEBUG_PANEL_SHEET_OVERLAY_HOST = "rn-ui-kit-debug-panel-sheet-overlay";
const DEBUG_SECTION_SHEET_OVERLAY_HOST = "rn-ui-kit-debug-section-sheet-overlay";
const DEBUG_HOST_SECTION_PARAM = "__rnUiKitDebugSection";
const DEBUG_HOST_EXAMPLE_PARAM = "__rnUiKitDebugExample";
const DEBUG_HOME_LARGE_TITLE_OPTIONS = Platform.OS === "ios"
    ? {
        headerLargeTitle: true,
        headerLargeTitleEnabled: true,
        headerLargeTitleShadowVisible: false,
    }
    : {};
// ios26 中如果 Sheet 太高, 背景颜色会发生变化
// 默认的背景颜色会变的和 NativeList 一样
// 所以这里 ios26 示例默认限制最大高度
const DEBUG_SECTION_SHEET_SNAP_POINTS = isIos26Plus() ? [50, 75, 85] : [50, 75, 100];
const DEBUG_DEFAULT_SNAP_POINT = ["85%"];
const onRefreshHome = () => new Promise((r) => setTimeout(r, 1000));
function getDebugPages(pages) {
    return Array.from(new Map([...rnUiKitDebugRouteDefinitions, ...(pages ?? [])].map((page) => [page.key, page])).values());
}
function useDebugStackScreenOptions(overrides) {
    const appBackgroundColors = useAppBackgroundColors();
    const { resolvedColorScheme } = useColorSchemeSettings();
    const theme = useTheme();
    return useMemo(() => withNativeStackGestureOptions({
        ...nativeStackStatusBarOptions(resolvedColorScheme),
        contentStyle: { backgroundColor: appBackgroundColors.screen },
        ...getNativeStackScrollEdgeHeaderOptions({
            headerBackgroundColor: appBackgroundColors.header,
            screenBackgroundColor: appBackgroundColors.screen,
        }),
        headerTintColor: theme.color10.val,
        headerTitleStyle: { color: theme.gray12.val },
        ...overrides,
    }), [
        appBackgroundColors.header,
        appBackgroundColors.screen,
        resolvedColorScheme,
        theme.color10.val,
        theme.gray12.val,
        overrides,
    ]);
}
function useDebugSheetStackScreenOptions(overrides) {
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
            backgroundColor: transparentHeader || nativeScrollEdgeHeader
                ? "transparent"
                : Platform.OS === "android"
                    ? appBackgroundColors.sheet
                    : appBackgroundColors.header,
            height: 56,
        },
        // Android TrueSheet 使用 JS Stack；保留箭头即可，避免默认的“返回”文案占用标题空间。
        headerBackButtonDisplayMode: Platform.OS === "android" || transparentHeader ? "minimal" : "default",
        // iOS 15–25 必须保持 translucent，内容才能延伸到导航栏下方并触发
        // scrollEdgeAppearance / standardAppearance 原生切换。
        headerTransparent: transparentHeader || nativeScrollEdgeHeader,
        headerTintColor: theme.color10.val,
        headerTitleStyle: { color: theme.gray12.val },
        ...overrides,
    };
}
function FocusedNativeSheetDebugSectionPage(props) {
    const isFocused = useIsFocused();
    return _jsx(RnUiKitDebugSectionPage, { ...props, bindToNativeSheet: isFocused });
}
export function RnUiKitDebugPanel({ backButtonLabel, defaultOpen = true, initialRouteKey = "components", navigationMode = "independent", nativeSheetScreenOptions, onOpenChange, open: openProp, pageScreenOptions, pages: pagesProp, panelSheetProps, sheetMode = false, ...props }) {
    const pages = getDebugPages(pagesProp);
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;
    const handleOpenChange = (nextOpen) => {
        if (openProp == null)
            setUncontrolledOpen(nextOpen);
        onOpenChange?.(nextOpen);
    };
    if (sheetMode) {
        return (_jsx(RnUiKitDebugPanelSheet, { initialRouteKey: initialRouteKey, onOpenChange: handleOpenChange, open: open, pages: pages, nativeSheetScreenOptions: nativeSheetScreenOptions, panelSheetProps: panelSheetProps, ...props }));
    }
    if (navigationMode === "host") {
        return (_jsx(RnUiKitDebugHostPanel, { backButtonLabel: backButtonLabel, nativeSheetScreenOptions: nativeSheetScreenOptions, pageScreenOptions: pageScreenOptions, pages: pages, panelSheetProps: panelSheetProps, ...props }));
    }
    return (_jsx(RnUiKitDebugPanelContent, { initialRouteKey: initialRouteKey, nativeSheetScreenOptions: nativeSheetScreenOptions, pageScreenOptions: pageScreenOptions, pages: pages, panelSheetProps: panelSheetProps, ...props }));
}
function RnUiKitDebugHostPanel({ backButtonLabel, nativeSheetScreenOptions, pageScreenOptions, pages, panelSheetProps, ...props }) {
    const navigation = useNavigation();
    const route = useRoute();
    const debugStackScreenOptions = useDebugStackScreenOptions(pageScreenOptions);
    const headerTransparent = debugStackScreenOptions.headerTransparent === true;
    const routeParams = (route.params ?? {});
    const sectionKey = typeof routeParams[DEBUG_HOST_SECTION_PARAM] === "string"
        ? routeParams[DEBUG_HOST_SECTION_PARAM]
        : undefined;
    const exampleKey = typeof routeParams[DEBUG_HOST_EXAMPLE_PARAM] === "string"
        ? routeParams[DEBUG_HOST_EXAMPLE_PARAM]
        : undefined;
    const isRootRoute = sectionKey == null && exampleKey == null;
    const showsExplicitRootBackLabel = isRootRoute && backButtonLabel != null && backButtonLabel.trim().length > 0;
    const title = exampleKey != null
        ? getRnUiKitComponentExampleTitle(exampleKey)
        : sectionKey != null
            ? getRnUiKitDebugRouteDefinition(sectionKey, pages).label
            : `${RN_UI_KIT_PACKAGE_NAME} - ${RN_UI_KIT_PACKAGE_VERSION}`;
    useLayoutEffect(() => {
        navigation.setOptions(withNativeBackButton({
            ...debugStackScreenOptions,
            headerBackButtonDisplayMode: isIos26Plus() && !showsExplicitRootBackLabel ? "minimal" : "default",
            headerBackButtonMenuEnabled: true,
            // 普通页面必须保持 undefined，让 UIKit 使用上一层真实 title 构建历史菜单。
            headerBackTitle: showsExplicitRootBackLabel ? backButtonLabel : undefined,
            headerShown: true,
            title,
            ...(isRootRoute ? DEBUG_HOME_LARGE_TITLE_OPTIONS : {}),
            ...pageScreenOptions,
        }));
    }, [
        backButtonLabel,
        debugStackScreenOptions,
        navigation,
        pageScreenOptions,
        showsExplicitRootBackLabel,
        title,
    ]);
    const pushDebugRoute = ({ example, section, }) => {
        const nextParams = { ...routeParams };
        delete nextParams[DEBUG_HOST_SECTION_PARAM];
        delete nextParams[DEBUG_HOST_EXAMPLE_PARAM];
        if (section != null)
            nextParams[DEBUG_HOST_SECTION_PARAM] = section;
        if (example != null)
            nextParams[DEBUG_HOST_EXAMPLE_PARAM] = example;
        blurActiveElementOnWeb();
        navigation.dispatch(StackActions.push(route.name, nextParams));
    };
    let content;
    if (exampleKey != null) {
        content = (_jsx(RnUiKitComponentExampleDebugPage, { exampleKey: exampleKey, headerTransparent: headerTransparent }));
    }
    else if (sectionKey != null) {
        content = (_jsx(RnUiKitDebugSectionPage, { headerTransparent: headerTransparent, instanceId: `host-${sectionKey}`, onOpenComponentExample: (key) => pushDebugRoute({ example: key }), pages: pages, sectionKey: sectionKey }));
    }
    else {
        content = (_jsx(RnUiKitDebugHostHomePage, { nativeSheetScreenOptions: nativeSheetScreenOptions, onOpenSection: (key) => pushDebugRoute({ section: key }), pages: pages, panelSheetProps: panelSheetProps }));
    }
    return (_jsx(YStack, { background: "$background", flex: 1, ...props, children: content }));
}
function RnUiKitDebugHostHomePage({ nativeSheetScreenOptions, onOpenSection, pages: pagesProp, panelSheetProps, ...props }) {
    const pages = getDebugPages(pagesProp);
    const [openSectionsInSheet, setOpenSectionsInSheet] = useState(false);
    const [panelSheetOpen, setPanelSheetOpen] = useState(false);
    const [sectionSheetPosition, setSectionSheetPosition] = useState(0);
    const [openSectionSheets, setOpenSectionSheets] = useState(new Set());
    return (_jsxs(YStack, { background: "$background", flex: 1, ...props, children: [_jsx(RnUiKitDebugHomePage, { onRefresh: onRefreshHome, onOpenPanelSheet: () => setPanelSheetOpen(true), onOpenSection: (key) => {
                    if (openSectionsInSheet) {
                        setOpenSectionSheets((current) => new Set(current).add(key));
                        return;
                    }
                    blurActiveElementOnWeb();
                    onOpenSection(key);
                }, pages: pages, onOpenSectionsInSheetChange: (enabled) => {
                    setOpenSectionsInSheet(enabled);
                    if (!enabled)
                        setOpenSectionSheets(new Set());
                }, onSectionSheetPositionChange: setSectionSheetPosition, openSectionsInSheet: openSectionsInSheet, sectionSheetPosition: sectionSheetPosition }), _jsx(RnUiKitDebugSectionSheets, { pages: pages, instancePrefix: "host", onOpenChange: setOpenSectionSheets, openKeys: openSectionSheets, position: sectionSheetPosition }), _jsx(RnUiKitDebugPanel, { onOpenChange: setPanelSheetOpen, open: panelSheetOpen, pages: pages, nativeSheetScreenOptions: nativeSheetScreenOptions, panelSheetProps: panelSheetProps, sheetMode: true })] }));
}
function RnUiKitDebugPanelSheet({ nativeSheetScreenOptions, onOpenChange, open, pages, panelSheetProps, ...props }) {
    const debugSheetStackScreenOptions = useDebugSheetStackScreenOptions(nativeSheetScreenOptions);
    const headerTransparent = debugSheetStackScreenOptions.headerTransparent === true;
    const [openSectionsInSheet, setOpenSectionsInSheet] = useState(false);
    const [sectionSheetPosition, setSectionSheetPosition] = useState(0);
    const [openSectionSheets, setOpenSectionSheets] = useState(new Set());
    const handlePanelOpenChange = (nextOpen) => {
        if (!nextOpen)
            setOpenSectionSheets(new Set());
        onOpenChange(nextOpen);
    };
    return (_jsxs(_Fragment, { children: [_jsxs(NativeSheetStack, { initialRouteName: "index", name: "rn-ui-kit-debug-panel-sheet", onOpenChange: handlePanelOpenChange, open: open, overlayPortalHostName: DEBUG_PANEL_SHEET_OVERLAY_HOST, screenOptions: debugSheetStackScreenOptions, sheetProps: {
                    snapPoints: DEBUG_DEFAULT_SNAP_POINT,
                    snapPointsMode: "percent",
                    ...panelSheetProps,
                }, children: [_jsx(NativeSheetStack.Screen, { name: "index", options: { title: `${RN_UI_KIT_PACKAGE_NAME} - ${RN_UI_KIT_PACKAGE_VERSION}` }, children: () => (_jsx(RnUiKitDebugHomeRoute, { layoutHost: "nativeSheet", onOpenInSheet: (key) => setOpenSectionSheets((current) => new Set(current).add(key)), pages: pages, onOpenSectionsInSheetChange: (enabled) => {
                                setOpenSectionsInSheet(enabled);
                                if (!enabled)
                                    setOpenSectionSheets(new Set());
                            }, onSectionSheetPositionChange: setSectionSheetPosition, openSectionsInSheet: openSectionsInSheet, sectionSheetPosition: sectionSheetPosition })) }), pages.map((definition) => (_jsx(NativeSheetStack.Screen, { name: definition.key, options: { title: definition.label }, children: () => (_jsx(FocusedNativeSheetDebugSectionPage, { contentTitle: definition.contentTitle, instanceId: `panel-sheet-stack-${definition.key}`, layoutHost: "nativeSheet", pages: pages, sectionKey: definition.key })) }, definition.key))), componentExampleDefinitions.map((definition) => (_jsx(NativeSheetStack.Screen, { name: getComponentExampleRouteName(definition.key), options: {
                            title: definition.label,
                            ...(definition.fullScreenBackGestureEnabled === false
                                ? { fullScreenGestureEnabled: false }
                                : {}),
                        }, children: () => (_jsx(RnUiKitComponentExampleDetailPage, { definition: definition, headerTransparent: headerTransparent, layoutHost: "nativeSheet" })) }, getComponentExampleRouteName(definition.key))))] }), _jsx(RnUiKitDebugSectionSheets, { pages: pages, instancePrefix: "panel-sheet-section", onOpenChange: setOpenSectionSheets, openKeys: openSectionSheets, position: sectionSheetPosition })] }));
}
function RnUiKitDebugPanelContent({ initialRouteKey = "components", nativeSheetScreenOptions, pageScreenOptions, pages, panelSheetProps, ...props }) {
    const debugStackScreenOptions = useDebugStackScreenOptions(pageScreenOptions);
    const headerTransparent = debugStackScreenOptions.headerTransparent === true;
    const { resolvedColorScheme } = useColorSchemeSettings();
    const navigationTheme = resolvedColorScheme === "dark" ? DarkTheme : DefaultTheme;
    const [openSectionsInSheet, setOpenSectionsInSheet] = useState(false);
    const [panelSheetOpen, setPanelSheetOpen] = useState(false);
    const [sectionSheetPosition, setSectionSheetPosition] = useState(0);
    const [openSectionSheets, setOpenSectionSheets] = useState(new Set());
    return (_jsxs(YStack, { background: "$background", flex: 1, ...props, children: [_jsx(NavigationContainer, { theme: navigationTheme, children: _jsxs(Stack.Navigator, { id: "rn-ui-kit-debug-stack", initialRouteName: "index", screenOptions: withNativeBackButton(debugStackScreenOptions), children: [_jsx(Stack.Screen, { name: "index", options: {
                                title: `${RN_UI_KIT_PACKAGE_NAME} - ${RN_UI_KIT_PACKAGE_VERSION}`,
                                ...DEBUG_HOME_LARGE_TITLE_OPTIONS,
                            }, children: () => (_jsx(RnUiKitDebugHomeRoute, { onRefresh: onRefreshHome, onOpenInSheet: (key) => setOpenSectionSheets((current) => new Set(current).add(key)), onOpenPanelSheet: () => setPanelSheetOpen(true), pages: pages, onOpenSectionsInSheetChange: (enabled) => {
                                    setOpenSectionsInSheet(enabled);
                                    if (!enabled)
                                        setOpenSectionSheets(new Set());
                                }, onSectionSheetPositionChange: setSectionSheetPosition, openSectionsInSheet: openSectionsInSheet, sectionSheetPosition: sectionSheetPosition })) }), pages.map((definition) => (_jsx(Stack.Screen, { name: definition.key, options: { title: definition.label }, children: () => (_jsx(RnUiKitDebugSectionPage, { contentTitle: definition.contentTitle, headerTransparent: headerTransparent, instanceId: `stack-${definition.key}`, pages: pages, sectionKey: definition.key })) }, definition.key))), componentExampleDefinitions.map((definition) => (_jsx(Stack.Screen, { name: getComponentExampleRouteName(definition.key), options: {
                                title: definition.label,
                                ...(definition.fullScreenBackGestureEnabled === false
                                    ? { fullScreenGestureEnabled: false }
                                    : {}),
                            }, children: () => (_jsx(RnUiKitComponentExampleDetailPage, { definition: definition, headerTransparent: headerTransparent })) }, getComponentExampleRouteName(definition.key))))] }) }), _jsx(RnUiKitDebugSectionSheets, { pages: pages, instancePrefix: "sheet", onOpenChange: setOpenSectionSheets, openKeys: openSectionSheets, position: sectionSheetPosition }), _jsx(RnUiKitDebugPanel, { onOpenChange: setPanelSheetOpen, open: panelSheetOpen, pages: pages, nativeSheetScreenOptions: nativeSheetScreenOptions, panelSheetProps: panelSheetProps, sheetMode: true })] }));
}
function RnUiKitDebugHomeRoute({ layoutHost = "default", onOpenInSheet, pages, onOpenPanelSheet, onOpenSectionsInSheetChange, onSectionSheetPositionChange, openSectionsInSheet, sectionSheetPosition, onRefresh, }) {
    const navigation = useNavigation();
    return (_jsx(RnUiKitDebugHomePage, { onRefresh: onRefresh, layoutHost: layoutHost, onOpenSection: (key) => {
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
