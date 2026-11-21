import { useState } from "react";
import { Image } from "react-native";
import { PressableFeedback, Surface, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function PressableFeedbackExample() {
  const [count, setCount] = useState(0);
  return <ExampleStack>
    <ExampleSection title="图片卡片" description="按下缩小并高亮，松开恢复。">
      <PressableFeedback nativeHaptics feedback="highlight" accessibilityLabel="查看旅行计划" className="rounded-xl" onPress={() => setCount(count + 1)}>
        <Surface className="gap-3 rounded-xl p-4"><Image source={{ uri: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg" }} style={{ height: 140, borderRadius: 12 }} /><Text weight="medium">周末旅行计划</Text><Text color="muted">已查看 {count} 次</Text></Surface>
      </PressableFeedback>
    </ExampleSection>
    <ExampleSection title="反馈方式" description="相同内容可以采用缩放、高亮或涟漪反馈。">
      {(["none", "highlight", "ripple"] as const).map((feedback, index) => <PressableFeedback key={feedback} nativeHaptics feedback={feedback} accessibilityLabel={"反馈" + (index + 1)} className="rounded-xl" onPress={() => setCount(count + 1)}>
        <Surface variant="secondary" className="rounded-xl p-4"><Text>{["仅缩放", "缩放与高亮", "缩放与涟漪"][index]}</Text></Surface>
      </PressableFeedback>)}
    </ExampleSection>
    <ExampleSection title="禁用状态" description="禁用后不触发操作或按压反馈。"><PressableFeedback nativeHaptics isDisabled feedback="highlight" accessibilityLabel="已禁用"><Surface className="rounded-xl p-4"><Text color="muted">暂不可操作</Text></Surface></PressableFeedback></ExampleSection>
  </ExampleStack>;
}
