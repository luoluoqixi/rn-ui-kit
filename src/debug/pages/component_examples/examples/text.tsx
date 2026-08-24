import { Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function TextExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="标题、段落、强调与辅助文案。" title="发布说明">
        <Text variant="h1">一级标题</Text>
        <Text variant="h3">三级标题</Text>
        <Text variant="p">
          Paragraph 适合较长的正文内容，并继承当前主题颜色。这里展示了完整的版本更新摘要。
        </Text>
        <Text className="font-semibold">普通 Text 可以自由组合字号和字重。</Text>
        <Text variant="muted">辅助说明文字</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
