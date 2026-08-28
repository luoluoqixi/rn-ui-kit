import { useState } from "react";
import { Toggle } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function ToggleExample() {
  const [enabled, setEnabled] = useState(false);

  const onPressedChange = (pressed: boolean) => {
    setEnabled(pressed);
  };

  return (
    <ExampleStack>
      <ExampleBlock description={enabled ? "已启用" : "已关闭"} title="预览模式">
        <Toggle
          pressed={enabled}
          onPressedChange={onPressedChange}
          title="粗体"
          accessibilityLabel="切换粗体"
          className="self-center"
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
