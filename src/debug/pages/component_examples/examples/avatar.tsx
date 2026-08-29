import { View } from "react-native";
import { Avatar } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function AvatarExample() {
  return (
    <ExampleStack>
      <ExampleBlock title="协作者">
        <ExampleRow>
          <Avatar alt="xs" fallback="X" size="xs" />
          <Avatar alt="sm" fallback="S" size="sm" />
          <Avatar alt="md" fallback="M" size="md" />
          <Avatar alt="lg" fallback="L" size="lg" />
          <Avatar alt="xl" fallback="X" size="xl" />
        </ExampleRow>
        <ExampleRow>
          <View>
            <Avatar
              alt="Ada Lovelace"
              className="size-16"
              fallback="AL"
              src="https://i.pravatar.cc/160?img=47"
            />
          </View>
          <View>
            <Avatar alt="React Native" className="size-12" fallback="RN" />
          </View>
          <View>
            <Avatar alt="UI Kit" className="size-10" fallback="UI" />
          </View>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
