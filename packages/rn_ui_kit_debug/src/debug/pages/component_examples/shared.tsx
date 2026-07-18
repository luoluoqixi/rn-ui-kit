import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "rn_ui_kit_core";

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
    <View style={styles.block}>
      {title != null ? (
        <Text fontSize="$5" fontWeight="600">
          {title}
        </Text>
      ) : null}
      {description != null ? <Text opacity={0.6}>{description}</Text> : null}
      <View style={styles.blockContent}>{children}</View>
    </View>
  );
}

export function ExampleRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  block: {
    borderColor: "rgba(128, 128, 128, 0.28)",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
    padding: 16,
  },
  blockContent: { gap: 12, paddingTop: 6 },
  row: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 12 },
  stack: { gap: 16, width: "100%" },
});
