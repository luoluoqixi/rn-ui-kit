import { Box, Layers, Minus, Plus, Sparkles, X } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
  ReduceMotion,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { Accordion, Icon, Switch, Text, type AccordionItemData } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";

// Keep the official demo forms, but explain each feature on our continuous page.
function toItems(
  data: { value: string; icon: typeof Layers; title: string; content: string }[],
): AccordionItemData[] {
  return data.map(({ icon, title, ...item }) => ({
    ...item,
    "aria-label": title,
    "title": (
      <View className="flex-1 flex-row items-center gap-3">
        <Icon as={icon} size={16} className="text-muted" />
        <Text className="min-w-0 flex-1 text-base">{title}</Text>
      </View>
    ),
  }));
}

const defaultItems = toItems([
  {
    value: "1",
    icon: Layers,
    title: "点按标题展开",
    content: "单选模式一次只展开一项，打开这一项时，其他已展开的内容会收起。",
  },
  {
    value: "2",
    icon: Box,
    title: "默认展开第二项",
    content:
      "通过 defaultValue 指定初始展开项。按住标题可观察 Native 默认样式的轻微缩放和底色反馈。",
  },
  {
    value: "3",
    icon: Minus,
    title: "再次点按即可收起",
    content: "默认允许收起当前项，也可以让所有内容都保持关闭。",
  },
]);
const surfaceItems = toItems([
  {
    value: "1",
    icon: Layers,
    title: "独立的内容容器",
    content: "surface 样式为整组条目提供背景与圆角，适合在页面上区分内容区域。",
  },
  {
    value: "2",
    icon: Sparkles,
    title: "随主题切换外观",
    content: "容器与文字使用语义主题颜色，可以切换明暗模式查看层级变化。",
  },
]);
const multipleItems = toItems([
  {
    value: "1",
    icon: Layers,
    title: "同时展开多项",
    content: "设置 selectionMode 为 multiple 后，打开其他项不会收起这一项。",
  },
  {
    value: "2",
    icon: Plus,
    title: "各项独立切换",
    content: "点按任意标题，只切换对应内容的展开状态。",
  },
  {
    value: "3",
    icon: Box,
    title: "设置多个初始展开项",
    content: "多选模式的 defaultValue 接收数组，这里默认展开第一项和第三项。",
  },
]);
const separatorItems = toItems([
  {
    value: "1",
    icon: Layers,
    title: "隐藏条目分隔线",
    content: "设置 hideSeparator 后，相邻条目之间不再显示横线。",
  },
  {
    value: "2",
    icon: Box,
    title: "用留白区分内容",
    content: "保留触发区与正文间距，让内容自然衔接。",
  },
  {
    value: "3",
    icon: Sparkles,
    title: "调整触发区圆角",
    content: "通过 triggerProps.className 设置圆角；在 Native 按住标题可以观察反馈区域。",
  },
]);
const indicatorItems = toItems([
  {
    value: "1",
    icon: Plus,
    title: "加号与减号切换",
    content: "收起时显示加号，展开后显示减号，并使用缩放动画切换图标。",
  },
  {
    value: "2",
    icon: Sparkles,
    title: "用状态定制指示器",
    content: "indicator 回调提供 isExpanded 等状态，不需要调用方组合底层组件。",
  },
]);
const enteringItems = toItems([
  { value: "1", icon: Layers, title: "从右侧进入", content: "展开时，正文从右侧滑入并逐渐显示。" },
  {
    value: "2",
    icon: Layers,
    title: "从左侧进入",
    content: "展开时，正文从左侧滑入，外层仍保留 Accordion 的高度过渡。",
  },
  {
    value: "3",
    icon: Sparkles,
    title: "缩放进入",
    content: "展开时，正文通过缩放和渐显进入；跟随系统的减少动态效果设置。",
  },
]);
const depthItems = toItems([
  {
    value: "1",
    icon: Layers,
    title: "突出当前展开项",
    content: "展开项保持原始大小，其余条目略微缩小，形成前后层级。",
  },
  {
    value: "2",
    icon: Box,
    title: "切换展开焦点",
    content: "点按其他条目后，展开状态与缩放效果一起切换。",
  },
  {
    value: "3",
    icon: Sparkles,
    title: "关闭景深效果",
    content: "关闭上方开关后，所有条目恢复原始大小，展开状态保持不变。",
  },
]);
// Reanimated can map this curve to both native and Web layout animations.
const indicatorEasing = Easing.bezier(0.42, 0, 0.58, 1);
const indicatorEntering = ZoomIn.duration(200)
  .easing(indicatorEasing)
  .reduceMotion(ReduceMotion.System);
