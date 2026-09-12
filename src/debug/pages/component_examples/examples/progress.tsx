import { useState } from "react";
import { Button, Progress, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function ProgressExample() {
  const [value, setValue] = useState(35);
  return (
    <ExampleStack>
      <ExampleBlock title="受控进度">
        <Progress max={100} value={value} />
        <ExampleRow>
          <Button onPress={() => setValue((v) => Math.max(0, v - 10))} variant="outline">
            -10
          </Button>
          <Button onPress={() => setValue((v) => Math.min(100, v + 10))} variant="outline">
            +10
          </Button>
          <Button onPress={() => setValue(100)}>完成</Button>
        </ExampleRow>
        <Text>{value === 100 ? "上传完成" : "正在上传..."}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
