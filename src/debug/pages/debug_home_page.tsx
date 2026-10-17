import { Maximize2, Minimize2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  NativeList,
  NativeListButtonItem,
  NativeListCustomItem,
  NativeListNavigationItem,
  NativeListSection,
  NativeListSwitchItem,
  Slider,
  useAppBackgroundColors,
} from "../../core/components/ui";
import type { RnUiKitDebugRouteDefinition, RnUiKitDebugRouteKey } from "../types";

export function RnUiKitDebugHomePage({
  openSectionsInSheet,
  onRefresh,
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
  onRefresh?: () => Promise<any> | void;
  pages: RnUiKitDebugRouteDefinition[];
  onOpenPanelSheet?: () => void;
  sectionSheetPosition: number;
  onOpenSection?: (key: RnUiKitDebugRouteKey) => void;
  onSectionSheetPositionChange?: (position: number) => void;
  onOpenSectionsInSheetChange?: (openInSheet: boolean) => void;
}) {
  const isNativeIosPage = Platform.OS === "ios";
  const appBackgroundColors = useAppBackgroundColors();
  const insets = useSafeAreaInsets();
  const tracksScrollEdgeHeader =
    Platform.OS === "android" || Platform.OS === "web" || isNativeIosPage;
  const horizontalContentInset =
    Platform.OS === "ios" ? undefined : { paddingLeft: insets.left, paddingRight: insets.right };
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
      backgroundColor={appBackgroundColors.screen}
      onRefresh={onRefresh}
      automaticallyAdjustsScrollIndicatorInsets={isNativeIosPage ? true : undefined}
      contentInsetAdjustmentBehavior={isNativeIosPage ? "automatic" : undefined}
      contentContainerStyle={horizontalContentInset}
      tracksNavigationBarScrollEdge={tracksScrollEdgeHeader}
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
            onCheckedChange: onOpenSectionsInSheetChange ?? (() => undefined),
          }}
          title="分区嵌套 NativeSheet"
        />
        {openSectionsInSheet ? (
          <NativeListCustomItem>
            <SectionSheetPositionSlider
              onPositionChange={onSectionSheetPositionChange}
              position={sectionSheetPosition}
            />
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

function SectionSheetPositionSlider({
  onPositionChange,
  position,
}: {
  onPositionChange?: (position: number) => void;
  position: number;
}) {
  const [draftPosition, setDraftPosition] = useState(position);
  const draftPositionRef = useRef(position);

  useEffect(() => {
    draftPositionRef.current = position;
    setDraftPosition(position);
  }, [position]);

  return (
    <View style={styles.detentSliderRow}>
      <Minimize2 color="#71717a" size={18} />
      <View style={styles.detentSliderControl}>
        <Slider
          max={2}
          min={0}
          onValueChange={(value) => {
            const nextPosition = value[0] ?? draftPositionRef.current;
            draftPositionRef.current = nextPosition;
            setDraftPosition(nextPosition);
          }}
          onValueChangeFinished={() => onPositionChange?.(draftPositionRef.current)}
          step={1}
          value={[draftPosition]}
        />
      </View>
      <Maximize2 color="#71717a" size={18} />
    </View>
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
