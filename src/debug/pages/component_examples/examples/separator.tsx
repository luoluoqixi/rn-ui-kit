import { View } from "react-native";
import { Separator, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function SeparatorExample() {
  return <ExampleStack>
    <ExampleBlock title="内容分隔">
      <Text weight="semibold">工作区</Text>
      <Text color="muted" type="body-sm">管理成员、项目与通知偏好。</Text>
      <Separator />
      <View className="h-5 flex-row items-center gap-3">
        <Text type="body-sm">概览</Text><Separator orientation="vertical" />
        <Text type="body-sm">成员</Text><Separator orientation="vertical" />
        <Text type="body-sm">设置</Text>
      </View>
    </ExampleBlock>
    <ExampleBlock title="粗细"><Text type="body-sm">细分隔线</Text><Separator />
      <Text type="body-sm">粗分隔线</Text><Separator variant="thick" />
    </ExampleBlock>
    <ExampleBlock title="自定义厚度与颜色">
      <Separator thickness={4} className="bg-accent rounded-full" isDecorative />
      <Separator thickness={2} className="bg-success" isDecorative />
    </ExampleBlock>
  </ExampleStack>;
}
