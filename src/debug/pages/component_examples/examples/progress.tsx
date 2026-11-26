import { useState } from "react";
import { Button, Progress } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function ProgressExample() {
  const [value, setValue] = useState(35);
  return <ExampleStack>
    <ExampleBlock title="上传进度" description="通过按钮更新进度，数值与进度条同步变化。">
      <Progress label="上传附件" value={value} showValueLabel color={value === 100 ? "success" : "accent"} />
      <ExampleRow>
        <Button onPress={() => setValue(v => Math.max(0, v - 10))} variant="outline" title="-10" />
        <Button onPress={() => setValue(v => Math.min(100, v + 10))} variant="outline" title="+10" />
        <Button onPress={() => setValue(100)} title="完成" />
      </ExampleRow>
    </ExampleBlock>
    <ExampleBlock title="尺寸">
      <Progress label="小尺寸" value={30} size="sm" />
      <Progress label="中尺寸" value={50} size="md" />
      <Progress label="大尺寸" value={70} size="lg" />
    </ExampleBlock>
    <ExampleBlock title="语义颜色">
      {(["default", "accent", "success", "warning", "danger"] as const).map(color => <Progress key={color} label={color} color={color} value={60} />)}
    </ExampleBlock>
    <ExampleBlock title="自定义范围" description="使用实际数量计算进度，显示文案可以独立设置。">
      <Progress label="同步文件" value={6} maxValue={8} valueLabel="6 / 8 个文件" showValueLabel />
    </ExampleBlock>
    <ExampleBlock title="不确定进度" description="任务总量未知时，展示持续运行的加载提示。">
      <Progress label="正在连接服务器" isIndeterminate />
    </ExampleBlock>
  </ExampleStack>;
}
