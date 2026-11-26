import { Bell, Check } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Avatar, Badge, Button, Icon, Text, type BadgeColor, type BadgePlacement, type BadgeVariant } from "rn-ui-kit/core";
import { ExampleRow, ExampleSection, ExampleStack } from "../shared";

const sizes = ["sm", "md", "lg"] as const;
const colors: BadgeColor[] = ["default", "accent", "success", "warning", "danger"];
const variants: BadgeVariant[] = ["primary", "secondary", "soft"];
const placements: BadgePlacement[] = ["top-right", "top-left", "bottom-right", "bottom-left"];
const rowStyle = { gap: 24, padding: 8 };

export function BadgeExample() {
  const [count, setCount] = useState(5);
  const [isHidden, setIsHidden] = useState(false);

  return (
    <ExampleStack>
      <ExampleSection title="数量、文字与图标">
        <ExampleRow style={rowStyle}>
          <Badge content={5} color="danger" size="sm" accessibilityLabel="5 条未读消息">
            <Avatar fallback="AB" alt="消息成员" />
          </Badge>
          <Badge content="New" color="accent" size="sm" accessibilityLabel="有新内容">
            <Avatar fallback="CD" alt="新成员" />
          </Badge>
          <Badge content="99+" color="danger" size="sm" accessibilityLabel="超过 99 条通知">
            <Icon as={Bell} size={32} />
          </Badge>
          <Badge content={<Icon as={Check} size={12} />} color="success" size="sm" accessibilityLabel="已验证">
            <Avatar fallback="EF" alt="已验证成员" />
          </Badge>
        </ExampleRow>
      </ExampleSection>
      <ExampleSection title="三种尺寸">
        <ExampleRow style={rowStyle}>
          {sizes.map(size => (
            <View key={size} className="items-center gap-3">
              <Badge content={5} size={size} color="danger"><Avatar size={size} fallback="UI" /></Badge>
              <Text className="text-xs text-muted">{size}</Text>
            </View>
          ))}
        </ExampleRow>
      </ExampleSection>
      <ExampleSection title="语义颜色">
        <ExampleRow style={rowStyle}>
          {colors.map(color => (
            <Badge key={color} content={5} color={color} size="sm"><Avatar fallback="UI" color={color} variant="soft" /></Badge>
          ))}
        </ExampleRow>
      </ExampleSection>
      <ExampleSection title="三种样式">
        <ExampleRow style={rowStyle}>
          {variants.map(variant => (
            <View key={variant} className="items-center gap-3">
              <Badge content={5} variant={variant} color="accent" size="sm"><Avatar fallback="UI" /></Badge>
              <Text className="text-xs text-muted">{variant}</Text>
            </View>
          ))}
        </ExampleRow>
      </ExampleSection>
      <ExampleSection title="四角定位">
        <ExampleRow style={rowStyle}>
          {placements.map(placement => (
            <View key={placement} className="items-center gap-3">
              <Badge content={5} placement={placement} color="accent" size="sm"><Avatar fallback="UI" /></Badge>
              <Text className="text-xs text-muted">{placement}</Text>
            </View>
          ))}
        </ExampleRow>
      </ExampleSection>
      <ExampleSection title="状态点">
        <Text className="text-sm text-muted">不传 content 时仅显示状态点，可用于在线状态或活动提示。</Text>
        <ExampleRow style={rowStyle}>
          {(["accent", "success", "warning", "danger"] as const).map(color => (
            <Badge key={color} color={color} placement="bottom-right" size="sm" accessibilityLabel={color === "success" ? "在线" : "状态提示"}>
              <Avatar fallback="UI" color={color} variant="soft" />
            </Badge>
          ))}
        </ExampleRow>
      </ExampleSection>
      <ExampleSection title="更新数量与隐藏角标">
        <Text className="text-sm text-muted">点按通知按钮增加数量；隐藏角标不会重置按钮或移除被标记的内容。</Text>
        <ExampleRow style={rowStyle}>
          <Badge content={count} isHidden={isHidden} size="sm" color="danger" accessibilityLabel={count + " 条通知"}>
            <Button native={false} title="通知 +1" onPress={() => setCount(value => value + 1)} />
          </Badge>
          <Button native={false} variant="secondary" title={isHidden ? "显示角标" : "隐藏角标"} onPress={() => setIsHidden(value => !value)} />
        </ExampleRow>
      </ExampleSection>
    </ExampleStack>
  );
}
