import { Bell, Check, ChevronDown, Mail, Search, Settings } from "lucide-react-native";
import { Icon, Text } from "rn-ui-kit/core";
import { View } from "react-native";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

const icons = [
  [Bell, "通知"],
  [Check, "完成"],
  [ChevronDown, "展开"],
  [Mail, "邮件"],
  [Search, "搜索"],
  [Settings, "设置"],
] as const;

export function IconExample() {
  return (
    <ExampleStack>
      <ExampleBlock title="图标">
        <ExampleRow>
          {icons.map(([icon, label]) => (
            <View className="items-center gap-1" key={label}>
              <Icon as={icon} />
              <Text className="text-center">{label}</Text>
            </View>
          ))}
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="尺寸与颜色">
        <ExampleRow>
          <Icon as={Search} className="size-4 text-muted-foreground" />
          <Icon as={Search} className="size-6 text-primary" />
          <Icon as={Search} className="size-8 text-destructive" />
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
