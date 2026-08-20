import { useState } from "react";

import { StyleSheet, View } from "react-native";

import { Button, Input, Popover, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

const styles = StyleSheet.create({
  dialogContent: { gap: 8 },
  nativeSheetHost: { left: 0, position: "absolute", top: 0 },
  popoverContent: { gap: 12, minWidth: 240, padding: 12 },
  sheetContent: { gap: 16, padding: 24 },
  sheetItem: {
    borderColor: "rgba(128, 128, 128, 0.28)",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export function PopoverExample() {
  const [name, setName] = useState("rn-ui-kit");

  return (
    <ExampleStack>
      <ExampleBlock
        description="Popover 更适合锚定在触发元素旁的小范围编辑。"
        title={`当前名称：${name}`}
      >
        <Popover
          arrow
          content={
            <View style={styles.popoverContent}>
              <Text fontWeight="600">编辑名称</Text>
              <Input onChangeText={setName} value={name} />
            </View>
          }
          trigger={<Button variant="outlined">打开 Popover</Button>}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
