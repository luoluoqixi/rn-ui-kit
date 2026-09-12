import { useState } from "react";
import { Button, Input, Popover, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function PopoverExample() {
  const [name, setName] = useState("rn-ui-kit");
  return (
    <ExampleStack>
      <ExampleBlock title={`当前名称：${name}`}>
        <Popover
          content={
            <>
              <Text className="font-semibold">编辑名称</Text>
              <Input onChangeText={setName} value={name} />
            </>
          }
        >
          <Button variant="outline">打开 Popover</Button>
        </Popover>
      </ExampleBlock>
    </ExampleStack>
  );
}
