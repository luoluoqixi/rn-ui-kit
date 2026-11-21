import { useState } from "react";
import { Button, Spinner, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function SpinnerExample() {
  const [loading, setLoading] = useState(true);
  return <ExampleStack>
    <ExampleBlock title="尺寸"><ExampleRow>
      <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
    </ExampleRow></ExampleBlock>
    <ExampleBlock title="语义颜色"><ExampleRow>
      <Spinner /><Spinner color="success" /><Spinner color="warning" /><Spinner color="danger" />
    </ExampleRow></ExampleBlock>
    <ExampleBlock title="自定义颜色与尺寸"><ExampleRow>
      <Spinner color="#8b5cf6" size={18} /><Spinner color="#ec4899" size={26} /><Spinner color="#10b981" size={40} />
    </ExampleRow></ExampleBlock>
    <ExampleBlock title="加载状态" description="停止加载后卸载指示器，不继续播放动画。"><ExampleRow>
      <Spinner isLoading={loading} accessibilityLabel="正在保存" />
      <Text>{loading ? "正在保存…" : "保存已暂停"}</Text>
      <Button title={loading ? "停止加载" : "开始加载"} variant="outline" onPress={() => setLoading(v => !v)} />
    </ExampleRow></ExampleBlock>
  </ExampleStack>;
}
