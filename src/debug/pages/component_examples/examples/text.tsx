import { H1, H3, Paragraph, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function TextExample() {
  return (
    <ExampleStack>
      <ExampleBlock
        description="标题、段落、强调与辅助文案组合成一段可阅读的内容。"
        title="发布说明"
      >
        <H1>一级标题</H1>
        <H3>三级标题</H3>
        <Paragraph>
          Paragraph 适合较长的正文内容，并继承当前主题颜色。这里展示了一个完整的版本更新摘要。
        </Paragraph>
        <Text fontWeight="600">普通 Text 可以自由组合字号和字重。</Text>
        <Text opacity={0.6}>辅助说明文字</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
