import { useState } from "react";
import { Link, Text } from "rn-ui-kit/core";
import { ExampleRow, ExampleSection, ExampleStack } from "../shared";
export function LinkExample() {
  const [count, setCount] = useState(0);
  return (
    <ExampleStack>
      <ExampleSection
        title="条款与隐私"
        description="打开文档链接；浏览器保留标准链接行为。"
      >
        <ExampleRow>
          <Link href="https://reactnative.dev" target="_blank">
            React Native 文档
          </Link>
          <Link href="https://uniwind.dev" target="_blank">
            Uniwind 文档
          </Link>
        </ExampleRow>
      </ExampleSection>
      <ExampleSection title="尺寸">
        <ExampleRow>
          <Link size="sm" onPress={() => setCount(count + 1)}>
            小号
          </Link>
          <Link size="md" onPress={() => setCount(count + 1)}>
            默认
          </Link>
          <Link size="lg" onPress={() => setCount(count + 1)}>
            大号
          </Link>
        </ExampleRow>
        <Text color="muted">已触发 {count} 次</Text>
      </ExampleSection>
      <ExampleSection title="禁用状态">
        <Link href="https://reactnative.dev" isDisabled>
          暂不可访问
        </Link>
        <Link nativeHaptics onPress={() => setCount(count + 1)}>
          点击并触发触感反馈
        </Link>
      </ExampleSection>
    </ExampleStack>
  );
}
