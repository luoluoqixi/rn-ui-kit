import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  Button,
  SplitLayout,
  Text,
  type SplitLayoutHandle,
  useAppBackgroundColors,
} from "rn-ui-kit/core";

const styles = StyleSheet.create({
  splitHost: { flex: 1, minHeight: 0 },
  splitPane: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
    minHeight: 0,
    minWidth: 0,
    padding: 16,
  },
  splitRoot: { flex: 1, minHeight: 0, paddingBottom: 48 },
  splitToolbar: {
    alignItems: "center",
    borderBottomColor: "rgba(128, 128, 128, 0.24)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
  },
});

export function SplitLayoutExample() {
  const layoutRef = useRef<SplitLayoutHandle | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const colors = useAppBackgroundColors();

  const toggleSidebar = () => {
    const nextVisible = !sidebarVisible;
    layoutRef.current?.setVisible(0, nextVisible);
    setSidebarVisible(nextVisible);
  };

  return (
    <View style={[styles.splitRoot, { backgroundColor: colors.screen }]}>
      <View style={styles.splitToolbar}>
        <Button className="border-primary" onPress={toggleSidebar} size="sm" variant="outline">
          <Text className="text-primary">{sidebarVisible ? "隐藏侧栏" : "显示侧栏"}</Text>
        </Button>
        <Button
          className="border-primary"
          onPress={() => layoutRef.current?.reset()}
          size="sm"
          variant="outline"
        >
          <Text className="text-primary">重置尺寸</Text>
        </Button>
        <Text className="text-muted-foreground">拖动中间分隔条调整宽度</Text>
      </View>
      <View style={styles.splitHost}>
        <SplitLayout
          defaultSizes={[220, 520]}
          minSize={80}
          onVisibleChange={(index, visible) => {
            if (index === 0) setSidebarVisible(visible);
          }}
          proportionalLayout={false}
          ref={layoutRef}
        >
          <SplitLayout.Pane minSize={120} preferredSize={220} snap>
            <View style={[styles.splitPane, { backgroundColor: colors.card }]}>
              <Text className="font-bold">侧栏</Text>
              <Text className="text-muted-foreground">Pane 1</Text>
            </View>
          </SplitLayout.Pane>
          <SplitLayout.Pane minSize={180}>
            <View style={[styles.splitPane, { backgroundColor: colors.screen }]}>
              <Text variant="h3">主内容</Text>
              <Text className="text-muted-foreground">
                此示例没有传 storageKey 或 storageAdapter，不会持久化。
              </Text>
            </View>
          </SplitLayout.Pane>
        </SplitLayout>
      </View>
    </View>
  );
}
