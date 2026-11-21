import { Surface, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function SurfaceExample() {
  return <ExampleStack><ExampleSection title="表面层级" description="按内容层级选用背景；Surface 不负责标题或页脚结构。">
    {([{ variant: "default", title: "基础表面", text: "用于主要内容区域。" }, { variant: "secondary", title: "次级表面", text: "用于嵌套或辅助区域。" }, { variant: "tertiary", title: "第三级表面", text: "进一步区分内容层级。" }, { variant: "transparent", title: "透明表面", text: "透出父容器的背景。" }] as const).map(item =>
      <Surface key={item.variant} variant={item.variant} className="gap-2 rounded-xl p-4"><Text weight="medium">{item.title}</Text><Text color="muted">{item.text}</Text></Surface>)}
  </ExampleSection></ExampleStack>;
}
