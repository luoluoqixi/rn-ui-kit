import { useState } from "react";
import { YStack } from "tamagui";
import {
  Button,
  Card,
  ListGroup,
  NativeList,
  NativeListNavigationItem,
  NativeListSection,
  Paragraph,
  Separator,
  Text,
} from "rn_ui_kit";

import type { RnUiKitDebugSectionContentProps } from "../../types";

export function RnUiKitExampleLayoutPage({ header }: RnUiKitDebugSectionContentProps) {
  const [selected, setSelected] = useState("无");

  return (
    <YStack gap="$3" px="$4">
      {header}
      <Card description="通用列表与布局示例页。" title="布局">
        <YStack gap="$4" p="$3" pt={0}>
          <Paragraph color="$color10">
            这里展示 NativeList、ListGroup、分割线和卡片之间的基础排版。
          </Paragraph>
          <NativeList>
            <NativeListSection title="导航示例">
              <NativeListNavigationItem
                onPress={() => setSelected("账户")}
                title="账户"
                value="打开"
              />
              <NativeListNavigationItem
                onPress={() => setSelected("外观")}
                title="外观"
                value="打开"
              />
            </NativeListSection>
          </NativeList>
          <Separator />
          <ListGroup
            items={[
              { subTitle: "重复列表项示例", title: "第一项" },
              { subTitle: "另一个重复列表项示例", title: "第二项" },
            ]}
            rounded="$4"
            separator
          />
          <Text color="$color10">最近选择：{selected}</Text>
          <Button onPress={() => setSelected("已重置")} variant="outlined">
            重置选择
          </Button>
        </YStack>
      </Card>
    </YStack>
  );
}
