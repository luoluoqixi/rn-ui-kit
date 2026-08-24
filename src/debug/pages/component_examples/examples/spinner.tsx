import { useState } from "react";

import { Button, Spinner, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function SpinnerExample() {
  const [visible, setVisible] = useState(true);

  return (
    <ExampleStack>
      <ExampleBlock title="加载中状态">
        <ExampleRow>
          {visible ? <Spinner size="large" /> : <Text>加载已暂停</Text>}
          <Button
            onPress={() => setVisible((current) => !current)}
            title={visible ? "停止加载" : "开始加载"}
            variant="outline"
          />
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
