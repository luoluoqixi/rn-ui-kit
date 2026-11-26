import { useState } from "react";
import { Bold, Heart } from "lucide-react-native";
import { Icon, Text, Toggle } from "rn-ui-kit/core";
import { ExampleRow, ExampleSection, ExampleStack } from "../shared";
export function ToggleExample() {
  const [selected, setSelected] = useState(false);
  return <ExampleStack>
    <ExampleSection title="基础切换" description="再次点击可取消选中。">
      <ExampleRow><Toggle nativeHaptics title="粗体" isSelected={selected} onSelectedChange={setSelected} /><Text>{selected ? "已启用" : "未启用"}</Text></ExampleRow>
    </ExampleSection>
    <ExampleSection title="外观与图标" description="默认与轻量外观都保留明确的选中态。"><ExampleRow>
      <Toggle nativeHaptics defaultSelected title="收藏" />
      <Toggle nativeHaptics variant="ghost" isIconOnly accessibilityLabel="喜欢"><Icon as={Heart} size={18} /></Toggle>
      <Toggle nativeHaptics isIconOnly accessibilityLabel="加粗"><Icon as={Bold} size={18} /></Toggle>
    </ExampleRow></ExampleSection>
    <ExampleSection title="尺寸" description="三档尺寸沿用按钮的设计尺度。"><ExampleRow>{(["sm", "md", "lg"] as const).map(size => <Toggle key={size} nativeHaptics size={size} title={size.toUpperCase()} />)}</ExampleRow></ExampleSection>
    <ExampleSection title="禁用状态"><ExampleRow><Toggle nativeHaptics isDisabled title="不可切换" /><Toggle nativeHaptics isDisabled defaultSelected title="保持选中" /></ExampleRow></ExampleSection>
  </ExampleStack>;
}
