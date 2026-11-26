import { useState } from "react";
import { ToggleGroup, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
const formats = [{ id: "bold", title: "粗体" }, { id: "italic", title: "斜体" }, { id: "underline", title: "下划线" }];
export function ToggleGroupExample() {
  const [selected, setSelected] = useState(new Set(["bold"]));
  return <ExampleStack>
    <ExampleSection title="多选格式" description="默认零间距，连接处显示短分割线；按下保留颜色反馈，不缩放。">
      <ToggleGroup nativeHaptics accessibilityLabel="文本格式" selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected} items={formats} />
      <Text color="muted">已选：{[...selected].join("、") || "无"}</Text>
    </ExampleSection>
    <ExampleSection title="单选与分离布局" description="间距设为 8 时，每项独立显示圆角并在按下时缩放；必须保留一个选项。">
      <ToggleGroup nativeHaptics accessibilityLabel="对齐方式" gap={8} disallowEmptySelection defaultSelectedKeys={["left"]}
        items={[{ id: "left", title: "左对齐" }, { id: "center", title: "居中" }, { id: "right", title: "右对齐" }]} />
    </ExampleSection>
    <ExampleSection title="自定义按压缩放" description="显式设置后，缩放行为不再随间距改变。">
      <Text color="muted">连接布局，开启缩放</Text>
      <ToggleGroup nativeHaptics accessibilityLabel="连接布局开启缩放" isScaleDisabled={false} items={formats} />
      <Text color="muted">分离布局，关闭缩放</Text>
      <ToggleGroup nativeHaptics accessibilityLabel="分离布局关闭缩放" gap={8} isScaleDisabled items={formats} />
    </ExampleSection>
    <ExampleSection title="尺寸" description="同组控件共享尺寸。">{(["sm", "md", "lg"] as const).map(size => <ToggleGroup key={size} nativeHaptics accessibilityLabel={size + "格式"} size={size} items={formats} />)}</ExampleSection>
    <ExampleSection title="纵向与禁用项" description="部分选项可以单独禁用。">
      <ToggleGroup nativeHaptics accessibilityLabel="视图模式" orientation="vertical" variant="ghost" items={[{ id: "list", title: "列表" }, { id: "grid", title: "网格", isDisabled: true }]} />
    </ExampleSection>
  </ExampleStack>;
}
