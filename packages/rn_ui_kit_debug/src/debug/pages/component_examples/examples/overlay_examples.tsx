import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  AlertDialog,
  Button,
  ContextMenu,
  Dialog,
  Input,
  Menu,
  Popover,
  Sheet,
  Text,
  Tooltip,
} from "rn_ui_kit";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
import type { ComponentExampleDefinition } from "../types";

function DialogExample() {
  const [open, setOpen] = useState(false);
  const [draftName, setDraftName] = useState("组件实验室");
  const [savedName, setSavedName] = useState("尚未保存");

  return (
    <ExampleStack>
      <ExampleBlock description={`已保存名称：${savedName}`} title="编辑工作区">
        <Dialog
          actions={
            <ExampleRow>
              <Button onPress={() => setOpen(false)} variant="outlined">取消</Button>
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

function AlertDialogExample() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("尚未操作");

  return (
    <ExampleStack>
      <ExampleBlock description={`最近结果：${result}`} title="危险操作确认">
        <AlertDialog
          cancelLabel="取消"
          destructiveLabel="删除"
          description="先在弹窗中做最后确认；此操作仅用于演示，不会删除真实数据。"
          onOpenChange={setOpen}
          open={open}
          title="删除 3 个草稿？"
          trigger={<Button onPress={() => setOpen(true)}>打开 AlertDialog</Button>}
          actions={
            <Button
              onPress={() => {
                setResult("确认删除");
                setOpen(false);
              }}
              theme="red"
            >
              自定义动作
            </Button>
          }
        />
      </ExampleBlock>
    </ExampleStack>
  );
}

function ContextMenuExample() {
  const [action, setAction] = useState("尚未选择");

  return (
    <ExampleStack>
      <ExampleBlock description="在桌面端右键、在触控设备长按，均会打开同一组操作。" title="文件操作">
        <ContextMenu
          arrow
          items={[
            { label: "重命名", onSelect: () => setAction("重命名"), value: "rename" },
            { label: "复制链接", onSelect: () => setAction("复制链接"), value: "copy-link" },
            { label: "separator", separator: true, value: "separator" },
            {
              destructive: true,
              label: "删除",
              onSelect: () => setAction("删除"),
              value: "delete",
            },
          ]}
          trigger={<Button variant="outlined">右键或长按</Button>}
        />
        <Text opacity={0.6}>最近动作：{action}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function MenuExample() {
  const [action, setAction] = useState("尚未选择");

  return (
    <ExampleStack>
      <ExampleBlock description="Menu 适合由普通按钮触发的一组轻量操作。" title="项目菜单">
        <Menu
          arrow
          items={[
            { label: "新建文件", onSelect: () => setAction("新建文件"), value: "new" },
            { label: "打开设置", onSelect: () => setAction("打开设置"), value: "settings" },
            { label: "导出快照", onSelect: () => setAction("导出快照"), value: "export" },
            { label: "separator", separator: true, value: "separator" },
            {
              destructive: true,
              label: "清空记录",
              onSelect: () => setAction("清空记录"),
              value: "clear",
            },
          ]}
          trigger={<Button variant="outlined">打开 Menu</Button>}
        />
        <Text opacity={0.6}>最近动作：{action}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function PopoverExample() {
  const [name, setName] = useState("rn_ui_kit");

  return (
    <ExampleStack>
      <ExampleBlock description="Popover 更适合锚定在触发元素旁的小范围编辑。" title={`当前名称：${name}`}>
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

function SheetExample() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(0);

  const openSheet = () => {
    setPosition(0);
    setOpen(true);
  };

  return (
    <ExampleStack>
      <ExampleBlock description={`状态：${open ? `打开，position=${position}` : "关闭"}`} title="多档位操作面板">
        <Button onPress={openSheet}>打开 Sheet</Button>
        <Sheet
          content={
            <View style={styles.sheetContent}>
              <Text fontSize="$6" fontWeight="700">
                Sheet 内容
              </Text>
              <Text opacity={0.6}>可拖拽到不同 snap point，也可拖到底部关闭。</Text>
              <ExampleRow>
                <Button onPress={() => setPosition(1)} variant="outlined">
                  切到第二档
                </Button>
                <Button onPress={() => setOpen(false)}>关闭</Button>
              </ExampleRow>
            </View>
          }
          dismissOnSnapToBottom
          handle
          modal
          onOpenChange={setOpen}
          onPositionChange={setPosition}
          open={open}
          overlay
          position={position}
          snapPoints={[72, 44]}
          snapPointsMode="percent"
          transitionConfig={{ duration: 180, type: "timing" }}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}

function TooltipExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="Web 悬停显示；Native 主要提供可访问性语义。" title="补充说明">
        <ExampleRow>
          <Tooltip arrow content="这会把当前版本发布到预览环境。">
            <Button variant="outlined">发布说明</Button>
          </Tooltip>
          <Tooltip arrow content="删除后将无法恢复。">
            <Button theme="red">危险操作</Button>
          </Tooltip>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}

export const overlayExamples = [
  {
    Component: DialogExample,
    description: "包含输入、取消和保存的受控对话框。",
    group: "浮层与菜单",
    key: "dialog",
    label: "Dialog",
  },
  {
    Component: AlertDialogExample,
    description: "危险操作的确认、取消和结果反馈。",
    group: "浮层与菜单",
    key: "alert-dialog",
    label: "AlertDialog",
  },
  {
    Component: ContextMenuExample,
    description: "右键/长按文件操作与结果反馈。",
    group: "浮层与菜单",
    key: "context-menu",
    label: "ContextMenu",
  },
  {
    Component: MenuExample,
    description: "按钮触发的多操作项目菜单。",
    group: "浮层与菜单",
    key: "menu",
    label: "Menu",
  },
  {
    Component: PopoverExample,
    description: "锚定触发器的小范围内容编辑。",
    group: "浮层与菜单",
    key: "popover",
    label: "Popover",
  },
  {
    Component: SheetExample,
    description: "多档位、可拖拽并可编程切换的 Sheet。",
    group: "浮层与菜单",
    key: "sheet",
    label: "Sheet",
  },
  {
    Component: TooltipExample,
    description: "多触发器的补充说明与危险提示。",
    group: "浮层与菜单",
    key: "tooltip",
    label: "Tooltip",
  },
] satisfies ComponentExampleDefinition[];

const styles = StyleSheet.create({
  dialogContent: { gap: 8 },
  popoverContent: { gap: 12, minWidth: 240, padding: 12 },
  sheetContent: { gap: 16, padding: 24 },
});
