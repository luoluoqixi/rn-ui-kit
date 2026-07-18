import { Maximize2, Minimize2 } from "@tamagui/lucide-icons-2";
import { Platform, StyleSheet, View } from "react-native";
import {
  NativeList,
  NativeListButtonItem,
  NativeListCustomItem,
  NativeListNavigationItem,
  NativeListSection,
  NativeListSwitchItem,
  Slider,
  isIos26Plus,
} from "rn_ui_kit";

import type { RnUiKitDebugRouteDefinition, RnUiKitDebugRouteKey } from "../types";

export function RnUiKitDebugHomePage({
  layoutHost = "default",
  openSectionsInSheet,
  pages,
  onOpenPanelSheet,
  sectionSheetPosition,
  onOpenSection,
  onSectionSheetPositionChange,
  onOpenSectionsInSheetChange,
}: {
  /** @deprecated iOS header 的内容 inset 现由页面的原生导航栏模式自动决定。 */
  headerTransparent?: boolean;
  layoutHost?: "default" | "nativeSheet";
  openSectionsInSheet: boolean;
  pages: RnUiKitDebugRouteDefinition[];
  onOpenPanelSheet?: () => void;
  sectionSheetPosition: number;
  onOpenSection?: (key: RnUiKitDebugRouteKey) => void;
  onSectionSheetPositionChange?: (position: number) => void;
  onOpenSectionsInSheetChange?: (openInSheet: boolean) => void;
}) {
  const isNativeIosPage = Platform.OS === "ios";
  const usesPreIos26ScrollEdgeHeader = isNativeIosPage && !isIos26Plus();
  const sections = Array.from(
    pages.reduce((groups, page) => {
      const section = page.section ?? "调试分区";
      const group = groups.get(section) ?? [];
      group.push(page);
      groups.set(section, group);
      return groups;
    }, new Map<string, RnUiKitDebugRouteDefinition[]>()),
  );

  return (
    <NativeList
      automaticallyAdjustsScrollIndicatorInsets={
        isNativeIosPage ? true : undefined
      }
      contentInsetAdjustmentBehavior={
        usesPreIos26ScrollEdgeHeader ? "automatic" : undefined
      }
      tracksNavigationBarScrollEdge={usesPreIos26ScrollEdgeHeader}
    >
      {sections.map(([section, sectionPages]) => (
        <NativeListSection key={section} title={section}>
          {[...sectionPages]
            .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
            .map((definition) => (
              <NativeListNavigationItem
                key={definition.key}
                onPress={() => onOpenSection?.(definition.key)}
                subtitle={definition.description}
                title={definition.label}
              />
            ))}
        </NativeListSection>
      ))}

      <NativeListSection title="分区行为">
        <NativeListSwitchItem
          switchProps={{
            checked: openSectionsInSheet,
            onCheckedChange: onOpenSectionsInSheetChange,
          }}
          title="分区嵌套 NativeSheet"
        />
        {openSectionsInSheet ? (
          <NativeListCustomItem>
            <View style={styles.detentSliderRow}>
              <Minimize2 color="$color10" size={18} />
              <View style={styles.detentSliderControl}>
                <Slider
                  max={2}
                  min={0}
                  onValueChange={(value) => onSectionSheetPositionChange?.(value[0] ?? 0)}
                  step={1}
                  value={[sectionSheetPosition]}
                />
              </View>
              <Maximize2 color="$color10" size={18} />
            </View>
          </NativeListCustomItem>
        ) : null}
      </NativeListSection>

      {onOpenPanelSheet != null ? (
        <NativeListSection title="面板模式">
          <NativeListButtonItem onPress={onOpenPanelSheet} title="以 NativeSheet 打开调试首页" />
        </NativeListSection>
      ) : null}
    </NativeList>
  );
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
