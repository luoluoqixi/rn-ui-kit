import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Maximize2, Minimize2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeList, NativeListButtonItem, NativeListCustomItem, NativeListNavigationItem, NativeListSection, NativeListSwitchItem, Slider, } from "../../core/components/ui";
export function RnUiKitDebugHomePage({ openSectionsInSheet, onRefresh, pages, onOpenPanelSheet, sectionSheetPosition, onOpenSection, onSectionSheetPositionChange, onOpenSectionsInSheetChange, }) {
    const isNativeIosPage = Platform.OS === "ios";
    const insets = useSafeAreaInsets();
    const tracksScrollEdgeHeader = Platform.OS === "android" || Platform.OS === "web" || isNativeIosPage;
    const horizontalContentInset = Platform.OS === "ios" ? undefined : { paddingLeft: insets.left, paddingRight: insets.right };
    const sections = Array.from(pages.reduce((groups, page) => {
        const section = page.section ?? "调试分区";
        const group = groups.get(section) ?? [];
        group.push(page);
        groups.set(section, group);
        return groups;
    }, new Map()));
    return (_jsxs(NativeList, { onRefresh: onRefresh, automaticallyAdjustsScrollIndicatorInsets: isNativeIosPage ? true : undefined, contentInsetAdjustmentBehavior: isNativeIosPage ? "automatic" : undefined, contentContainerStyle: horizontalContentInset, tracksNavigationBarScrollEdge: tracksScrollEdgeHeader, children: [sections.map(([section, sectionPages]) => (_jsx(NativeListSection, { title: section, children: [...sectionPages]
                    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
                    .map((definition) => (_jsx(NativeListNavigationItem, { onPress: () => onOpenSection?.(definition.key), subtitle: definition.description, title: definition.label }, definition.key))) }, section))), _jsxs(NativeListSection, { title: "\u5206\u533A\u884C\u4E3A", children: [_jsx(NativeListSwitchItem, { switchProps: {
                            checked: openSectionsInSheet,
                            onCheckedChange: onOpenSectionsInSheetChange ?? (() => undefined),
                        }, title: "\u5206\u533A\u5D4C\u5957 NativeSheet" }), openSectionsInSheet ? (_jsx(NativeListCustomItem, { children: _jsx(SectionSheetPositionSlider, { onPositionChange: onSectionSheetPositionChange, position: sectionSheetPosition }) })) : null] }), onOpenPanelSheet != null ? (_jsx(NativeListSection, { title: "\u9762\u677F\u6A21\u5F0F", children: _jsx(NativeListButtonItem, { onPress: onOpenPanelSheet, title: "\u4EE5 NativeSheet \u6253\u5F00\u8C03\u8BD5\u9996\u9875" }) })) : null] }));
}
function SectionSheetPositionSlider({ onPositionChange, position, }) {
    const [draftPosition, setDraftPosition] = useState(position);
    const draftPositionRef = useRef(position);
    useEffect(() => {
        draftPositionRef.current = position;
        setDraftPosition(position);
    }, [position]);
    return (_jsxs(View, { style: styles.detentSliderRow, children: [_jsx(Minimize2, { color: "#71717a", size: 18 }), _jsx(View, { style: styles.detentSliderControl, children: _jsx(Slider, { max: 2, min: 0, onValueChange: (value) => {
                        const nextPosition = value[0] ?? draftPositionRef.current;
                        draftPositionRef.current = nextPosition;
                        setDraftPosition(nextPosition);
                    }, onValueChangeFinished: () => onPositionChange?.(draftPositionRef.current), step: 1, value: [draftPosition] }) }), _jsx(Maximize2, { color: "#71717a", size: 18 })] }));
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
