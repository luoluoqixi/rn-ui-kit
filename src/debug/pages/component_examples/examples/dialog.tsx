import { useState } from "react";
import {
  AlertDialog,
  Button,
  ContextMenu,
  Dialog,
  Dropdown,
  Input,
  NativeSheet,
  Popover,
  Select,
  Text,
  Tooltip,
} from "rn-ui-kit/core";
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
  const menuItems = [
    ...options,
    { value: "more", label: "更多操作", subMenu: options },
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
              <Input
                placeholder="新名称"
                onChangeText={setDraft}
                value={draft}
              />
            </View>
          )}
          description="示例 description"
          onOpenChange={setOpen}
          open={open}
          title="重命名工作区"
          trigger={<Button>编辑名称</Button>}
        />
      </ExampleBlock>
      <ExampleBlock
        title="Dialog 内的弹层"
        description="检查选项、菜单和 Sheet 的层级，以及 Escape、外部点击和焦点返回。"
      >
        <Dialog
          title="嵌套弹层"
          trigger={<Button>打开嵌套弹层</Button>}
          content={
            <View className="gap-3">
              <Select
                native={false}
                items={options}
                value={choice}
                onValueChange={setChoice}
              />
              <Dropdown
                trigger={<Button variant="outline">打开菜单</Button>}
                items={menuItems}
              />
              <ContextMenu
                items={menuItems}
                trigger={<Button variant="outline">右键检查二级菜单</Button>}
              />
              <Popover content={<Input placeholder="Popover 输入焦点" />}>
                <Button variant="outline">打开 Popover</Button>
              </Popover>
              <Tooltip content="Dialog 内 Tooltip">
                <Button variant="outline">悬停查看提示</Button>
              </Tooltip>
              <AlertDialog
                title="Dialog 内的确认"
                description="取消后应保留外层 Dialog。"
                trigger={<Button variant="outline">打开子 AlertDialog</Button>}
                cancelLabel="取消"
                actionLabel="确认"
              />
              <Button onPress={() => setSheetOpen(true)}>打开子 Sheet</Button>
              <NativeSheet
                name="dialog-child-sheet"
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                snapPoints={["60%"]}
              >
                <View className="gap-3 p-6">
                  <Text>Dialog 中的 Sheet</Text>
                  <Input placeholder="检查输入焦点" />
                  <Select
                    native={false}
                    items={options}
                    value={choice}
                    onValueChange={setChoice}
                  />
                  <Dropdown
                    trigger={<Button variant="outline">Sheet 二级菜单</Button>}
                    items={menuItems}
                  />
                  <Dialog
                    title="Sheet 内的 Dialog"
                    trigger={
                      <Button variant="outline">打开 Sheet 内 Dialog</Button>
                    }
                    content={
                      <View className="gap-3">
                        <Input placeholder="Sheet 内 Dialog 输入" />
                        <Select
                          native={false}
                          items={options}
                          value={choice}
                          onValueChange={setChoice}
                        />
                        <Popover
                          content={
                            <Input placeholder="嵌套 Dialog 的 Popover 输入" />
                          }
                        >
                          <Button variant="outline">内层 Popover</Button>
                        </Popover>
                      </View>
                    }
                    cancelLabel="返回 Sheet"
                  />
                  <AlertDialog
                    title="Sheet 内的确认"
                    description="取消后应保留 Sheet 和外层 Dialog。"
                    trigger={
                      <Button variant="outline">
                        打开 Sheet 内 AlertDialog
                      </Button>
                    }
                    cancelLabel="取消"
                    actionLabel="确认"
                  />
                  <Button onPress={() => setSheetOpen(false)}>
                    关闭子 Sheet
                  </Button>
                </View>
              </NativeSheet>
            </View>
          }
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
