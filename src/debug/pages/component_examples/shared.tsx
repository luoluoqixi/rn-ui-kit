import { type ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import {
  Card,
  Input,
  NativeList,
  NativeListNavigationItem,
  NativeListSection,
  Text,
  Textarea,
} from "../../../core/components/ui";

export function ComponentExamplePlaceholder({
  children,
  name,
  status = "迁移占位",
}: {
  children?: ReactNode;
  name: string;
  status?: string;
}) {
  return (
    <View className="gap-4 p-4">
      <Text variant="muted">
        {name} 示例：{status}
      </Text>
      <Card
        content={children ?? <Text>此示例保留独立文件和路由，具体交互将在后续迁移阶段补齐。</Text>}
        contentProps={{ className: "gap-3" }}
        header={<Card.Title>{name}</Card.Title>}
      />
    </View>
  );
}

export function InputExampleContent() {
  return (
    <>
      <Input placeholder="Input" />
      <Textarea placeholder="TextArea" />
    </>
  );
}

export function NativeListExampleContent() {
  return (
    <NativeList>
      <NativeListSection title="NativeList">
        <NativeListNavigationItem
          title="Navigation item"
          subtitle="NativeList remains available."
        />
      </NativeListSection>
    </NativeList>
  );
}

export function ExampleStack({ children }: { children: ReactNode }) {
  return <View style={styles.stack}>{children}</View>;
}

export function ExampleBlock({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: ReactNode;
  title?: ReactNode;
}) {
  return (
    <Card
      contentProps={{ className: "gap-3" }}
      description={description}
      content={children}
      title={title}
    />
  );
}

export function ExampleRow({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 12 },
  stack: { gap: 16, width: "100%" },
});
