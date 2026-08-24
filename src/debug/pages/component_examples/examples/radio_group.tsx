import { useState } from "react";
import { RadioGroup, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function RadioGroupExample() {
  const [value, setValue] = useState("recent");
  const onValueChange = (nextValue: string) => {
    setValue(nextValue);
  };

  return (
    <ExampleStack>
      <ExampleBlock title="排序规则">
        <RadioGroup
          items={[
            { value: "recent", label: "最近更新" },
            { value: "name", label: "名称" },
            { value: "size", label: "大小" },
          ]}
          onValueChange={onValueChange}
          value={value}
        />
        <Text className="text-muted-foreground">当前排序：{value}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
