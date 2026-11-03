import { useState } from "react";
import { isWeb, Separator, Switch } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
import { View } from "react-native";

export function SwitchExample() {
  const [checked, setChecked] = useState(false);
  const [checkedLeft, setCheckedLeft] = useState(false);
  const [checkedNative, setCheckedNative] = useState(false);
  const [checkedNativeLeft, setCheckedNativeLeft] = useState(false);
  const [checkedSize, setCheckedSize] = useState(false);
  return (
    <ExampleStack>
      <ExampleBlock description={checked ? "已开启" : "已关闭"} title="飞行模式">
        <Switch native={false} checked={checked} label="飞行模式" onCheckedChange={setChecked} />

        <Switch
          native={false}
          labelPosition="left"
          checked={checkedLeft}
          label="飞行模式"
          onCheckedChange={setCheckedLeft}
        />
        <Switch
          disabled
          native={false}
          labelPosition="left"
          checked={checkedLeft}
          label="飞行模式"
          onCheckedChange={setCheckedLeft}
        />

        {!isWeb() && (
          <>
            <Separator />
            <Switch
              native
              checked={checkedNative}
              label="飞行模式"
              onCheckedChange={setCheckedNative}
            />
            <Switch
              labelPosition="left"
              native
              checked={checkedNativeLeft}
              label="飞行模式"
              onCheckedChange={setCheckedNativeLeft}
            />
            <Switch
              disabled
              labelPosition="left"
              native
              checked={checkedNativeLeft}
              label="飞行模式"
              onCheckedChange={setCheckedNativeLeft}
            />
          </>
        )}
      </ExampleBlock>
      <ExampleBlock title="大小">
        <View
          style={{
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Switch
            size="2xl"
            native={false}
            checked={checkedSize}
            onCheckedChange={setCheckedSize}
          />
          <Switch size="xl" native={false} checked={checkedSize} onCheckedChange={setCheckedSize} />
          <Switch size="lg" native={false} checked={checkedSize} onCheckedChange={setCheckedSize} />
          <Switch size="md" native={false} checked={checkedSize} onCheckedChange={setCheckedSize} />
          <Switch size="sm" native={false} checked={checkedSize} onCheckedChange={setCheckedSize} />
          <Switch size="xs" native={false} checked={checkedSize} onCheckedChange={setCheckedSize} />
          <Switch
            size="2xs"
            native={false}
            checked={checkedSize}
            onCheckedChange={setCheckedSize}
          />
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}
