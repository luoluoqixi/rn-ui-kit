import { Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function TextExample() {
  return <ExampleStack>
    <ExampleBlock title="标题" description="通过语义类型同时设置字号、行高和默认字重。">
      <Text type="h1">一级标题</Text><Text type="h2">二级标题</Text>
      <Text type="h3">三级标题</Text><Text type="h4">四级标题</Text>
      <Text type="h5">五级标题</Text><Text type="h6">六级标题</Text>
    </ExampleBlock>
    <ExampleBlock title="正文">
      <Text type="body">正文适合阅读较长的说明，使用主题中的标准字号与行高。</Text>
      <Text type="body-sm">较小正文适合说明信息和紧凑列表。</Text>
      <Text type="body-xs" color="muted">最小正文适合时间、备注等辅助信息。</Text>
    </ExampleBlock>
    <ExampleBlock title="字重与颜色">
      <Text weight="normal">常规字重</Text><Text weight="medium">中等字重</Text>
      <Text weight="semibold">半粗字重</Text><Text weight="bold">加粗字重</Text>
      <Text color="muted">弱化的辅助文字</Text>
    </ExampleBlock>
    <ExampleBlock title="对齐与截断">
      <Text align="start">起始对齐</Text><Text align="center">居中对齐</Text><Text align="end">末尾对齐</Text>
      <Text truncate>这是一段较长的文本，用来演示单行截断。在较窄的屏幕中，超出可用宽度的部分将显示省略号。</Text>
    </ExampleBlock>
    <ExampleBlock title="代码与内嵌文字">
      <Text type="code">bun run start</Text>
      <Text>正文中可以包含<Text weight="semibold" className="text-accent">强调文字</Text>，保持同一行阅读。</Text>
    </ExampleBlock>
  </ExampleStack>;
}
