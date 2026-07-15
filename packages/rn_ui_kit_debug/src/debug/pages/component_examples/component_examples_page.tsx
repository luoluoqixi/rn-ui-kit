import { type NavigationProp, useIsFocused, useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import {
  NativeList,
  NativeListNavigationItem,
  NativeListSection,
  NativeSheetScrollContent,
  ScrollView,
  Text,
  useAppBackgroundColors,
} from "rn_ui_kit";

import type { RnUiKitDebugSectionContentProps } from "../../types";
import { componentExampleDefinitions } from "./catalog";
import type { ComponentExampleDefinition } from "./types";

type DebugPanelNavigationParamList = Record<string, undefined>;

const sortedComponentExampleDefinitions = [...componentExampleDefinitions].sort(
  (left, right) =>
    left.label.localeCompare(right.label, "en", { numeric: true, sensitivity: "base" }) ||
    left.key.localeCompare(right.key),
);

export function getComponentExampleRouteName(key: string) {
  return `component-example:${key}`;
}

/** The examples list lives on the debug panel stack; only its detail routes are separate screens. */
export function RnUiKitComponentExamplesDebugPage({ header }: RnUiKitDebugSectionContentProps) {
  const appBackgroundColors = useAppBackgroundColors();
  const navigation = useNavigation<NavigationProp<DebugPanelNavigationParamList>>();

  return (
    <View style={[styles.root, { backgroundColor: appBackgroundColors.screen }]}>
      {header != null ? <View style={styles.routeHeader}>{header}</View> : null}
      <NativeList>
        <NativeListSection>
          {sortedComponentExampleDefinitions.map((definition) => (
            <NativeListNavigationItem
              key={definition.key}
              onPress={() => navigation.navigate(getComponentExampleRouteName(definition.key))}
              subtitle={definition.description}
              title={definition.label}
            />
          ))}
        </NativeListSection>
      </NativeList>
    </View>
  );
}

export function RnUiKitComponentExampleDetailPage({
  definition,
  layoutHost = "default",
}: {
  definition: ComponentExampleDefinition;
  layoutHost?: "default" | "nativeSheet";
}) {
  const appBackgroundColors = useAppBackgroundColors();
  const isFocused = useIsFocused();
  const ActiveExample = definition.Component;

  if (definition.layout === "fill") {
    return (
      <View style={[styles.detailBody, { backgroundColor: appBackgroundColors.screen }]}>
        <ActiveExample />
      </View>
    );
  }

  const contents = (
    <View style={[styles.scrollContent, { backgroundColor: appBackgroundColors.screen }]}>
      <Text opacity={0.6}>{definition.description}</Text>
      <ActiveExample />
    </View>
  );

  const scrollStyle = [styles.detailBody, { backgroundColor: appBackgroundColors.screen }];
  if (layoutHost === "nativeSheet") {
    return (
      <NativeSheetScrollContent
        bindToNativeSheet={isFocused}
        nestedScrollEnabled
        showsVerticalScrollIndicator
        style={scrollStyle}
      >
        {contents}
      </NativeSheetScrollContent>
    );
  }

  return (
    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator style={scrollStyle}>
      {contents}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailBody: { flex: 1, minHeight: 0 },
  root: { flex: 1, minHeight: 0 },
  routeHeader: { paddingHorizontal: 20, paddingTop: 8 },
  scrollContent: { gap: 16, padding: 16, paddingBottom: 32 },
});
