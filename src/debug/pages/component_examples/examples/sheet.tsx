import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  Button,
  NativeList,
  NativeListButtonItem,
  NativeListNavigationItem,
  NativeListSection,
  NativeSheet,
  NativeSheetStack,
  Text,
  getNativeStackScrollEdgeHeaderOptions,
  useAppBackgroundColors,
} from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

type SheetStackParamList = {
  index: undefined;
  details: undefined;
};

function SheetStackIndexScreen() {
  const navigation = useNavigation<NavigationProp<SheetStackParamList>>();

  return (
    <NativeList style={styles.stackList} tracksNavigationBarScrollEdge>
      <NativeListSection footer="点击后会在当前 Sheet 内推入新的 Stack 页面。" title="导航">
        <NativeListNavigationItem
          onPress={() => navigation.navigate("details")}
          subtitle="演示 Stack 的前进与返回"
          title="打开详情页"
        />
      </NativeListSection>
    </NativeList>
  );
}

function SheetStackDetailsScreen({ onClose }: { onClose: () => void }) {
  return (
    <NativeList style={styles.stackList} tracksNavigationBarScrollEdge>
      <NativeListSection footer="可使用导航栏返回按钮回到上一页。" title="详情">
        <NativeListButtonItem onPress={onClose} title="关闭 Stack Sheet" />
      </NativeListSection>
    </NativeList>
  );
}

export function SheetExample() {
  const appBackgroundColors = useAppBackgroundColors();
  const [detentsOpen, setDetentsOpen] = useState(false);
  const [percentOpen, setPercentOpen] = useState(false);
  const [percentPosition, setPercentPosition] = useState(0);
  const [nestedOpen, setNestedOpen] = useState(false);
  const [nestedInnerOpen, setNestedInnerOpen] = useState(false);
  const [nestedPosition, setNestedPosition] = useState(0);
  const [stackOpen, setStackOpen] = useState(false);

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

      <ExampleBlock
        description="iOS 使用原生 Header item，Android/Web 使用 React Button"
        title="Stack TrueSheet"
      >
        <Button onPress={() => setStackOpen(true)}>打开Stack Sheet</Button>
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

      <NativeSheetStack
        initialRouteName="index"
        name="rn-ui-kit-sheet-example-stack"
        onOpenChange={setStackOpen}
        open={stackOpen}
        headerRightButtonProps={{
          accessibilityLabel: "关闭 Stack Sheet",
          label: "关闭",
        }}
        screenOptions={getNativeStackScrollEdgeHeaderOptions({
          headerBackgroundColor: appBackgroundColors.header,
          screenBackgroundColor: appBackgroundColors.sheet,
        })}
        sheetProps={{
          snapPoints: ["70%"],
        }}
      >
        <NativeSheetStack.Screen name="index" options={{ title: "Stack Sheet" }}>
          {() => <SheetStackIndexScreen />}
        </NativeSheetStack.Screen>
        <NativeSheetStack.Screen name="details" options={{ title: "详情" }}>
          {() => <SheetStackDetailsScreen onClose={() => setStackOpen(false)} />}
        </NativeSheetStack.Screen>
      </NativeSheetStack>
    </ExampleStack>
  );
}

const styles = StyleSheet.create({
  stackList: {
    flex: 1,
  },
});
