import { Alert, Text } from "rn-ui-kit/core";
import { CheckCircle, TriangleAlert } from "lucide-react-native";
import { ExampleBlock, ExampleStack } from "../shared";

export function AlertExample() {
  return (
    <ExampleStack>
      <ExampleBlock>
        <Alert description="所有组件示例都已同步到最新版本。" icon={CheckCircle} title="同步完成" />
        <Alert
          description="此提示不会触发原生弹窗。"
          icon={TriangleAlert}
          title="需要注意"
          variant="destructive"
        />
      </ExampleBlock>
      <ExampleBlock title="大小">
        <Alert icon={CheckCircle} iconSize="2xs" title="最小 Icon" />
        <Alert icon={CheckCircle} iconSize="xs" title="超小 Icon" />
        <Alert icon={CheckCircle} iconSize="sm" title="小 Icon" />
        <Alert icon={CheckCircle} iconSize="md" title="正常 Icon" />
        <Alert icon={CheckCircle} iconSize="lg" title="大 Icon" />
        <Alert icon={CheckCircle} iconSize="xl" title="超大 Icon" />
        <Alert icon={CheckCircle} iconSize="2xl" title="最大 Icon" />
      </ExampleBlock>
    </ExampleStack>
  );
}
