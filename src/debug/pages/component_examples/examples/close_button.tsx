import { useState } from "react";
import { ArrowLeft, CircleX, X } from "lucide-react-native";
import { CloseButton, Icon, Text } from "rn-ui-kit/core";
import { ExampleRow, ExampleSection, ExampleStack } from "../shared";
export function CloseButtonExample() {
  const [count, setCount] = useState(0);
  return <ExampleStack>
    <ExampleSection title="关闭操作" description="默认提供关闭图标与可访问名称。">
      <ExampleRow><CloseButton nativeHaptics onPress={() => setCount(count + 1)} /><Text>已操作 {count} 次</Text></ExampleRow>
    </ExampleSection>
    <ExampleSection title="自定义图标" description="使用主题语义色或替换为返回、清除等图标。">
      <ExampleRow>
        <CloseButton nativeHaptics accessibilityLabel="取消"><Icon as={X} color="danger" size={18} /></CloseButton>
        <CloseButton nativeHaptics accessibilityLabel="返回"><Icon as={ArrowLeft} size={18} /></CloseButton>
        <CloseButton nativeHaptics accessibilityLabel="清除"><Icon as={CircleX} size={20} /></CloseButton>
      </ExampleRow>
    </ExampleSection>
    <ExampleSection title="禁用状态" description="禁用后不响应点击。"><ExampleRow><CloseButton nativeHaptics /><CloseButton nativeHaptics isDisabled /></ExampleRow></ExampleSection>
  </ExampleStack>;
}
