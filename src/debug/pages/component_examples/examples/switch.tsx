import { useState } from "react";
import { isWeb, Separator, Switch } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function SwitchExample() {
  const [checked, setChecked] = useState(false);
  const [checkedLeft, setCheckedLeft] = useState(false);
  const [checkedNative, setCheckedNative] = useState(false);
  const [checkedNativeLeft, setCheckedNativeLeft] = useState(false);
  return (
    <ExampleStack>
      <ExampleBlock description={checked ? "已开启" : "已关闭"} title="飞行模式">
        <Switch checked={checked} label="飞行模式" onCheckedChange={setChecked} />

        <Switch
          labelPosition="left"
          checked={checkedLeft}
          label="飞行模式"
          onCheckedChange={setCheckedLeft}
        />
        <Switch
          disabled
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
    </ExampleStack>
  );
}
