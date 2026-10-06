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
      <ExampleBlock title="大小">
        <Textarea size="2xs" placeholder="2xs" style={{ minHeight: 50, maxHeight: 50 }} />
        <Textarea size="xs" placeholder="2xs" style={{ minHeight: 50, maxHeight: 50 }} />
        <Textarea size="sm" placeholder="sm" style={{ minHeight: 50, maxHeight: 50 }} />
        <Textarea size="md" placeholder="md" style={{ minHeight: 50, maxHeight: 50 }} />
        <Textarea size="lg" placeholder="lg" style={{ minHeight: 55, maxHeight: 55 }} />
        <Textarea size="xl" placeholder="xl" style={{ minHeight: 60, maxHeight: 60 }} />
        <Textarea size="2xl" placeholder="2xl" style={{ minHeight: 80, maxHeight: 80 }} />
      </ExampleBlock>
    </ExampleStack>
  );
}
