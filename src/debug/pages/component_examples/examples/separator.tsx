import { StyleSheet, View } from "react-native";

import { Separator, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

const styles = StyleSheet.create({
  avatarRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 16 },
  imageHost: { alignSelf: "center", width: "100%" },
  verticalSeparatorRow: { alignItems: "center", flexDirection: "row", gap: 12, height: 40 },
});

export function SeparatorExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="水平分隔内容区块，垂直分隔并列信息。" title="内容层级">
        <Text>上方内容</Text>
        <Separator />
        <Text>下方内容</Text>
        <View style={styles.verticalSeparatorRow}>
          <Text>左侧</Text>
          <Separator height={24} vertical />
          <Text>右侧</Text>
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}
