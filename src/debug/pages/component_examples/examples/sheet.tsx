import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import {
  Button,
  NativeList,
  NativeListButtonItem,
  NativeListNavigationItem,
  NativeListSection,
  NativeSheet,
  NativeSheetStack,
  NativeSheetScrollContent,
  Text,
  getNativeStackScrollEdgeHeaderOptions,
  useAppBackgroundColors,
} from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

type SheetStackParamList = {
  index: undefined;
  details: undefined;
  scroll: undefined;
  short: undefined;
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
        <NativeListNavigationItem
          onPress={() => navigation.navigate("scroll")}
          title="RN 长列表绑定"
          subtitle="切页后验证右侧滚动与到顶下拉"
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

function SheetStackScrollScreen({ short = false }: { short?: boolean }) {
  const navigation = useNavigation<NavigationProp<SheetStackParamList>>();
  return (
    <NativeSheetScrollContent contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text>当前绑定页面：{short ? "短列表" : "长列表"}</Text>
      <Button onPress={() => navigation.navigate(short ? "scroll" : "short")}>
        切换长短列表页面
      </Button>
      <TextInput
        accessibilityLabel="Stack 键盘回归输入框"
        placeholder="输入后收起键盘，再返回上一页"
        style={{ borderWidth: 1, padding: 12 }}
      />
      {Array.from({ length: short ? 2 : 45 }, (_, i) => (
        <Text key={i}>滚动测试行 {i + 1} — 从屏幕右侧滑动</Text>
      ))}
    </NativeSheetScrollContent>
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
  const [autoOpen, setAutoOpen] = useState(false);
  const [autoRows, setAutoRows] = useState(3);
  const [footerRelative, setFooterRelative] = useState(false);
  const [autoPosition, setAutoPosition] = useState(0);
  const [autoStack, setAutoStack] = useState(false);
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
        <Button
          onPress={() => {
            setAutoStack(false);
            setStackOpen(true);
          }}
        >
          打开Stack Sheet
        </Button>
        <Button
          onPress={() => {
            setAutoStack(true);
            setStackOpen(true);
          }}
        >
          打开 auto Stack Sheet
        </Button>
      </ExampleBlock>

      <ExampleBlock description="auto / 固定档位、动态高度、键盘和 Footer" title="v4 布局回归">
        <Button onPress={() => setAutoOpen(true)}>打开 auto 回归 Sheet</Button>
      </ExampleBlock>
      <NativeSheet
        name="true-sheet-v4-auto-regression"
        open={autoOpen}
        onOpenChange={setAutoOpen}
        detents={["auto", 0.85]}
        position={autoPosition}
        onSnapPointChange={setAutoPosition}
        handle
        footerOptions={{ position: footerRelative ? "relative" : "absolute" }}
        footer={
          <View style={{ padding: 12 }}>
            <Text>Footer：{footerRelative ? "relative" : "absolute"}</Text>
          </View>
        }
      >
        <NativeSheetScrollContent contentContainerStyle={{ padding: 20, gap: 12 }}>
          <Text>
            动态行数：{autoRows}，档位：{autoPosition}
          </Text>
          <ExampleRow>
            <Button onPress={() => setAutoRows((v) => (v === 3 ? 30 : 3))}>长 / 短内容</Button>
            <Button onPress={() => setAutoPosition((v) => (v === 0 ? 1 : 0))}>切换档位</Button>
          </ExampleRow>
          <Button onPress={() => setFooterRelative((v) => !v)}>切换 Footer 定位</Button>
          <TextInput
            accessibilityLabel="auto 键盘回归输入框一"
            placeholder="键盘输入框一"
            style={{ borderWidth: 1, padding: 12 }}
          />
          <TextInput
            accessibilityLabel="auto 键盘回归输入框二"
            placeholder="切换到输入框二"
            style={{ borderWidth: 1, padding: 12 }}
          />
          {Array.from({ length: autoRows }, (_, i) => (
            <Text key={i}>动态内容第 {i + 1} 行</Text>
          ))}
          <Button onPress={() => setAutoOpen(false)}>关闭回归 Sheet</Button>
        </NativeSheetScrollContent>
      </NativeSheet>

      <NativeSheet detents={[0.4, 0.6, 1]} handle onOpenChange={setDetentsOpen} open={detentsOpen}>
        <View className="gap-3 p-5">
          <Text className="font-semibold">多档 detents</Text>
          <Text color="muted">多档 detents [0.4, 0.6, 1]</Text>
          <Button onPress={() => setDetentsOpen(false)} variant="primary">
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
          <Text color="muted">当前档位：{["40%", "65%", "90%"][percentPosition]}</Text>
          <ExampleRow>
            <Button onPress={() => setPercentPosition(0)} variant="secondary">
              40%
            </Button>
            <Button onPress={() => setPercentPosition(1)} variant="secondary">
              65%
            </Button>
            <Button onPress={() => setPercentPosition(2)} variant="secondary">
              90%
            </Button>
          </ExampleRow>
          <Button onPress={() => setPercentOpen(false)} variant="primary">
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
          <Text color="muted">可以继续打开内层 Sheet。detents=&#123;[0.4, 0.8]&#125;</Text>
          <Button onPress={() => setNestedOpen(false)} variant="secondary">
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
          <Text color="muted">这是从外层 Sheet 中打开的嵌套 Sheet。</Text>
          <Button onPress={() => setNestedInnerOpen(false)} variant="secondary">
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
          ...(autoStack
            ? { detents: ["auto" as const], maxContentHeight: 650 }
            : { snapPoints: ["70%" as const] }),
        }}
      >
        <NativeSheetStack.Screen name="index" options={{ title: "Stack Sheet" }}>
          {() => <SheetStackIndexScreen />}
        </NativeSheetStack.Screen>
        <NativeSheetStack.Screen name="scroll" options={{ title: "RN 长列表" }}>
          {() => <SheetStackScrollScreen />}
        </NativeSheetStack.Screen>
        <NativeSheetStack.Screen name="short" options={{ title: "RN 短列表" }}>
          {() => <SheetStackScrollScreen short />}
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
