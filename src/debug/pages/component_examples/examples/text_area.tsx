import { useState } from "react";

import { Button, TextArea } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function TextAreaExample() {
  const [value, setValue] = useState("这里可以输入多行内容。");

  return (
    <ExampleStack>
      <ExampleBlock
        description={`${value.length} 个字符，可用作草稿或备注。`}
        title="自动保存的备注"
      >
        <TextArea
          onChangeText={setValue}
          placeholder="写下说明…"
          rows={6}
          style={{ minHeight: 140 }}
          value={value}
        />
        <Button onPress={() => setValue("")} size="$3" variant="outlined">
          清空内容
        </Button>
      </ExampleBlock>
    </ExampleStack>
  );
}
