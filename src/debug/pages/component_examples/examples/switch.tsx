import { useState } from "react";

import { Switch } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function SwitchExample() {
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(false);

  return (
    <ExampleStack>
      <ExampleBlock description="开关适合即时生效的独立偏好。" title="同步设置">
        <Switch
          checked={syncEnabled}
          label="自动同步"
          labelPosition="end"
          onCheckedChange={setSyncEnabled}
        />
        <Switch
          checked={wifiOnly}
          disabled={!syncEnabled}
          label="仅 Wi-Fi 同步"
          labelPosition="end"
          onCheckedChange={setWifiOnly}
        />
        <Switch
          checked={wifiOnly}
          disabled={!syncEnabled}
          label="仅 Wi-Fi 同步（native=false）"
          labelPosition="end"
          onCheckedChange={setWifiOnly}
          native={false}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
