import { useState } from "react";

import { RadioGroup, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function RadioGroupExample() {
  const [value, setValue] = useState("recent");

  return (
    <ExampleStack>
      <ExampleBlock description="用于互斥的列表排序条件。" title="排序规则">
        <RadioGroup
          items={[
            { label: "最近更新", value: "recent" },
            { label: "名称", value: "name" },
            { label: "大小", value: "size" },
          ]}
          onValueChange={setValue}
          value={value}
        />
        <Text opacity={0.6}>当前排序：{value}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
