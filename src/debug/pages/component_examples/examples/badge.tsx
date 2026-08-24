import { Badge } from "rn-ui-kit/core";
import { BadgeCheck } from "lucide-react-native";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function BadgeExample() {
  return (
    <ExampleStack>
      <ExampleBlock title="项目状态">
        <ExampleRow>
          <Badge label="稳定" />
          <Badge label="次要" variant="secondary" />
          <Badge label="阻塞" variant="destructive" />
          <Badge label="轮廓" variant="outline" />
        </ExampleRow>
        <ExampleRow>
          <Badge
            className="bg-blue-500 dark:bg-blue-600"
            icon={BadgeCheck}
            iconClassName="text-white"
            label="已验证"
            labelClassName="text-white"
            variant="secondary"
          />
          <Badge className="min-w-5 rounded-full px-1" label="8" />
          <Badge className="min-w-5 rounded-full px-1" label="99" variant="destructive" />
          <Badge className="min-w-5 rounded-full px-1" label="20+" variant="outline" />
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
