import { View } from "react-native";
import { AspectRatio, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function AspectRatioExample() {
  return (
    <ExampleStack>
      <ExampleBlock title="媒体预览">
        <AspectRatio
          ratio={16 / 9}
          className="w-full overflow-hidden rounded-lg border border-primary/30 bg-primary/10"
        >
          <View className="flex-1 items-center justify-center">
            <Text>16:9 Preview</Text>
          </View>
        </AspectRatio>
        <AspectRatio ratio={1} className="w-32 rounded-lg border border-accent bg-accent/30">
          <View className="flex-1 items-center justify-center">
            <Text>1:1</Text>
          </View>
        </AspectRatio>
      </ExampleBlock>
    </ExampleStack>
  );
}
