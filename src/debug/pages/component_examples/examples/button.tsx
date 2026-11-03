import { useState } from "react";
import { Button, Icon, Text } from "rn-ui-kit/core";
import { LoaderCircle, Mail } from "lucide-react-native";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function ButtonExample() {
  const [count, setCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [nativeHaptics, setNativeHaptics] = useState(true);
  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setCount((current) => current + 1);
      setSaving(false);
    }, 700);
  };
  return (
    <ExampleStack>
      <ExampleBlock title="保存工作区">
        <ExampleRow>
          <Button nativeHaptics={nativeHaptics} onPress={save} loading={saving}>
            {saving ? "正在保存..." : "保存更改"}
          </Button>
          <Button
            nativeHaptics={nativeHaptics}
            disabled={saving}
            onPress={() => setCount(0)}
            variant="outline"
          >
            重置
          </Button>
          <Button
            nativeHaptics={nativeHaptics}
            onPress={() => setCount((current) => current + 1)}
            variant="ghost"
          >
            仅更新
          </Button>
        </ExampleRow>
        <Text className="text-muted-foreground">已完成 {count} 次保存</Text>
      </ExampleBlock>
      <ExampleBlock title="操作层级">
        <ExampleRow>
          <Button nativeHaptics>确认</Button>
          <Button nativeHaptics={nativeHaptics} variant="destructive">
            删除
          </Button>
          <Button nativeHaptics={nativeHaptics} variant="outline">
            次要操作
          </Button>
          <Button nativeHaptics={nativeHaptics} variant="secondary">
            辅助操作
          </Button>
          <Button disabled>不可用</Button>
          <Button variant="destructive" disabled>
            不可用
          </Button>
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="尺寸等级">
        <ExampleRow>
          <Button size="2xs">最小</Button>
          <Button size="xs">超小</Button>
          <Button size="sm">小</Button>
          <Button>中（默认）</Button>
          <Button size="lg">大</Button>
          <Button size="xl">超大</Button>
          <Button size="2xl">最大</Button>
          <Button variant="icon" aria-label="图标按钮">
            <Icon as={Mail} className="text-foreground" />
          </Button>
          <Button size="lg" variant="icon" aria-label="大图标按钮">
            <Icon as={Mail} className="text-foreground" />
          </Button>
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="扩展状态">
        <ExampleRow>
          <Button loading title="请稍候" />
          <Button
            loading
            loadingIcon={<Icon as={LoaderCircle} className="size-4 text-primary-foreground" />}
            title="自定义加载图标"
          />
          <Button nativeHaptics={nativeHaptics}>
            <Icon as={Mail} className="text-primary-foreground" />
            <Text>邮件登录</Text>
          </Button>
          <Button nativeHaptics={nativeHaptics} aria-label="打开邮件" variant="icon">
            <Icon as={Mail} className="text-foreground" />
          </Button>
          <Button nativeHaptics={nativeHaptics} title="Button Link" variant="link" />
          <Button nativeHaptics={nativeHaptics} native title="Native Button" />
          <Button
            native
            nativeHaptics={nativeHaptics}
            nativeButtonStyle="glass"
            buttonSize={{
              width: 150,
              height: 80,
            }}
            title="Native Button Size"
          />
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
