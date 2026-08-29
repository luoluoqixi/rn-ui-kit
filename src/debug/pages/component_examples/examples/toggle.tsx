import { useState } from "react";
import { Toggle } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
import { View } from "react-native";

export function ToggleExample() {
  const [enabled, setEnabled] = useState(false);
  const [enabled2xs, setEnabled2xs] = useState(false);
  const [enabledXs, setEnabledXs] = useState(false);
  const [enabledSm, setEnabledSm] = useState(false);
  const [enabledMd, setEnabledMd] = useState(false);
  const [enabledLg, setEnabledLg] = useState(false);
  const [enabledXl, setEnabledXl] = useState(false);
  const [enabled2xl, setEnabled2xl] = useState(false);

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
      <ExampleBlock title="大小">
        <View
          style={{
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Toggle
            size="2xs"
            pressed={enabled2xs}
            onPressedChange={setEnabled2xs}
            title="最小 Toggle"
            accessibilityLabel="2xs"
          />
          <Toggle
            size="xs"
            pressed={enabledXs}
            onPressedChange={setEnabledXs}
            title="超小 Toggle"
            accessibilityLabel="xs"
          />
          <Toggle
            size="sm"
            pressed={enabledSm}
            onPressedChange={setEnabledSm}
            title="小 Toggle"
            accessibilityLabel="sm"
          />
          <Toggle
            size="md"
            pressed={enabledMd}
            onPressedChange={setEnabledMd}
            title="正常 Toggle"
            accessibilityLabel="md"
          />
          <Toggle
            size="lg"
            pressed={enabledLg}
            onPressedChange={setEnabledLg}
            title="大 Toggle"
            accessibilityLabel="lg"
          />
          <Toggle
            size="xl"
            pressed={enabledXl}
            onPressedChange={setEnabledXl}
            title="超大 Toggle"
            accessibilityLabel="xl"
          />
          <Toggle
            size="2xl"
            pressed={enabled2xl}
            onPressedChange={setEnabled2xl}
            title="最大 Toggle"
            accessibilityLabel="2xl"
          />
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}
