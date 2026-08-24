import { View } from "react-native";
import { Separator, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function SeparatorExample() {
  return (
    <ExampleStack>
      <ExampleBlock title="内容层级">
        <Text>上方内容</Text>
        <Separator />
        <Text>下方内容</Text>
        <View className="h-10 flex-row items-center gap-3">
          <Text>左侧</Text>
          <Separator orientation="vertical" />
          <Text>右侧</Text>
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}
