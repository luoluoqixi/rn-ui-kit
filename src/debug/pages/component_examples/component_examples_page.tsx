import { useContext } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { HeaderHeightContext } from "@react-navigation/elements";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  NativeList,
  NativeListNavigationItem,
  NativeListSection,
  NativeSheetFillContent,
  NativeSheetScrollContent,
  ScrollView,
  Text,
  isIos26Plus,
  useAppBackgroundColors,
} from "../../../core/components/ui";
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

function getComponentExampleDefinition(key: string) {
  const definition = componentExampleDefinitions.find((item) => item.key === key);
  if (definition == null) throw new Error(`Unknown rn-ui-kit component example: ${key}`);
  return definition;
}

export function getRnUiKitComponentExampleTitle(key: string) {
  return getComponentExampleDefinition(key).label;
}

export function RnUiKitComponentExamplesDebugPage({
  header,
  onOpenComponentExample,
}: RnUiKitDebugSectionContentProps) {
  const navigation = useNavigation<NavigationProp<DebugPanelNavigationParamList>>();
  const isNativeIosPage = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  const tracksScrollEdgeHeader =
    Platform.OS === "android" || Platform.OS === "web" || isNativeIosPage;
  const horizontalContentInset =
    Platform.OS === "ios" ? undefined : { paddingLeft: insets.left, paddingRight: insets.right };
  return (
    <View style={styles.root}>
      {header != null ? (
        <View
          style={[
            styles.routeHeader,
            Platform.OS !== "ios" && {
              paddingLeft: 20 + insets.left,
              paddingRight: 20 + insets.right,
            },
          ]}
        >
          {header}
        </View>
      ) : null}
      <NativeList
        automaticallyAdjustsScrollIndicatorInsets={isNativeIosPage ? true : undefined}
        contentInsetAdjustmentBehavior={isNativeIosPage ? "automatic" : undefined}
        contentContainerStyle={horizontalContentInset}
        tracksNavigationBarScrollEdge={tracksScrollEdgeHeader}
      >
        <NativeListSection>
          {sortedComponentExampleDefinitions.map((definition) => (
            <NativeListNavigationItem
              key={definition.key}
              onPress={() => {
                if (onOpenComponentExample != null) onOpenComponentExample(definition.key);
                else navigation.navigate(getComponentExampleRouteName(definition.key));
              }}
              title={definition.label}
            />
          ))}
        </NativeListSection>
      </NativeList>
    </View>
  );
}

export function RnUiKitComponentExampleDebugPage({
  exampleKey,
  headerTransparent = false,
  layoutHost = "default",
}: {
  exampleKey: string;
  headerTransparent?: boolean;
  layoutHost?: "default" | "nativeSheet";
}) {
  return (
    <RnUiKitComponentExampleDetailPage
      definition={getComponentExampleDefinition(exampleKey)}
      headerTransparent={headerTransparent}
      layoutHost={layoutHost}
    />
  );
}

export function RnUiKitComponentExampleDetailPage({
  definition,
  headerTransparent = false,
  layoutHost = "default",
}: {
  definition: ComponentExampleDefinition;
  headerTransparent?: boolean;
  layoutHost?: "default" | "nativeSheet";
}) {
  const headerHeight = useContext(HeaderHeightContext) ?? 0;
  const insets = useSafeAreaInsets();
  const appBackgroundColors = useAppBackgroundColors();
  const ActiveExample = definition.Component;

  if (definition.layout === "fill") {
    const pageBackgroundColor =
      layoutHost === "nativeSheet" && isIos26Plus() ? "transparent" : appBackgroundColors.screen;
    const fillBodyStyle = [
      styles.detailBody,
      {
        backgroundColor: pageBackgroundColor,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      },
      headerTransparent &&
        !definition.handlesHeaderInsets && { paddingTop: headerHeight },
    ];

    if (layoutHost === "nativeSheet") {
      return (
        <NativeSheetFillContent style={fillBodyStyle}>
          <ActiveExample />
        </NativeSheetFillContent>
      );
    }

    return (
      <View style={fillBodyStyle}>
        <ActiveExample />
      </View>
    );
  }

  const page = (
    <View
      style={[
        styles.scrollContent,
        { paddingLeft: 16 + insets.left, paddingRight: 16 + insets.right },
      ]}
    >
      <Text className="text-muted-foreground">
        {definition.description ?? `${definition.label} 示例`}
      </Text>
      <ActiveExample />
    </View>
  );

  if (layoutHost === "nativeSheet") {
    return (
      <NativeSheetScrollContent
        // Native Stack 中的 ScrollView 不属于 TrueSheetContentView 子树；显式绑定会让
        // iOS 15 在低 detent 下按窗口高度重写它的 frame。详情页使用自身的 inset 处理。
        bindToNativeSheet={false}
        constrainToNativeSheetViewport
        iosEmptyViewportScrollEnabled={Platform.OS === "ios" ? true : undefined}
        style={styles.detailBody}
        tracksNavigationBarScrollEdge={Platform.OS === "android" || Platform.OS === "web"}
      >
        {page}
      </NativeSheetScrollContent>
    );
  }
  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets={Platform.OS === "ios" ? true : undefined}
      contentInsetAdjustmentBehavior={Platform.OS === "ios" ? "automatic" : undefined}
      iosEmptyViewportScrollEnabled={Platform.OS === "ios" ? true : undefined}
      nestedScrollEnabled
      showsVerticalScrollIndicator
      style={styles.detailBody}
      tracksNavigationBarScrollEdge={Platform.OS === "android" || Platform.OS === "web"}
    >
      {page}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailBody: { flex: 1, minHeight: 0 },
  root: { flex: 1, minHeight: 0 },
  routeHeader: { paddingHorizontal: 20, paddingTop: 8 },
  scrollContent: { gap: 16, padding: 16, paddingBottom: 32 },
});
