import { View } from "react-native";
import { ScrollShadow, Surface, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function ScrollShadowExample() {
  return <ExampleStack>
    <ExampleSection title="纵向滚动" description="滚动到中间时，两端渐隐提示还有更多内容。">
      <ScrollShadow className="h-56 rounded-xl" hideScrollBar><View className="gap-4 p-4">{Array.from({ length: 8 }, (_, index) => <View key={index} className="gap-1"><Text weight="medium">阅读片段 {index + 1}</Text><Text color="muted">继续向下浏览，边缘阴影会随滚动位置变化。</Text></View>)}</View></ScrollShadow>
    </ExampleSection>
    <ExampleSection title="横向滚动" description="横向内容超出容器时显示左右边缘效果。">
      <ScrollShadow orientation="horizontal" className="h-32" hideScrollBar><View className="flex-row gap-3 p-3">{Array.from({ length: 6 }, (_, index) => <Surface key={index} variant="secondary" className="h-24 w-40 shrink-0 justify-center rounded-xl p-4"><Text>灵感卡片 {index + 1}</Text></Surface>)}</View></ScrollShadow>
    </ExampleSection>
    <ExampleSection title="固定可见" description="也可以始终显示两端阴影。"><ScrollShadow visibility="both" size={24} className="h-28"><View className="p-6"><Text>无需溢出也展示边缘层次。</Text></View></ScrollShadow></ExampleSection>
  </ExampleStack>;
}
