import { StyleSheet, View } from "react-native";
import { Avatar, Card, H1, H3, Image, Link, Paragraph, Separator, Text } from "rn_ui_kit";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
import type { ComponentExampleDefinition } from "../types";

function AvatarExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="在成员列表中混合展示远程头像、缩写 fallback 和不同尺寸。" title="协作者">
        <View style={styles.avatarRow}>
          <Avatar alt="Ada Lovelace" fallback="AL" size="$6" src="https://i.pravatar.cc/160?img=47" />
          <Avatar fallback="RN" size="$6" />
          <Avatar fallback="UI" size="$5" />
          <Avatar fallback="KIT" size="$4" />
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}

function TextExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="标题、段落、强调与辅助文案组合成一段可阅读的内容。" title="发布说明">
        <H1>一级标题</H1>
        <H3>三级标题</H3>
        <Paragraph>Paragraph 适合较长的正文内容，并继承当前主题颜色。这里展示了一个完整的版本更新摘要。</Paragraph>
        <Text fontWeight="600">普通 Text 可以自由组合字号和字重。</Text>
        <Text opacity={0.6}>辅助说明文字</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function ImageExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="使用 cover、固定容器、圆角和替代文本组成内容预览。" title="文章封面">
        <View style={styles.imageHost}>
          <Image
            alt="组件示例图片"
            borderRadius={16}
            height={220}
            objectFit="cover"
            src="https://picsum.photos/640/440"
            width="100%"
          />
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}

function CardExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="默认 API 可以统一标题、说明、正文与 footer 的节奏。" title="项目摘要">
        <Card
          description="上次同步于今天 10:42，包含 12 个组件示例。"
          footer={<ExampleRow><Text opacity={0.6}>2 位协作者</Text><Link href="https://tamagui.dev" target="_blank">查看详情</Link></ExampleRow>}
          title="rn_ui_kit 调试工作区"
        >
          <Text>这里是 Card 的正文区域，可放置项目摘要、状态和后续操作。</Text>
        </Card>
      </ExampleBlock>
    </ExampleStack>
  );
}

function SeparatorExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="水平分隔内容区块，垂直分隔并列信息。" title="内容层级">
        <Text>上方内容</Text>
        <Separator />
        <Text>下方内容</Text>
        <View style={styles.verticalSeparatorRow}>
          <Text>左侧</Text>
          <Separator vertical />
          <Text>右侧</Text>
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}

function LinkExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="链接可用于正文内跳转和单独的帮助入口。" title="相关资源">
        <ExampleRow>
          <Link href="https://tamagui.dev" target="_blank">Tamagui 文档</Link>
          <Link href="https://reactnative.dev" target="_blank">React Native</Link>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}

export const displayExamples = [
  {
    Component: AvatarExample,
    description: "远程头像、fallback 和尺寸组合。",
    group: "内容展示",
    key: "avatar",
    label: "Avatar",
  },
  {
    Component: TextExample,
    description: "完整的标题、正文、强调与辅助文案层级。",
    group: "内容展示",
    key: "text",
    label: "Text",
  },
  {
    Component: ImageExample,
    description: "带替代文本和裁切方式的远程图片。",
    group: "内容展示",
    key: "image",
    label: "Image",
  },
  {
    Component: CardExample,
    description: "标题、说明、正文与 footer 的项目摘要。",
    group: "内容展示",
    key: "card",
    label: "Card",
  },
  {
    Component: SeparatorExample,
    description: "内容区块与并列信息的分隔线。",
    group: "内容展示",
    key: "separator",
    label: "Separator",
  },
  {
    Component: LinkExample,
    description: "多资源的外部链接入口。",
    group: "内容展示",
    key: "link",
    label: "Link",
  },
] satisfies ComponentExampleDefinition[];

const styles = StyleSheet.create({
  avatarRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 16 },
  imageHost: { alignSelf: "center", width: "100%" },
  verticalSeparatorRow: { alignItems: "center", flexDirection: "row", gap: 12, height: 40 },
});
