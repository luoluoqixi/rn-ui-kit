import { useState } from "react";
import { Button, Dialog, Input, Text } from "rn-ui-kit/core";
import { View } from "react-native";
import { ExampleBlock, ExampleStack } from "../shared";

export function DialogExample() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("组件实验室");
  const [saved, setSaved] = useState("尚未保存");
  return (
    <ExampleStack>
      <ExampleBlock description={`已保存名称：${saved}`} title="编辑工作区">
        <Dialog
          actionLabel="保存"
          actionProps={{
            onPress: () => {
              setSaved(draft || "未命名工作区");
              setOpen(false);
            },
          }}
          cancelLabel="取消"
          content={() => (
            <View className="gap-3">
              <Text>新名称</Text>
              <Input placeholder="新名称" onChangeText={setDraft} value={draft} />
            </View>
          )}
          description="示例 description"
          onOpenChange={setOpen}
          open={open}
          title="重命名工作区"
          trigger={<Button>编辑名称</Button>}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
