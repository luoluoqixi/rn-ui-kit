import { useState } from "react";
import { Button, Textarea } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function TextAreaExample() {
  const [value, setValue] = useState("这里可以输入多行内容。");
  return (
    <ExampleStack>
      <ExampleBlock description={`${value.length} 个字符`} title="自动保存的备注">
        <Textarea
          onChangeText={setValue}
          placeholder="写下说明..."
          style={{ minHeight: 140, maxHeight: 160 }}
          value={value}
        />
        <Button onPress={() => setValue("")} variant="outline">
          清空内容
        </Button>
      </ExampleBlock>
    </ExampleStack>
  );
}
