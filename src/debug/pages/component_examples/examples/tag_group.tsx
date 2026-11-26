import { useState } from "react";
import { Globe, Newspaper, Rocket } from "lucide-react-native";
import { Button, Icon, TagGroup } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
const categories = [
  { id: "news", title: "资讯", startContent: <Icon as={Newspaper} size={14} /> },
  { id: "travel", title: "旅行", startContent: <Icon as={Globe} size={14} /> },
  { id: "games", title: "游戏", startContent: <Icon as={Rocket} size={14} /> },
];
export function TagGroupExample() {
  const [tags, setTags] = useState(categories);
  const [selected, setSelected] = useState(new Set(["news"]));
  return <ExampleStack>
    <ExampleSection title="分类选择" description="选择一个感兴趣的分类，再次点击可取消。"><TagGroup nativeHaptics label="分类" selectionMode="single" items={categories} /></ExampleSection>
    <ExampleSection title="多选与尺寸" description="多个兴趣标签可同时选中。">{(["sm", "md", "lg"] as const).map(size => <TagGroup key={size} nativeHaptics accessibilityLabel={size + "兴趣"} size={size} selectionMode="multiple" defaultSelectedKeys={["travel"]} items={categories} />)}</ExampleSection>
    <ExampleSection title="容器外观" description="标签可以使用更轻的表面背景。"><TagGroup nativeHaptics variant="surface" selectionMode="single" accessibilityLabel="外观示例" items={categories} /></ExampleSection>
    <ExampleSection title="禁用与校验" description="选中至少两个分类可解除错误提示。">
      <TagGroup nativeHaptics label="内容偏好" selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}
        isInvalid={selected.size < 2} errorMessage="请至少选择两个分类。" description="所选分类将用于推荐。" items={categories} />
      <TagGroup nativeHaptics accessibilityLabel="禁用分类" selectionMode="multiple" disabledKeys={["travel"]} items={categories} />
    </ExampleSection>
    <ExampleSection title="移除标签" description="使用关闭按钮移除，全部移除后显示空状态。">
      <TagGroup nativeHaptics accessibilityLabel="可移除分类" items={tags} onRemove={keys => setTags(current => current.filter(item => !keys.has(item.id)))} emptyContent="暂未添加分类" />
      <Button nativeHaptics variant="ghost" size="sm" title="重置标签" onPress={() => setTags(categories)} />
    </ExampleSection>
  </ExampleStack>;
}
