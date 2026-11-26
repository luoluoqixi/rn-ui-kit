import { useState } from "react";
import { View } from "react-native";
import { Button, Slider, Text, isWeb } from "rn-ui-kit/core";
import { ExampleRow, ExampleSection, ExampleStack } from "../shared";

export function SliderExample() {
  const [volume, setVolume] = useState(30);
  const [finished, setFinished] = useState(30);
  const [nativeValue, setNativeValue] = useState(56);
  const [nativeStep, setNativeStep] = useState(40);
  return <ExampleStack>
    <ExampleSection title="基础滑块" description={'拖动或点击轨道调节音量；结束值：' + finished}>
      <Slider native={false} nativeHaptics label="音量" value={volume} onChange={setVolume} onChangeEnd={setFinished} />
      <ExampleRow>
        <Button nativeHaptics title="静音" variant="secondary" onPress={() => setVolume(0)} />
        <Button nativeHaptics title="恢复" variant="secondary" onPress={() => setVolume(50)} />
        <Button nativeHaptics title="最大" variant="secondary" onPress={() => setVolume(100)} />
      </ExampleRow>
    </ExampleSection>
    <ExampleSection title="区间与数值格式" description="两个滑块限制可选区间，输出跟随数值格式。">
      <Slider native={false} nativeHaptics label="折扣范围" defaultValue={[0.2, 0.75]} minValue={0} maxValue={1} step={0.01} formatOptions={{ style: "percent" }} />
      <Slider native={false} nativeHaptics label="价格范围" defaultValue={[200, 800]} maxValue={1000} step={10} formatOptions={{ style: "currency", currency: "CNY", maximumFractionDigits: 0 }} />
      <Slider native={false} nativeHaptics label="舒适温度" defaultValue={[18, 24]} minValue={10} maxValue={35} formatOptions={{ style: "unit", unit: "celsius" }} />
    </ExampleSection>
    <ExampleSection title="竖向滑块" description="从下往上调节；竖向模式使用自绘实现。">
      <View className="h-48 flex-row items-center justify-around gap-8 px-4">
        {[30, 50, 70].map((value, i) => <Slider key={i} native={false} nativeHaptics orientation="vertical"
          accessibilityLabel={'均衡器 ' + (i + 1)} defaultValue={value} />)}
      </View>
    </ExampleSection>
    <ExampleSection title="自定义轨道" description="按场景调整轨道颜色和粗细。">
      <Slider native={false} nativeHaptics label="电量目标" defaultValue={65}
        className="[--accent:var(--success)] [--accent-foreground:var(--success-foreground)]"
        trackProps={{ className: "h-3 bg-success/10" }} fillProps={{ className: "bg-success" }}
        thumbProps={{ className: "bg-success", herouiWebProps: { style: { backgroundColor: "transparent" } }, herouiNativeProps: { classNames: { thumbKnob: "bg-success-foreground" } } }} />
      <Slider native={false} nativeHaptics label="提醒强度" defaultValue={40}
        className="[--accent:var(--warning)] [--accent-foreground:var(--warning-foreground)]"
        trackProps={{ className: "h-1 bg-warning/15" }} fillProps={{ className: "bg-warning" }}
        thumbProps={{ className: "bg-warning", herouiWebProps: { style: { backgroundColor: "transparent" } } }} />
    </ExampleSection>
    <ExampleSection title="禁用状态" description="暂时不可调整的设置保留当前值。">
      <Slider native={false} nativeHaptics label="锁定音量" defaultValue={40} isDisabled />
    </ExampleSection>
    {!isWeb() && <ExampleSection title="系统原生滑块" description="保留连续拖动、步进、触感和外部更新。">
      <Slider native nativeHaptics label="连续值" step={0} value={nativeValue} onChange={setNativeValue} formatOptions={{ maximumFractionDigits: 2 }} />
      <Slider native nativeHaptics label="步进值" step={1} value={nativeStep} onChange={setNativeStep} />
      <Text color="muted">原生连续值：{nativeValue.toFixed(2)}</Text>
      <ExampleRow>
        <Button nativeHaptics title="最小" variant="outline" onPress={() => setNativeValue(0)} />
        <Button nativeHaptics title="默认" variant="outline" onPress={() => setNativeValue(50)} />
        <Button nativeHaptics title="最大" variant="outline" onPress={() => setNativeValue(100)} />
      </ExampleRow>
    </ExampleSection>}
  </ExampleStack>;
}
