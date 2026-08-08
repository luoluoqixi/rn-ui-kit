import { useState } from "react";

import { Checkbox } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function CheckboxExample() {
  const [permissions, setPermissions] = useState({ analytics: true, updates: false, weekly: true });
  const selectedCount = Object.values(permissions).filter(Boolean).length;

  return (
    <ExampleStack>
      <ExampleBlock description={`已启用 ${selectedCount}/3 项通知`} title="通知偏好">
        <Checkbox
          checked={permissions.updates}
          label="产品更新"
          onCheckedChange={(updates) =>
            setPermissions((current) => ({ ...current, updates: updates === true }))
          }
        />
        <Checkbox
          checked={permissions.weekly}
          label="每周摘要"
          onCheckedChange={(weekly) =>
            setPermissions((current) => ({ ...current, weekly: weekly === true }))
          }
        />
        <Checkbox
          checked={permissions.analytics}
          label="匿名使用分析"
          onCheckedChange={(analytics) =>
            setPermissions((current) => ({ ...current, analytics: analytics === true }))
          }
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
