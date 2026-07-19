import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Maximize2, Minimize2 } from "@tamagui/lucide-icons-2";
import { Platform, StyleSheet, View } from "react-native";
import { NativeList, NativeListButtonItem, NativeListCustomItem, NativeListNavigationItem, NativeListSection, NativeListSwitchItem, Slider, isIos26Plus, } from "rn-ui-kit/core";
export function RnUiKitDebugHomePage({ layoutHost = "default", openSectionsInSheet, pages, onOpenPanelSheet, sectionSheetPosition, onOpenSection, onSectionSheetPositionChange, onOpenSectionsInSheetChange, }) {
    const isNativeIosPage = Platform.OS === "ios";
    const usesPreIos26ScrollEdgeHeader = isNativeIosPage && !isIos26Plus();
    const sections = Array.from(pages.reduce((groups, page) => {
        const section = page.section ?? "调试分区";
        const group = groups.get(section) ?? [];
        group.push(page);
        groups.set(section, group);
        return groups;
    }, new Map()));
    return (_jsxs(NativeList, { automaticallyAdjustsScrollIndicatorInsets: isNativeIosPage ? true : undefined, contentInsetAdjustmentBehavior: usesPreIos26ScrollEdgeHeader ? "automatic" : undefined, tracksNavigationBarScrollEdge: usesPreIos26ScrollEdgeHeader, children: [sections.map(([section, sectionPages]) => (_jsx(NativeListSection, { title: section, children: [...sectionPages]
                    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
                    .map((definition) => (_jsx(NativeListNavigationItem, { onPress: () => onOpenSection?.(definition.key), subtitle: definition.description, title: definition.label }, definition.key))) }, section))), _jsxs(NativeListSection, { title: "\u5206\u533A\u884C\u4E3A", children: [_jsx(NativeListSwitchItem, { switchProps: {
                            checked: openSectionsInSheet,
                            onCheckedChange: onOpenSectionsInSheetChange,
                        }, title: "\u5206\u533A\u5D4C\u5957 NativeSheet" }), openSectionsInSheet ? (_jsx(NativeListCustomItem, { children: _jsxs(View, { style: styles.detentSliderRow, children: [_jsx(Minimize2, { color: "$color10", size: 18 }), _jsx(View, { style: styles.detentSliderControl, children: _jsx(Slider, { max: 2, min: 0, onValueChange: (value) => onSectionSheetPositionChange?.(value[0] ?? 0), step: 1, value: [sectionSheetPosition] }) }), _jsx(Maximize2, { color: "$color10", size: 18 })] }) })) : null] }), onOpenPanelSheet != null ? (_jsx(NativeListSection, { title: "\u9762\u677F\u6A21\u5F0F", children: _jsx(NativeListButtonItem, { onPress: onOpenPanelSheet, title: "\u4EE5 NativeSheet \u6253\u5F00\u8C03\u8BD5\u9996\u9875" }) })) : null] }));
}
const styles = StyleSheet.create({
    detentSliderControl: { flex: 1, minWidth: 0 },
    detentSliderRow: {
        alignItems: "center",
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },
});