const indicatorExiting = ZoomOut.duration(200)
  .easing(indicatorEasing)
  .reduceMotion(ReduceMotion.System);
const enteringAnimations = [FadeInRight, FadeInLeft, ZoomIn];
const webEnteringClasses = [
  "animate-in fade-in slide-in-from-right-4 motion-reduce:animate-none",
  "animate-in fade-in slide-in-from-left-4 motion-reduce:animate-none",
  "animate-in fade-in zoom-in-95 motion-reduce:animate-none",
];

function PlusIndicator({ isExpanded, close = false }: { isExpanded: boolean; close?: boolean }) {
  return (
    <Animated.View
      key={isExpanded ? "expanded" : "collapsed"}
      entering={indicatorEntering}
      exiting={indicatorExiting}
    >
      <Icon as={isExpanded ? (close ? X : Minus) : Plus} size={14} className="text-muted" />
    </Animated.View>
  );
}

function DepthExample() {
  const [value, setValue] = useState<string | undefined>("2");
  const [depth, setDepth] = useState(true);
  return (
    <>
      <Switch native={false} checked={depth} onCheckedChange={setDepth} label="景深效果" />
      <Accordion
        nativeHaptics
        value={value}
        onValueChange={setValue}
        hideSeparator
        className="overflow-visible"
        indicator={({ isExpanded }) => <PlusIndicator isExpanded={isExpanded} close />}
        triggerProps={{ className: "px-5" }}
        contentClassName="px-5"
        items={depthItems.map((item) => {
          const expanded = item.value === value;
          const scale = depth && !expanded ? 0.94 : 1;
          return {
            ...item,
            itemProps: {
              className: expanded ? "my-4 rounded-2xl bg-surface" : "rounded-2xl bg-surface",
              herouiNativeProps: {
                style: {
                  transform: [{ scale }],
                  transitionProperty: "transform",
                  transitionDuration: "200ms",
                },
              },
              herouiWebProps: {
                style: {
                  transform: "scale(" + scale + ")",
                  transition: "transform 200ms ease-out",
                },
              },
            },
          };
        })}
      />
    </>
  );
}

export function AccordionExample() {
  return (
    <ExampleStack>
      <ExampleSection title="默认样式">
        <Accordion nativeHaptics defaultValue="2" items={defaultItems} contentClassName="px-7" />
      </ExampleSection>
      <ExampleSection title="Surface 样式">
        <Accordion nativeHaptics variant="surface" items={surfaceItems} contentClassName="px-7" />
      </ExampleSection>
      <ExampleSection title="多项展开">
        <Accordion
          nativeHaptics
          selectionMode="multiple"
          variant="surface"
          defaultValue={["1", "3"]}
          items={multipleItems}
          contentClassName="px-7"
        />
      </ExampleSection>
      <ExampleSection title="无分隔线">
        <Accordion
          nativeHaptics
          hideSeparator
          items={separatorItems}
          triggerProps={{ className: "rounded-lg" }}
          contentClassName="px-7"
        />
      </ExampleSection>
      <ExampleSection title="自定义指示器">
        <Accordion
          nativeHaptics
          variant="surface"
          items={indicatorItems}
          contentClassName="px-7"
          indicator={({ isExpanded }) => <PlusIndicator isExpanded={isExpanded} />}
        />
      </ExampleSection>
      <ExampleSection title="自定义入场动画">
        <Accordion
          nativeHaptics
          variant="surface"
          items={enteringItems.map((item, index) => ({
            ...item,
            contentClassName: webEnteringClasses[index],
            contentProps: {
              herouiNativeProps: {
                animation: {
                  entering: {
                    value: enteringAnimations[index].delay(50).reduceMotion(ReduceMotion.System),
                  },
                },
              },
            },
          }))}
          contentClassName="px-7"
        />
      </ExampleSection>
      <ExampleSection title="景深效果">
        <DepthExample />
      </ExampleSection>
    </ExampleStack>
  );
}
