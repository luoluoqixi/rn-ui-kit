import { useId, useState } from "react";
import { XStack, YStack } from "tamagui";
import { Button, Card, Input, Label, Paragraph, Slider, Switch, Text } from "rn_ui_kit";

import type { RnUiKitDebugSectionContentProps } from "../../types";

export function RnUiKitExampleControlsPage({
  header,
  instanceId,
}: RnUiKitDebugSectionContentProps) {
  const generatedId = useId();
  const [enabled, setEnabled] = useState(true);
  const [name, setName] = useState("rn_ui_kit");
  const [value, setValue] = useState(48);
  const nameInputId = `rn-ui-kit-debug-name-${instanceId ?? generatedId}`;

  return (
    <YStack gap="$3" px="$4">
      {header}
      <Card description="用于页面切换演示的简单状态控件。" title="控件">
        <YStack gap="$4" p="$3" pt={0}>
          <Paragraph color="$color10">
            这里提供一个通用示例，用于验证输入、开关、按钮和滑块的组合行为。
          </Paragraph>
          <YStack gap="$2">
            <Label htmlFor={nameInputId}>名称</Label>
            <Input
              id={nameInputId}
              onChangeText={setName}
              placeholder="输入一个标签"
              value={name}
            />
            <Text color="$color10">当前值：{name}</Text>
          </YStack>
          <XStack gap="$3" items="center" flexWrap="wrap">
            <Switch checked={enabled} label="启用" onCheckedChange={setEnabled} />
            <Button disabled={!enabled} theme="accent">
              执行动作
            </Button>
          </XStack>
          <YStack gap="$2">
            <Text fontWeight="700">滑块：{value}</Text>
            <Slider
              max={100}
              min={0}
              onValueChange={(nextValue) => setValue(nextValue[0] ?? 0)}
              step={1}
              value={[value]}
            />
          </YStack>
        </YStack>
      </Card>
    </YStack>
  );
}
