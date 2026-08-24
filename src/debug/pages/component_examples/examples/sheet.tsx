import { useState } from "react";
import { View } from "react-native";

import { Button, NativeSheet, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function SheetExample() {
  const [detentsOpen, setDetentsOpen] = useState(false);
  const [percentOpen, setPercentOpen] = useState(false);
  const [percentPosition, setPercentPosition] = useState(0);
  const [nestedOpen, setNestedOpen] = useState(false);
  const [nestedInnerOpen, setNestedInnerOpen] = useState(false);
  const [nestedPosition, setNestedPosition] = useState(0);

  return (
    <ExampleStack>
      <ExampleBlock description="detents={[0.4, 0.6, 1]}" title="TrueSheet detents">
        <Button onPress={() => setDetentsOpen(true)}>打开多档 detents</Button>
      </ExampleBlock>

      <ExampleBlock description='snapPoints={["40%", "65%", "90%"]}' title="百分比 snapPoints">
        <ExampleRow>
          <Button onPress={() => setPercentPosition(0)} variant="outline">
            40%
          </Button>
          <Button onPress={() => setPercentPosition(1)} variant="outline">
            65%
          </Button>
          <Button onPress={() => setPercentPosition(2)} variant="outline">
            90%
          </Button>
        </ExampleRow>
        <ExampleRow>
          <Button className="w-full" onPress={() => setPercentOpen(true)}>
            打开百分比 Sheet
          </Button>
        </ExampleRow>
      </ExampleBlock>

      <ExampleBlock description="detents={[0.4, 0.85]}" title="嵌套 TrueSheet">
        <Button onPress={() => setNestedOpen(true)}>打开嵌套 Sheet</Button>
      </ExampleBlock>

      <NativeSheet detents={[0.4, 0.6, 1]} handle onOpenChange={setDetentsOpen} open={detentsOpen}>
        <View className="gap-3 p-5">
          <Text className="font-semibold">多档 detents</Text>
          <Text variant="muted">多档 detents [0.4, 0.6, 1]</Text>
          <Button onPress={() => setDetentsOpen(false)} variant="outline">
            关闭
          </Button>
        </View>
      </NativeSheet>

      <NativeSheet
        handle
        onOpenChange={setPercentOpen}
        onSnapPointChange={setPercentPosition}
        open={percentOpen}
        position={percentPosition}
        snapPoints={["40%", "65%", "90%"]}
      >
        <View className="gap-3 p-5">
          <Text className="font-semibold">百分比 snapPoints</Text>
          <Text variant="muted">当前档位：{["40%", "65%", "90%"][percentPosition]}</Text>
          <ExampleRow>
            <Button onPress={() => setPercentPosition(0)} variant="outline">
              40%
            </Button>
            <Button onPress={() => setPercentPosition(1)} variant="outline">
              65%
            </Button>
            <Button onPress={() => setPercentPosition(2)} variant="outline">
              90%
            </Button>
          </ExampleRow>
          <Button onPress={() => setPercentOpen(false)} variant="outline">
            关闭
          </Button>
        </View>
      </NativeSheet>

      <NativeSheet
        detents={[0.4, 0.85]}
        handle
        onOpenChange={setNestedOpen}
        onSnapPointChange={setNestedPosition}
        open={nestedOpen}
        position={nestedPosition}
      >
        <View className="gap-3 p-5">
          <Text className="font-semibold">外层 Sheet</Text>
          <Text variant="muted">可以继续打开内层 Sheet。detents=&#123;[0.4, 0.8]&#125;</Text>
          <Button onPress={() => setNestedOpen(false)} variant="outline">
            关闭外层
          </Button>
          <Button onPress={() => setNestedInnerOpen(true)}>打开内层 Sheet</Button>
        </View>
      </NativeSheet>

      <NativeSheet
        detents={[0.4, 0.8]}
        handle
        onOpenChange={setNestedInnerOpen}
        open={nestedInnerOpen}
      >
        <View className="gap-3 p-5">
          <Text className="font-semibold">内层 Sheet</Text>
          <Text variant="muted">这是从外层 Sheet 中打开的嵌套 Sheet。</Text>
          <Button onPress={() => setNestedInnerOpen(false)} variant="outline">
            关闭内层
          </Button>
        </View>
      </NativeSheet>
    </ExampleStack>
  );
}
