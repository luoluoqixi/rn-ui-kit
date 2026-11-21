import { useState } from "react";
import { View } from "react-native";
import { Avatar, Button, Skeleton, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function SkeletonExample() {
  const [loading, setLoading] = useState(true);
  return <ExampleStack>
    <ExampleBlock title="成员信息" description="占位结束后显示实际内容，内容自身控制尺寸和布局。">
      <View className="flex-row items-center gap-3">
        <Skeleton isLoading={loading} className="size-12 rounded-full"><Avatar fallback="UI" size="lg" /></Skeleton>
        <View className="flex-1 gap-2">
          <Skeleton isLoading={loading} className="h-5 w-32 rounded-md"><Text weight="semibold">设计团队</Text></Skeleton>
          <Skeleton isLoading={loading} className="h-4 w-48 rounded-md"><Text type="body-sm" color="muted">共享组件与设计资源</Text></Skeleton>
        </View>
      </View>
      <Button title={loading ? "显示内容" : "重新加载"} variant="outline" onPress={() => setLoading(v => !v)} />
    </ExampleBlock>
    <ExampleBlock title="动画类型">
      {(["shimmer", "pulse", "none"] as const).map(variant => <View key={variant} className="gap-2">
        <Text type="body-sm">{variant}</Text><Skeleton variant={variant} className="h-10 w-full rounded-lg" />
      </View>)}
    </ExampleBlock>
    <ExampleBlock title="形状"><ExampleRow>
      <Skeleton className="size-12 rounded-full" /><View className="flex-1 gap-2">
        <Skeleton className="h-4 w-full rounded-md" /><Skeleton className="h-4 w-2/3 rounded-md" />
      </View>
    </ExampleRow></ExampleBlock>
  </ExampleStack>;
}
