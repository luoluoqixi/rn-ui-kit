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
    </ExampleStack>
  );
}
