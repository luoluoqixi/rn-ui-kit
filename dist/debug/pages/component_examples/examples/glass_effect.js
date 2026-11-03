import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Bold, ChevronLeft, FolderPlus, Italic, Link, ListMusic, List, MoreHorizontal, Music2, Pause, Play, Plus, } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, View, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, GlassEffect, GlassEffectSearchBar, NativeList, NativeListInputItem, NativeListItem, NativeListSection, NativeListSelectItem, NativeListSwitchItem, Text, isGlassEffectAPIAvailable, isLiquidGlassAvailable, useAppBackgroundColors, useUiColorScheme, useKeyboardVisibility, isIos26Plus, } from "rn-ui-kit/core";
import { useIsComponentExampleEmbedded } from "../presentation_context";
const MODE_OPTIONS = [
    { label: "悬浮式底部按钮栏", value: "floating-buttons" },
    { label: "贴底式操作栏", value: "docked-actions" },
    { label: "键盘跟随编辑工具栏", value: "editor" },
    { label: "悬浮式搜索栏", value: "search" },
    { label: "悬浮式媒体控制栏", value: "music" },
    { label: "组合式玻璃按钮容器", value: "container" },
    { label: "玻璃材质样式对照", value: "style-gallery" },
];
const GLASS_STYLE_OPTIONS = [
    { label: "Regular", value: "regular" },
    { label: "Clear", value: "clear" },
    { label: "None", value: "none" },
];
const COLOR_SCHEME_OPTIONS = [
    { label: "跟随系统", value: "auto" },
    { label: "浅色", value: "light" },
    { label: "深色", value: "dark" },
];
const TINT_OPTIONS = [
    { label: "无 tint", value: "none" },
    { label: "绿色", value: "#34c759" },
    { label: "蓝色", value: "#0a84ff" },
    { label: "紫色", value: "#af52de" },
    { label: "橙色", value: "#ff9f0a" },
];
const RADIUS_OPTIONS = [16, 24, 32, 999].map((value) => ({
    label: value === 999 ? "胶囊" : `${value} pt`,
    value: String(value),
}));
const INSET_OPTIONS = [0, 12, 20, 32].map((value) => ({
    label: `${value} pt`,
    value: String(value),
}));
const OFFSET_OPTIONS = [8, 20, 48, 88].map((value) => ({
    label: `${value} pt`,
    value: String(value),
}));
const DURATION_OPTIONS = [0.2, 0.35, 0.6, 1].map((value) => ({
    label: `${value} 秒`,
    value: String(value),
}));
const CONTAINER_SPACING_OPTIONS = [0, 8, 20, 40].map((value) => ({
    label: `${value} pt`,
    value: String(value),
}));
function getModeLabel(mode) {
    return MODE_OPTIONS.find((option) => option.value === mode)?.label ?? mode;
}
function ExampleToolbarButton({ accessibilityLabel, appearance = "glass", fallbackIcon, onPress, style, title, }) {
    const native = Platform.OS === "ios";
    return (_jsx(Button, { "aria-label": accessibilityLabel, circular: !native, native: native, onPress: onPress, style: [styles.nativeIconButton, style], title: native ? title : undefined, variant: appearance === "plain" ? "ghost" : undefined, children: native ? undefined : fallbackIcon }));
}
function GlassEffectPreview({ animateStyleChanges, animationDuration, bottomOffset, buttonCount, colorScheme, compact, containerSpacing, cornerRadius, effectStyle, editorKeyboardVisible, fallbackSurfaceColor, glassAvailable, horizontalInset, interactive, mode, onAction, onLayoutSizeChange, onPlayingChange, onSearchChange, playing, search, showSubtitle, tintColor, }) {
    const insets = useSafeAreaInsets();
    const colorSchemeName = useUiColorScheme();
    const dark = colorSchemeName === "dark";
    const foregroundColor = dark ? "#f5f5f7" : "#111114";
    const secondaryColor = dark ? "#b7b7bd" : "#65656b";
    const glassEffectStyle = animateStyleChanges
        ? { animate: true, animationDuration, style: effectStyle }
        : effectStyle;
    const sharedGlassProps = {
        colorScheme,
        glassEffectStyle,
        isInteractive: interactive,
        tintColor,
    };
    const floatingBottom = insets.bottom + bottomOffset;
    const searchBottom = insets.bottom + 8;
    const fallbackStyle = glassAvailable ? undefined : { backgroundColor: fallbackSurfaceColor };
    const handleLayout = (event) => {
        const { height, width } = event.nativeEvent.layout;
        onLayoutSizeChange(`${Math.round(width)} × ${Math.round(height)} pt`);
    };
    if (mode === "docked-actions") {
        return (_jsxs(GlassEffect, { ...sharedGlassProps, accessibilityLabel: "\u56FA\u5B9A\u5728\u9875\u9762\u5E95\u90E8\u7684\u64CD\u4F5C\u5DE5\u5177\u680F", onLayout: handleLayout, style: [styles.dockedToolbar, { paddingBottom: Math.max(insets.bottom, 8) }, fallbackStyle], testID: "glass-effect-docked-toolbar", children: [_jsx(Button, { native: true, onPress: () => onAction("移动全部"), title: "\u79FB\u52A8\u5168\u90E8" }), _jsx(View, { style: styles.flexSpacer }), _jsx(Button, { native: true, onPress: () => onAction("全部删除"), title: "\u5168\u90E8\u5220\u9664" })] }));
    }
    if (mode === "search") {
        return (_jsx(GlassEffectSearchBar, { ...sharedGlassProps, accessibilityLabel: "\u60AC\u6D6E\u641C\u7D22\u5DE5\u5177\u680F", inputColor: foregroundColor, inputProps: {
                accessibilityLabel: "搜索示例内容",
                onChangeText: onSearchChange,
                value: search,
            }, onCancel: () => onAction("取消搜索"), onLayout: handleLayout, placeholder: "\u641C\u7D22\u7EC4\u4EF6\u6216\u8BBE\u7F6E", placeholderTextColor: secondaryColor, searchIconColor: secondaryColor, searchStyle: [{ borderRadius: cornerRadius }, fallbackStyle], unfocusedTrailing: _jsx(Button, { "aria-label": "\u65B0\u5EFA\u5185\u5BB9", native: isIos26Plus(), circular: true, variant: "secondary", nativeButtonStyle: "glass", buttonSize: {
                    height: isIos26Plus() ? 40 : 50,
                    width: isIos26Plus() ? 40 : 60,
                }, onPress: () => onAction("新建内容"), title: "\u65B0\u5EFA" }), style: [
                styles.searchBarRow,
                { bottom: searchBottom, left: horizontalInset, right: horizontalInset },
            ] }));
    }
    if (mode === "editor") {
        if (!editorKeyboardVisible) {
            return null;
        }
        const usesNativeEditorToolbar = isIos26Plus();
        return (_jsxs(GlassEffect, { ...sharedGlassProps, accessibilityLabel: "\u8DDF\u968F\u952E\u76D8\u7684\u7F16\u8F91\u5DE5\u5177\u680F", keyboardAvoidance: usesNativeEditorToolbar ? true : { subtractSafeAreaInset: false }, keyboardHiddenConfirmation: { finalHeight: -64 }, onLayout: handleLayout, style: [
                usesNativeEditorToolbar ? styles.editorToolbar : styles.dockedToolbar,
                usesNativeEditorToolbar
                    ? {
                        borderRadius: cornerRadius,
                        bottom: insets.bottom + 8,
                        left: 8,
                        right: 8,
                    }
                    : { paddingBottom: Math.max(insets.bottom, 8) },
                fallbackStyle,
            ], testID: "glass-effect-editor-toolbar", children: [_jsx(Button, { "aria-label": "\u52A0\u7C97", variant: "secondary", buttonSize: { height: 48, width: 80 }, native: usesNativeEditorToolbar, nativeButtonStyle: "glass", nativeSystemImage: "bold", onPress: () => onAction("切换加粗"), title: "\u52A0\u7C97", children: _jsx(Bold, { color: foregroundColor, size: 21 }) }), _jsx(Button, { "aria-label": "\u659C\u4F53", variant: "secondary", buttonSize: { height: 48, width: 80 }, native: usesNativeEditorToolbar, nativeButtonStyle: "glass", nativeSystemImage: "italic", onPress: () => onAction("切换斜体"), title: "\u659C\u4F53", children: _jsx(Italic, { color: foregroundColor, size: 21 }) }), _jsx(Button, { variant: "secondary", "aria-label": "\u63D2\u5165\u5217\u8868", buttonSize: { height: 48, width: 80 }, native: usesNativeEditorToolbar, nativeButtonStyle: "glass", nativeSystemImage: "list.bullet", onPress: () => onAction("插入列表"), title: "\u5217\u8868", children: _jsx(List, { color: foregroundColor, size: 21 }) }), _jsx(View, { style: styles.flexSpacer }), _jsx(Button, { variant: "secondary", "aria-label": "\u63D2\u5165\u94FE\u63A5", buttonSize: { height: 48, width: 80 }, native: usesNativeEditorToolbar, nativeButtonStyle: "glass", nativeSystemImage: "link", onPress: () => onAction("插入链接"), title: "\u94FE\u63A5", children: _jsx(Link, { color: foregroundColor, size: 21 }) })] }));
    }
    if (mode === "music") {
        return (_jsxs(GlassEffect, { ...sharedGlassProps, accessibilityLabel: "\u81EA\u5B9A\u4E49\u97F3\u4E50\u64AD\u653E\u5DE5\u5177\u680F", onLayout: handleLayout, style: [
                styles.floatingToolbar,
                styles.musicToolbar,
                compact ? styles.compactToolbar : undefined,
                {
                    borderRadius: cornerRadius,
                    bottom: floatingBottom,
                    left: horizontalInset,
                    right: horizontalInset,
                },
                fallbackStyle,
            ], testID: "glass-effect-music-toolbar", children: [_jsx(View, { style: styles.albumArtwork, children: _jsx(Music2, { color: "#ffffff", size: compact ? 20 : 26 }) }), _jsxs(View, { style: styles.musicCopy, children: [_jsx(Text, { numberOfLines: 1, style: { fontSize: compact ? 15 : 17, fontWeight: "600" }, children: "Liquid Glass Radio" }), showSubtitle ? (_jsx(Text, { numberOfLines: 1, style: { fontSize: 13, opacity: 0.58 }, children: "\u4EFB\u610F React Native \u81EA\u5B9A\u4E49\u5185\u5BB9" })) : null] }), _jsx(Pressable, { accessibilityLabel: playing ? "暂停" : "播放", hitSlop: 10, onPress: () => {
                        onPlayingChange(!playing);
                        onAction(playing ? "暂停音乐" : "播放音乐");
                    }, style: styles.iconButton, children: playing ? (_jsx(Pause, { color: foregroundColor, fill: foregroundColor, size: 22 })) : (_jsx(Play, { color: foregroundColor, fill: foregroundColor, size: 22 })) }), _jsx(Pressable, { accessibilityLabel: "\u64AD\u653E\u961F\u5217", hitSlop: 10, onPress: () => onAction("打开播放队列"), style: styles.iconButton, children: _jsx(ListMusic, { color: foregroundColor, size: 23 }) })] }));
    }
    if (mode === "container") {
        return (_jsx(GlassEffect.Container, { accessibilityLabel: "\u591A\u4E2A\u73BB\u7483\u6309\u94AE\u7684\u878D\u5408\u5BB9\u5668", spacing: containerSpacing, style: [
                styles.glassContainer,
                {
                    bottom: floatingBottom,
                    left: horizontalInset,
                    right: horizontalInset,
                },
            ], children: [
                { Icon: ChevronLeft, label: "返回" },
                { Icon: Plus, label: "新增" },
                { Icon: FolderPlus, label: "新建文件夹" },
            ].map(({ Icon, label }) => (_createElement(GlassEffect, { ...sharedGlassProps, key: label, style: [styles.containerButtonGlass, fallbackStyle] },
                _jsx(Pressable, { accessibilityLabel: label, onPress: () => onAction(label), style: styles.containerButton, children: _jsx(Icon, { color: foregroundColor, size: 22 }) })))) }));
    }
    if (mode === "style-gallery") {
        return (_jsx(View, { style: [
                styles.styleGallery,
                {
                    bottom: floatingBottom,
                    left: horizontalInset,
                    right: horizontalInset,
                },
            ], children: ["regular", "clear", "none"].map((styleName) => (_createElement(GlassEffect, { ...sharedGlassProps, glassEffectStyle: styleName, key: styleName, onLayout: styleName === "regular" ? handleLayout : undefined, style: [styles.galleryGlass, fallbackStyle] },
                _jsx(Text, { style: { fontSize: 12, fontWeight: "600" }, children: styleName })))) }));
    }
    const buttonDefinitions = [
        { Icon: ChevronLeft, title: "返回", action: "返回" },
        { Icon: Plus, title: "新增", action: "新增" },
        {
            Icon: FolderPlus,
            title: "文件夹",
            action: "新建文件夹",
        },
        {
            Icon: MoreHorizontal,
            title: "更多",
            action: "更多操作",
        },
    ].slice(0, buttonCount);
    return (_jsx(GlassEffect, { ...sharedGlassProps, accessibilityLabel: "\u5305\u542B\u591A\u4E2A\u539F\u751F\u6309\u94AE\u7684\u60AC\u6D6E\u5DE5\u5177\u680F", onLayout: handleLayout, style: [
            styles.floatingToolbar,
            styles.nativeButtonsToolbar,
            compact ? styles.compactToolbar : undefined,
            {
                borderRadius: cornerRadius,
                bottom: floatingBottom,
                left: horizontalInset,
                right: horizontalInset,
            },
            fallbackStyle,
        ], testID: "glass-effect-floating-buttons", children: buttonDefinitions.map(({ Icon, ...button }) => (_jsx(ExampleToolbarButton, { accessibilityLabel: button.title, appearance: "plain", fallbackIcon: _jsx(Icon, { color: foregroundColor, size: 23 }), onPress: () => onAction(button.action), title: button.title }, button.action))) }));
}
export function GlassEffectExample() {
    const embeddedInOverview = useIsComponentExampleEmbedded();
    const appBackgroundColors = useAppBackgroundColors();
    const colorSchemeName = useUiColorScheme();
    const [mode, setMode] = useState("floating-buttons");
    const [effectStyle, setEffectStyle] = useState("regular");
    const [colorScheme, setColorScheme] = useState("auto");
    const [tintColor, setTintColor] = useState();
    const [interactive, setInteractive] = useState(true);
    const [animateStyleChanges, setAnimateStyleChanges] = useState(true);
    const [animationDuration, setAnimationDuration] = useState(0.35);
    const [cornerRadius, setCornerRadius] = useState(32);
    const [horizontalInset, setHorizontalInset] = useState(20);
    const [bottomOffset, setBottomOffset] = useState(20);
    const [containerSpacing, setContainerSpacing] = useState(20);
    const [compact, setCompact] = useState(false);
    const [showSubtitle, setShowSubtitle] = useState(true);
    const [buttonCount, setButtonCount] = useState(3);
    const [editorKeyboardVisible, setEditorKeyboardVisible] = useState(false);
    const [editorText, setEditorText] = useState("");
    const [search, setSearch] = useState("");
    const [playing, setPlaying] = useState(false);
    const [lastAction, setLastAction] = useState("尚未操作");
    const [lastLayoutSize, setLastLayoutSize] = useState("等待布局");
    const glassAvailable = isLiquidGlassAvailable();
    const glassApiAvailable = isGlassEffectAPIAvailable();
    const fallbackSurfaceColor = colorSchemeName === "dark" ? "rgba(44, 44, 48, 0.96)" : "rgba(246, 246, 248, 0.96)";
    const handleEditorKeyboardPhaseChange = useCallback((phase) => {
        setEditorKeyboardVisible(phase !== "hidden");
    }, []);
    useKeyboardVisibility({ onPhaseChange: handleEditorKeyboardPhaseChange });
    return (_jsxs(_Fragment, { children: [_jsxs(NativeList, { dismissKeyboardOnTap: true, automaticallyAdjustsScrollIndicatorInsets: Platform.OS === "ios" ? true : undefined, backgroundColor: appBackgroundColors.screen, contentInsetAdjustmentBehavior: Platform.OS === "ios" ? "automatic" : undefined, contentMarginBottom: 190, iosListStyle: "insetGrouped", style: styles.list, tracksNavigationBarScrollEdge: !embeddedInOverview, children: [_jsxs(NativeListSection, { footer: "\u5DE5\u5177\u680F\u4E0E\u5BFC\u822A\u65E0\u5173\uFF0C\u53EA\u662F\u53E0\u653E\u5728\u9875\u9762\u6839\u8282\u70B9\u4E0A\uFF1B\u5207\u6362\u6A21\u5F0F\u4E0D\u4F1A\u6539\u53D8 NativeList \u7684\u6EDA\u52A8\u5BB9\u5668\u3002", title: "\u9884\u89C8\u6A21\u5F0F", children: [_jsx(NativeListSelectItem, { selectProps: {
                                    onValueChange: (value) => {
                                        if (value == null) {
                                            return;
                                        }
                                        setMode(value);
                                    },
                                    options: MODE_OPTIONS,
                                    value: mode,
                                }, title: "\u5DE5\u5177\u680F\u5C55\u793A\u6A21\u5F0F" }), _jsx(NativeListItem, { chevron: false, subtitle: `当前平台：${Platform.OS}`, title: "Liquid Glass \u53EF\u7528", value: glassAvailable ? "是" : "否，普通 View 降级" }), _jsx(NativeListItem, { chevron: false, title: "\u539F\u751F Glass API \u53EF\u7528", value: glassApiAvailable ? "是" : "否" }), _jsx(NativeListItem, { chevron: false, title: "\u6700\u8FD1\u4E00\u6B21\u5E03\u5C40", value: lastLayoutSize }), _jsx(NativeListItem, { chevron: false, title: "\u6700\u8FD1\u64CD\u4F5C", value: lastAction })] }), mode === "editor" ? (_jsx(NativeListSection, { footer: "\u952E\u76D8\u663E\u793A\u65F6\uFF0C\u5DE5\u5177\u680F\u4F1A\u663E\u793A\u5728\u952E\u76D8\u4E0A\u65B9\uFF1B\u70B9\u51FB\u683C\u5F0F\u6309\u94AE\u4E0D\u4F1A\u6536\u8D77\u952E\u76D8\u3002", title: "\u7F16\u8F91\u5668\u8F93\u5165", children: _jsx(NativeListInputItem, { inputProps: {
                                onChangeText: setEditorText,
                                placeholder: "输入内容以显示编辑工具栏",
                                value: editorText,
                            }, title: "\u6B63\u6587" }) })) : null, _jsxs(NativeListSection, { footer: "\u8FD9\u4E9B\u8BBE\u7F6E\u4F1A\u76F4\u63A5\u900F\u4F20\u5230 expo-glass-effect \u7684 GlassView\u3002", title: "GlassView props", children: [_jsx(NativeListSelectItem, { selectProps: {
                                    onValueChange: (value) => value != null && setEffectStyle(value),
                                    options: GLASS_STYLE_OPTIONS,
                                    value: effectStyle,
                                }, title: "glassEffectStyle" }), _jsx(NativeListSwitchItem, { switchProps: {
                                    checked: animateStyleChanges,
                                    onCheckedChange: setAnimateStyleChanges,
                                }, title: "\u52A8\u753B\u5207\u6362 style" }), _jsx(NativeListSelectItem, { selectProps: {
                                    disabled: !animateStyleChanges,
                                    onValueChange: (value) => value != null && setAnimationDuration(Number(value)),
                                    options: DURATION_OPTIONS,
                                    value: String(animationDuration),
                                }, title: "animationDuration" }), _jsx(NativeListSelectItem, { selectProps: {
                                    onValueChange: (value) => value != null && setColorScheme(value),
                                    options: COLOR_SCHEME_OPTIONS,
                                    value: colorScheme,
                                }, title: "colorScheme" }), _jsx(NativeListSelectItem, { selectProps: {
                                    onValueChange: (value) => value != null && setTintColor(value === "none" ? undefined : value),
                                    options: TINT_OPTIONS,
                                    value: tintColor ?? "none",
                                }, title: "tintColor" }), _jsx(NativeListSwitchItem, { switchProps: { checked: interactive, onCheckedChange: setInteractive }, title: "isInteractive" })] }), _jsxs(NativeListSection, { footer: "\u8FD9\u4E9B\u662F\u666E\u901A React Native \u5E03\u5C40\u53C2\u6570\uFF0C\u4E0D\u5C5E\u4E8E expo-glass-effect \u7684\u56FA\u5B9A\u884C\u4E3A\u3002", title: "\u4F4D\u7F6E\u4E0E\u5F62\u72B6", children: [_jsx(NativeListSelectItem, { selectProps: {
                                    onValueChange: (value) => value != null && setCornerRadius(Number(value)),
                                    options: RADIUS_OPTIONS,
                                    value: String(cornerRadius),
                                }, title: "\u5706\u89D2" }), _jsx(NativeListSelectItem, { selectProps: {
                                    onValueChange: (value) => value != null && setHorizontalInset(Number(value)),
                                    options: INSET_OPTIONS,
                                    value: String(horizontalInset),
                                }, title: "\u6C34\u5E73\u8FB9\u8DDD" }), _jsx(NativeListSelectItem, { selectProps: {
                                    onValueChange: (value) => value != null && setBottomOffset(Number(value)),
                                    options: OFFSET_OPTIONS,
                                    value: String(bottomOffset),
                                }, title: "\u5E95\u90E8\u60AC\u6D6E\u8DDD\u79BB" }), _jsx(NativeListSelectItem, { selectProps: {
                                    onValueChange: (value) => value != null && setContainerSpacing(Number(value)),
                                    options: CONTAINER_SPACING_OPTIONS,
                                    value: String(containerSpacing),
                                }, title: "GlassContainer spacing" })] }), _jsxs(NativeListSection, { footer: "\u641C\u7D22\u6846\u3001\u539F\u751F Button\u3001\u56FE\u6807\u3001\u6587\u672C\u548C\u81EA\u5B9A\u4E49\u64AD\u653E\u5668\u5747\u4F5C\u4E3A\u666E\u901A React Native children \u653E\u8FDB GlassEffect\u3002", title: "\u4EFB\u610F children", children: [_jsx(NativeListSwitchItem, { switchProps: { checked: compact, onCheckedChange: setCompact }, title: "\u7D27\u51D1\u9AD8\u5EA6" }), _jsx(NativeListSwitchItem, { switchProps: { checked: showSubtitle, onCheckedChange: setShowSubtitle }, title: "\u663E\u793A\u97F3\u4E50\u526F\u6807\u9898" }), _jsx(NativeListSelectItem, { selectProps: {
                                    onValueChange: (value) => value != null && setButtonCount(Number(value)),
                                    options: [2, 3, 4].map((value) => ({
                                        label: `${value} 个`,
                                        value: String(value),
                                    })),
                                    value: String(buttonCount),
                                }, title: "\u539F\u751F Button \u6570\u91CF" }), _jsx(NativeListInputItem, { inputProps: {
                                    onChangeText: setSearch,
                                    placeholder: "搜索栏中的内容",
                                    value: search,
                                }, title: "\u641C\u7D22\u6587\u672C" }), _jsx(NativeListSwitchItem, { switchProps: { checked: playing, onCheckedChange: setPlaying }, title: "\u97F3\u4E50\u64AD\u653E\u72B6\u6001" })] }), _jsx(NativeListSection, { title: "\u6EDA\u52A8\u5185\u5BB9", children: Array.from({ length: 12 }, (_, index) => (_jsx(NativeListItem, { chevron: false, onPress: () => setLastAction(`点击滚动示例 ${index + 1}`), subtitle: "\u6EDA\u52A8\u5217\u8868\u4E0D\u4F1A\u6539\u53D8\u5DE5\u5177\u680F\u7684\u5C4F\u5E55\u4F4D\u7F6E", title: `NativeList 示例条目 ${index + 1}`, value: index % 2 === 0 ? "可交互" : "参数占位" }, index))) })] }), _jsx(GlassEffectPreview, { animateStyleChanges: animateStyleChanges, animationDuration: animationDuration, bottomOffset: bottomOffset, buttonCount: buttonCount, colorScheme: colorScheme, compact: compact, containerSpacing: containerSpacing, cornerRadius: cornerRadius, editorKeyboardVisible: editorKeyboardVisible, effectStyle: effectStyle, fallbackSurfaceColor: fallbackSurfaceColor, glassAvailable: glassAvailable, horizontalInset: horizontalInset, interactive: interactive, mode: mode, onAction: setLastAction, onLayoutSizeChange: setLastLayoutSize, onPlayingChange: setPlaying, onSearchChange: setSearch, playing: playing, search: search, showSubtitle: showSubtitle, tintColor: tintColor })] }));
}
const styles = StyleSheet.create({
    albumArtwork: {
        alignItems: "center",
        backgroundColor: "#5e5ce6",
        borderRadius: 12,
        height: 48,
        justifyContent: "center",
        width: 48,
    },
    compactToolbar: { minHeight: 52, paddingVertical: 6 },
    containerButton: {
        alignItems: "center",
        height: 52,
        justifyContent: "center",
        width: 52,
    },
    containerButtonGlass: { borderRadius: 26, height: 52, width: 52 },
    dockedToolbar: {
        alignItems: "center",
        bottom: 0,
        flexDirection: "row",
        left: 0,
        minHeight: 64,
        paddingHorizontal: 16,
        paddingTop: 8,
        position: "absolute",
        right: 0,
        zIndex: 20,
    },
    editorToolbar: {
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        minHeight: 64,
        paddingHorizontal: 8,
        paddingVertical: 8,
        position: "absolute",
        zIndex: 20,
    },
    flexSpacer: { flex: 1 },
    floatingToolbar: {
        alignItems: "center",
        flexDirection: "row",
        minHeight: 64,
        paddingHorizontal: 14,
        paddingVertical: 10,
        position: "absolute",
        zIndex: 20,
    },
    galleryGlass: {
        alignItems: "center",
        borderRadius: 18,
        flex: 1,
        justifyContent: "center",
        minHeight: 64,
        paddingHorizontal: 8,
    },
    glassContainer: {
        alignItems: "center",
        flexDirection: "row",
        gap: 14,
        justifyContent: "center",
        position: "absolute",
        zIndex: 20,
    },
    iconButton: {
        alignItems: "center",
        height: 42,
        justifyContent: "center",
        width: 42,
    },
    list: { flex: 1, minHeight: 0 },
    musicCopy: { flex: 1, gap: 2, minWidth: 0 },
    musicToolbar: { gap: 10 },
    nativeButtonsToolbar: { gap: 6, justifyContent: "space-around" },
    nativeIconButton: { height: 52, padding: 0, width: 52 },
    searchBarRow: {
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        position: "absolute",
        zIndex: 20,
    },
    styleGallery: {
        flexDirection: "row",
        gap: 10,
        position: "absolute",
        zIndex: 20,
    },
});
