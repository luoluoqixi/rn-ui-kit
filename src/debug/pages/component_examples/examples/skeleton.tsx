import { View } from "react-native";
import { Skeleton, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function SkeletonExample() {
  return (
    <ExampleStack>
      <ExampleBlock title="加载状态">
        <View className="gap-3">
          <Skeleton className="bg-muted-foreground/30 h-5 w-3/4" />
          <Skeleton className="bg-muted-foreground/30 h-4 w-full" />
          <Skeleton className="bg-muted-foreground/30 h-4 w-2/3" />
          <Text className="text-muted-foreground">正在加载工作区...</Text>
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}
