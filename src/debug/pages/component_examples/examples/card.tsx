import { ArrowUpRight, ShoppingBasket } from "lucide-react-native";
import { useState } from "react";
import { Image, ImageBackground, View } from "react-native";
import { withUniwind } from "uniwind";
import { Button, Card, Icon, Text, type CardVariant } from "rn-ui-kit/core";
import { ExampleRow, ExampleSection, ExampleStack } from "../shared";

const StyledImage = withUniwind(Image);
const assets = "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/";
const communities = [
  { title: "图片头部", description: "图片放在 header，正文放在 content。", footer: "自定义页脚", image: "demo1.jpg", dot: "bg-rose-400" },
  { title: "并排布局", description: "两张卡片平分宽度，文字自动换行。", footer: "状态与文字", image: "demo2.jpg", dot: "bg-emerald-400" },
];
const events = [
  { title: "横向排列", description: "左侧图片固定大小，右侧内容自适应。", image: "avocado.jpeg" },
  { title: "较长的标题也会自动换行", description: "正文与按钮在剩余宽度内排列。", image: "oranges.jpeg" },
];
const variants: { variant: CardVariant; title: string; description: string }[] = [
  { variant: "default", title: "Default", description: "默认卡片，适合大多数内容。" },
  { variant: "secondary", title: "Secondary", description: "使用第二层 surface 区分内容。" },
  { variant: "tertiary", title: "Tertiary", description: "使用第三层 surface 增加层次。" },
  { variant: "transparent", title: "Transparent", description: "透明背景，适合低强调或嵌套内容。" },
];

export function CardExample() {
  const [primaryActionDone, setPrimaryActionDone] = useState(false);
  const [secondarySelected, setSecondarySelected] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>();
  const [notify, setNotify] = useState(false);

  return (
    <ExampleStack>
      <ExampleSection title="基础卡片" withCard={false}>
        <Card
          header={<View className="gap-1"><Text className="text-lg font-medium text-pink-400">HEADER</Text><Text className="text-lg font-medium">标题与正文</Text></View>}
          content="通过 header、content 和 footer 组织内容，底部可直接传入操作按钮。"
          footer={
            <ExampleRow>
              <Button native={false} title={primaryActionDone ? "已执行" : "主要操作"} onPress={() => setPrimaryActionDone(true)} />
              <Button native={false} variant="ghost" onPress={() => setSecondarySelected(!secondarySelected)}>
                <Text>{secondarySelected ? "已切换" : "图标操作"}</Text><Icon as={ShoppingBasket} size={16} className="text-muted" />
              </Button>
            </ExampleRow>
          }
        />
      </ExampleSection>

      <ExampleSection title="图片卡片" withCard={false}>
        <View className="flex-row gap-4">
          {communities.map(community => (
            <Card key={community.title} className="min-w-0 flex-1"
              header={<StyledImage source={{ uri: assets + community.image }} accessibilityLabel={community.title} className="size-16 rounded-xl" />}
              content={<View className="gap-1"><Text className="text-sm font-medium">{community.title}</Text><Text className="text-sm text-muted">{community.description}</Text></View>}
              footer={<View className="min-w-0 flex-1 flex-row items-center gap-2"><View className={"size-2 shrink-0 rounded-full " + community.dot} /><Text className="min-w-0 flex-1 text-xs font-medium">{community.footer}</Text></View>}
            />
          ))}
        </View>
      </ExampleSection>

      <ExampleSection title="横向图片卡片" withCard={false}>
        {events.map(event => (
          <Card key={event.title} variant="tertiary"
            content={
              <View className="flex-row items-center gap-4">
                <StyledImage source={{ uri: assets + event.image }} accessibilityLabel={event.title} resizeMode="cover" className="size-24 rounded-2xl" />
                <View className="min-w-0 flex-1 gap-2">
                  <Text className="text-sm font-medium">{event.title}</Text>
                  <Text className="text-sm text-muted">{event.description}</Text>
                  <Button native={false} variant="link" className="h-auto min-w-0 justify-start p-0" onPress={() => setSelectedEvent(event.title)}>
                    <Text className="text-sm text-accent">{selectedEvent === event.title ? "已选择" : "点按操作"}</Text><Icon as={ArrowUpRight} size={14} className="text-accent" />
                  </Button>
                </View>
              </View>
            }
          />
        ))}
      </ExampleSection>

      <ExampleSection title="背景图片卡片" withCard={false}>
        <Card className="overflow-hidden p-0"
          content={
            <ImageBackground source={{ uri: assets + "neo2.jpeg" }} accessibilityLabel="Neo 家用机器人" resizeMode="cover" style={{ minHeight: 300, padding: 20 }}>
              <View pointerEvents="none" className="absolute inset-0 bg-black/40" />
              <View className="flex-1 justify-between gap-6">
                <View className="gap-1"><Text className="text-base font-medium text-white">背景上的文字</Text><Text className="text-base text-white">用遮罩保持文字清晰</Text></View>
                <View className="flex-row items-center justify-between gap-3">
                  <View className="min-w-0 flex-1"><Text className="text-white">底部操作区</Text><Text className="text-sm text-zinc-300">按钮可独立交互</Text></View>
                  <Button native={false} size="sm" className="bg-white" textClassName="text-black" title={notify ? "已开启" : "切换状态"} onPress={() => setNotify(!notify)} />
                </View>
              </View>
            </ImageBackground>
          }
        />
      </ExampleSection>

      <ExampleSection title="Variants" withCard={false}>
        {variants.map(({ variant, title, description }) => (
          <Card key={variant} variant={variant} title={title} description={description} className={variant === "transparent" ? "border border-border shadow-none" : undefined} />
        ))}
      </ExampleSection>
    </ExampleStack>
  );
}
