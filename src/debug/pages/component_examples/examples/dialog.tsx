import { useState } from "react";
import { Button, Dialog, Dropdown, Input, NativeSheet, Select, Text } from "rn-ui-kit/core";
import { View } from "react-native";
import { ExampleBlock, ExampleStack } from "../shared";

export function DialogExample() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("组件实验室");
  const [saved, setSaved] = useState("尚未保存");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [choice, setChoice] = useState<string | null>("first");
  const options = [
    { label: "第一个选项", value: "first" },
    { label: "第二个选项", value: "second" },
  ];
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
      <ExampleBlock title="Dialog 内的弹层" description="检查选项、菜单和 Sheet 的层级，以及 Escape、外部点击和焦点返回。">
        <Dialog
          title="嵌套弹层"
          trigger={<Button>打开嵌套弹层</Button>}
          content={
            <View className="gap-3">
              <Select native={false} items={options} value={choice} onValueChange={setChoice} />
              <Dropdown trigger={<Button variant="outline">打开菜单</Button>} items={options} />
              <Button onPress={() => setSheetOpen(true)}>打开子 Sheet</Button>
              <NativeSheet name="dialog-child-sheet" open={sheetOpen} onOpenChange={setSheetOpen} snapPoints={["60%"]}>
                <View className="gap-3 p-6">
                  <Text>Dialog 中的 Sheet</Text>
                  <Input placeholder="检查输入焦点" />
                  <Select native={false} items={options} value={choice} onValueChange={setChoice} />
                  <Button onPress={() => setSheetOpen(false)}>关闭子 Sheet</Button>
                </View>
              </NativeSheet>
            </View>
          }
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
