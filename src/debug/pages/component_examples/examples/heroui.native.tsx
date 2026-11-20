import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Button, Dialog } from "heroui-native";
import { NativeSheet, NativeSheetScrollContent } from "rn-ui-kit/core";

function DialogProbe({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog isOpen={open} onOpenChange={setOpen}>
      <Button onPress={() => setOpen(true)}>{label}</Button>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>HeroUI Native 弹层验证</Dialog.Title>
          <Dialog.Description>检查遮罩、点击、返回键、键盘和关闭后 Sheet 的交互。</Dialog.Description>
          <TextInput accessibilityLabel="HeroUI 键盘验证" placeholder="输入后收起键盘，再关闭弹层" className="rounded-lg bg-field p-3 text-field-foreground" />
          <Button onPress={() => setOpen(false)}>关闭 HeroUI 弹层</Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export function HeroUIExample() {
  const [count, setCount] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <View className="gap-4 rounded-xl bg-surface p-4" testID="heroui-smoke-native">
      <Text className="text-foreground">当前底座：heroui-native（iOS / Android）</Text>
      <Text className="text-foreground">第一阶段使用 HeroUI 默认主题；项目主题色映射将在下一阶段统一。</Text>
      <Button onPress={() => setCount(value => value + 1)}>HeroUI 计数：{count}</Button>
      <Button variant="secondary">次要按钮</Button>
      <Button isDisabled>禁用按钮</Button>
      <DialogProbe label="打开 HeroUI 弹层" />
      <Button variant="secondary" onPress={() => setSheetOpen(true)}>打开 TrueSheet 内验证</Button>
      <NativeSheet open={sheetOpen} onOpenChange={setSheetOpen} detents={[0.6, 0.9]} handle>
        <NativeSheetScrollContent contentContainerStyle={{ padding: 20, gap: 16 }}>
          <Text className="text-foreground">保留现有 NativeSheet；重点观察 iOS 原生层级和 Android 返回键。</Text>
          <DialogProbe label="在 TrueSheet 内打开 HeroUI 弹层" />
          <Button variant="secondary" onPress={() => setSheetOpen(false)}>关闭验证 Sheet</Button>
        </NativeSheetScrollContent>
      </NativeSheet>
    </View>
  );
}
