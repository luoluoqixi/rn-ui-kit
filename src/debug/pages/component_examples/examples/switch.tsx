import { useState } from "react";
import { Check, X } from "lucide-react-native";
import { Icon, isWeb, Switch } from "rn-ui-kit/core";
import { ExampleRow, ExampleSection, ExampleStack } from "../shared";

export function SwitchExample() {
  const [selected, setSelected] = useState(true);
  const [nativeSelected, setNativeSelected] = useState(false);
  return <ExampleStack>
    <ExampleSection title="基础开关" description="点击开关或标签即可切换偏好。">
      <Switch native={false} nativeHaptics defaultSelected label="接收通知" description="及时获知项目中的重要动态。" />
      <Switch native={false} nativeHaptics label="自动更新" description="在空闲时下载最新内容。" labelPosition="left" />
    </ExampleSection>
    <ExampleSection title="禁用状态" description="禁用后保留当前状态，无法切换。">
      <Switch native={false} nativeHaptics isDisabled defaultSelected label="邮件通知" />
      <Switch native={false} nativeHaptics isDisabled label="推送通知" />
    </ExampleSection>
    <ExampleSection title="尺寸" description="三档尺寸共用同一个受控状态。">
      <ExampleRow>{(["sm", "md", "lg"] as const).map(size => <Switch key={size} native={false} nativeHaptics size={size}
        isSelected={selected} onSelectedChange={setSelected} label={size.toUpperCase()} />)}</ExampleRow>
    </ExampleSection>
    <ExampleSection title="自定义滑块" description="用图标直观显示当前开关状态。">
      <Switch native={false} nativeHaptics defaultSelected label="同步状态"
        thumbContent={({ isSelected }) => <Icon as={isSelected ? Check : X} size={12} color={isSelected ? "accent" : "muted"} />} />
    </ExampleSection>
    {!isWeb() && <ExampleSection title="系统原生开关" description="保留系统外观、原生触感和标签点击切换。">
      <Switch native nativeHaptics isSelected={nativeSelected} onSelectedChange={setNativeSelected} label="飞行模式" />
      <Switch native nativeHaptics defaultSelected labelPosition="left" label="后台同步" />
      <Switch native nativeHaptics isDisabled defaultSelected labelPosition="left" label="受管理的设置" />
    </ExampleSection>}
  </ExampleStack>;
}
