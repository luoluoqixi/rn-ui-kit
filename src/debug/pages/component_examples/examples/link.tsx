import { Link } from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function LinkExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="链接可用于正文内跳转和单独的帮助入口。" title="相关资源">
        <ExampleRow>
          <Link href="https://tamagui.dev" target="_blank">
            Tamagui 文档
          </Link>
          <Link href="https://reactnative.dev" target="_blank">
            React Native
          </Link>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
