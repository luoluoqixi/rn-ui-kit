import { useState } from "react";
import { Button, Icon, Text, type ButtonVariant } from "rn-ui-kit/core";
import { ArrowDownToLine, Heart, LoaderCircle, Mail, Plus, Trash2 } from "lucide-react-native";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

const variants: { variant: ButtonVariant; title: string }[] = [
  { variant: "primary", title: "主要操作" },
  { variant: "secondary", title: "次要操作" },
  { variant: "tertiary", title: "辅助操作" },
  { variant: "outline", title: "描边操作" },
  { variant: "ghost", title: "轻量操作" },
  { variant: "danger", title: "删除内容" },
  { variant: "danger-soft", title: "移除关联" },
];

export function ButtonExample() {
  const [count, setCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setCount((value) => value + 1);
      setSaving(false);
    }, 700);
  };
  return (
    <ExampleStack>
      <ExampleBlock title="操作层级">
        <ExampleRow>
          {variants.map(({ variant, title }) => (
            <Button
              key={variant}
              nativeHaptics
              variant={variant}
              title={title}
              onPress={() => setCount((value) => value + 1)}
            />
          ))}
        </ExampleRow>
        <Text className="text-muted">已完成 {count} 次操作</Text>
      </ExampleBlock>
      <ExampleBlock title="三档尺寸">
        <ExampleRow>
          <Button nativeHaptics size="sm" title="小按钮" />
          <Button nativeHaptics size="md" title="中按钮" />
          <Button nativeHaptics size="lg" title="大按钮" />
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="禁用与加载">
        <ExampleRow>
          <Button
            nativeHaptics
            onPress={save}
            loading={saving}
            title={saving ? "正在保存…" : "保存更改"}
          />
          <Button nativeHaptics loading variant="secondary" title="正在同步" />
          <Button nativeHaptics disabled title="暂无权限" />
          <Button nativeHaptics disabled variant="danger" title="暂不可删除" />
          <Button
            nativeHaptics
            loading
            loadingIcon={<Icon as={LoaderCircle} size="sm" />}
            title="自定义加载图标"
          />
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="图标与文字">
        <ExampleRow>
          <Button nativeHaptics>
            <Icon as={Plus} size="sm" />
            添加成员
          </Button>
          <Button nativeHaptics variant="secondary">
            下载文件
            <Icon as={ArrowDownToLine} size="sm" />
          </Button>
          <Button nativeHaptics variant="danger">
            <Icon as={Trash2} size="sm" />
            <Text>删除草稿</Text>
          </Button>
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="纯图标按钮">
        <ExampleRow>
          <Button nativeHaptics isIconOnly size="sm" accessibilityLabel="打开邮件">
            <Icon as={Mail} size="sm" />
          </Button>
          <Button nativeHaptics isIconOnly variant="secondary" circular accessibilityLabel="收藏">
            <Icon as={Heart} />
          </Button>
          <Button nativeHaptics isIconOnly size="lg" variant="danger" accessibilityLabel="删除">
            <Icon as={Trash2} />
          </Button>
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="宽度与自定义样式">
        <Button nativeHaptics className="w-full" title="占满可用宽度" />
        <ExampleRow>
          <Button nativeHaptics variant="outline" buttonSize={{ width: 160 }} title="指定宽度" />
          <Button
            nativeHaptics
            variant="ghost"
            buttonColor="#16a34a"
            textClassName="font-bold"
            title="自定义文字"
          />
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="系统原生按钮">
        <Text className="text-muted">
          iOS 使用 SwiftUI，Android 使用 Compose；Web 回退为通用按钮。
        </Text>
        <ExampleRow>
          <Button native nativeHaptics title="Native Button" />
          <Button
            native
            nativeHaptics
            nativeButtonStyle="glass"
            buttonSize={{ width: 150, height: 80 }}
            title="Native Button Size"
          />
          <Button
            native
            nativeHaptics
            nativeButtonStyle="glassProminent"
            nativeSystemImage="heart.fill"
            accessibilityLabel="系统收藏"
            title="收藏"
          />
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
