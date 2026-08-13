import { useState } from "react";

import { StyleSheet, View } from "react-native";

import { Button, Dialog, Input, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

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

export function DialogExample() {
  const [open, setOpen] = useState(false);
  const [draftName, setDraftName] = useState("组件实验室");
  const [savedName, setSavedName] = useState("尚未保存");

  return (
    <ExampleStack>
      <ExampleBlock description={`已保存名称：${savedName}`} title="编辑工作区">
        <Dialog
          actions={
            <ExampleRow>
              <Button onPress={() => setOpen(false)} variant="outlined">
                取消
              </Button>
              <Button
                onPress={() => {
                  setSavedName(draftName || "未命名工作区");
                  setOpen(false);
                }}
                theme="accent"
              >
                保存
              </Button>
            </ExampleRow>
          }
          description="受控 Dialog 可承载一个小型编辑流程，并在关闭前提交结果。"
          onOpenChange={setOpen}
          open={open}
          title="重命名工作区"
          trigger={<Button onPress={() => setOpen(true)}>编辑名称</Button>}
        >
          <View style={styles.dialogContent}>
            <Text opacity={0.6}>新名称</Text>
            <Input onChangeText={setDraftName} value={draftName} />
          </View>
        </Dialog>
      </ExampleBlock>
    </ExampleStack>
  );
}
