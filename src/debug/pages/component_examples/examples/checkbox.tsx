import { useState } from "react";
import { Check } from "lucide-react-native";
import { Checkbox, Icon, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function CheckboxExample() {
  const [selected, setSelected] = useState(false);
  return (
    <ExampleStack>
      <ExampleSection title="基本用法">
        <Checkbox
          label="接收产品更新"
          description="我们只会发送重要发布信息。"
          isSelected={selected}
          onSelectedChange={setSelected}
        />
        <Text color="muted">{selected ? "已订阅" : "未订阅"}</Text>
      </ExampleSection>
      <ExampleSection title="状态">
        <Checkbox label="已选中" defaultSelected />
        <Checkbox label="禁用" isDisabled />
        <Checkbox label="已选中并禁用" defaultSelected isDisabled />
        <Checkbox
          label="接受服务条款"
          isInvalid
          errorMessage="请先同意服务条款。"
        />
      </ExampleSection>
      <ExampleSection title="自定义指示器">
        <Checkbox
          label="圆形选框"
          controlProps={{ className: "rounded-full" }}
          indicator={({ isSelected }) =>
            isSelected ? (
              <Icon as={Check} size={12} className="text-accent-foreground" />
            ) : null
          }
          defaultSelected
        />
      </ExampleSection>
    </ExampleStack>
  );
}
