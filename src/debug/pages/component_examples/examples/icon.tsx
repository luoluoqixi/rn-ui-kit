import { Bell, Check, ChevronDown, Mail, Search, Settings } from "lucide-react-native";
import { Chip, Icon, Text } from "rn-ui-kit/core";
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
      <ExampleBlock title="三种尺寸">
        <ExampleRow>
          {(["sm", "md", "lg"] as const).map((size) => (
            <View key={size} className="items-center gap-2">
              <Icon as={Search} size={size} />
              <Text className="text-xs text-muted">{size}</Text>
            </View>
          ))}
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="自定义尺寸">
        <ExampleRow>
          <Icon as={Search} size={18} />
          <Icon as={Search} size={26} color="#8b5cf6" />
          <Icon as={Search} className="size-10" />
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="语义颜色">
        <ExampleRow>
          <Icon as={Search} color="foreground" />
          <Icon as={Search} color="muted" />
          <Icon as={Bell} color="accent" />
          <Icon as={Check} color="success" />
          <Icon as={Mail} color="warning" />
          <Icon as={Settings} color="danger" />
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="继承容器文字颜色">
        <Text className="text-sm text-muted">
          默认 color 为 inherit，跟随本库组件提供的文字前景色；显式指定 color 可以覆盖。
        </Text>
        <ExampleRow>
          <Chip icon={Bell} label="通知" />
          <Chip icon={Check} color="success" label="已完成" />
          <Chip icon={Mail} color="warning" variant="soft" label="待处理" />
          <Chip
            variant="soft"
            label="独立指定图标色"
            startContent={<Icon as={Bell} size={14} color="danger" />}
          />
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
