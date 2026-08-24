import { Link } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function LinkExample() {
  return (
    <ExampleStack>
      <ExampleBlock title="Link">
        <ExampleRow style={{ gap: 0 }}>
          <Link href="https://reactnative.dev">React Native</Link>
          <Link href="https://uniwind.dev">Uniwind</Link>
          <Link nativeHaptics>点击震动</Link>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
