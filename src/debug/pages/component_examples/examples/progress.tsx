import { useState } from "react";

import { Button, Progress } from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function ProgressExample() {
  const [value, setValue] = useState(35);

  return (
    <ExampleStack>
      <ExampleBlock description={`文件上传：${value}%`} title="受控进度">
        <Progress max={100} value={value} width="100%" />
        <ExampleRow>
          <Button
            onPress={() => setValue((current) => Math.max(0, current - 10))}
            size="$3"
            variant="outlined"
          >
            -10
          </Button>
          <Button
            onPress={() => setValue((current) => Math.min(100, current + 10))}
            size="$3"
            variant="outlined"
          >
            +10
          </Button>
          <Button onPress={() => setValue(100)} size="$3" theme="green">
            完成
          </Button>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
