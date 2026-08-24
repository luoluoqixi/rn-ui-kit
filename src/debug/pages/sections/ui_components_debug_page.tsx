import { useState } from "react";
import { View } from "react-native";
import { Info } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  NativeList,
  NativeListNavigationItem,
  NativeListSection,
  NativeListSwitchItem,
  NativeSheet,
  Progress,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Tabs,
  Text,
  Textarea,
  Toggle,
} from "../../../core/components/ui";
import type { RnUiKitUiComponentsDebugPageProps } from "../../types";

function SectionCard({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <Card
      contentProps={{ className: "gap-4" }}
      description={description}
      title={title}
    >
      {children}
    </Card>
  );
}

export function RnUiKitUiComponentsDebugPage({
  header,
}: RnUiKitUiComponentsDebugPageProps) {
  const insets = useSafeAreaInsets();
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [switchValue, setSwitchValue] = useState(true);
  const [toggleValue, setToggleValue] = useState(false);
  const [progress, setProgress] = useState(60);
  const [tabValue, setTabValue] = useState("preview");
  const [nativeListValue, setNativeListValue] = useState("four-minutes");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(56);

  return (
    <View
      className="bg-background gap-5 p-4 pb-12"
      style={{ paddingLeft: 16 + insets.left, paddingRight: 16 + insets.right }}
    >
      {header}

      <SectionCard description="按钮、状态切换和加载反馈。" title="动作与反馈">
        <View className="flex-row flex-wrap items-center gap-3">
          <Button
            onPress={() =>
              setProgress((value) => (value >= 100 ? 0 : value + 10))
            }
          >
            <Text>推进进度</Text>
          </Button>
          <Button variant="outline">
            <Text>Outlined</Text>
          </Button>
          <Checkbox
            checked={checkboxChecked}
            onCheckedChange={setCheckboxChecked}
          />
          <Switch checked={switchValue} onCheckedChange={setSwitchValue} />
          <Spinner />
          <Spinner size="large" />
        </View>
        <Progress value={progress} />
        <Text variant="muted">当前进度：{progress}%</Text>
        <Toggle pressed={toggleValue} onPressedChange={setToggleValue}>
          <Text>Toggle</Text>
        </Toggle>
      </SectionCard>

      <SectionCard
        description="文本输入、多行输入、选择器和滑杆。"
        title="输入与选择"
      >
        <Input defaultValue="rn-ui-kit" placeholder="Input" />
        <Textarea
          defaultValue="这是一段文本区域示例。"
          placeholder="TextArea"
        />
        <Text className="font-medium">Slider：{sliderValue}</Text>
        <Slider
          max={100}
          min={0}
          onValueChange={(value) => setSliderValue(value[0] ?? 0)}
          step={1}
          value={[sliderValue]}
        />
        <View className="border-border gap-2 rounded-lg border p-3">
          <Text className="font-medium">Select</Text>
          <Text variant="muted">Select 当前版本保留空实现。</Text>
        </View>
      </SectionCard>

      <SectionCard description="Tabs、Toggle 和其他组合控件。" title="组合控件">
        <Tabs value={tabValue} onValueChange={setTabValue}>
          <Tabs.List>
            <Tabs.Trigger value="preview">
              <Text>预览</Text>
            </Tabs.Trigger>
            <Tabs.Trigger value="code">
              <Text>代码</Text>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="preview">
            <Text>当前选中的 Tab：{tabValue}</Text>
          </Tabs.Content>
          <Tabs.Content value="code">
            <Text>示例代码将在后续迁移中补齐。</Text>
          </Tabs.Content>
        </Tabs>
      </SectionCard>

      <SectionCard
        description="Dialog、AlertDialog、Dropdown 和 Sheet 的迁移入口。"
        title="浮层与菜单"
      >
        <Alert
          description="原生弹层和菜单仍通过当前组件库入口提供。"
          icon={Info}
          title="迁移占位"
        />
        <Button onPress={() => setSheetOpen(true)}>
          <Text>打开 NativeSheet</Text>
        </Button>
      </SectionCard>

      <SectionCard
        description="NativeList、Card、Separator 和基础文本展示。"
        title="展示组件"
      >
        <NativeList>
          <NativeListSection title="NativeList 示例">
            <NativeListNavigationItem
              onPress={() => setNativeListValue("selected")}
              title="NativeListNavigationItem"
              value="详情"
            />
            <NativeListSwitchItem
              switchProps={{
                checked: switchValue,
                onCheckedChange: setSwitchValue,
              }}
              title="NativeListSwitchItem"
            />
          </NativeListSection>
          <NativeListSection title="单选示例">
            {["30秒钟", "1分钟", "2分钟", "4分钟", "永不"].map(
              (title, index) => {
                const value = [
                  "thirty-seconds",
                  "one-minute",
                  "two-minutes",
                  "four-minutes",
                  "never",
                ][index];
                return (
                  <NativeListNavigationItem
                    key={value}
                    onPress={() => setNativeListValue(value)}
                    selected={nativeListValue === value}
                    title={title}
                  />
                );
              },
            )}
          </NativeListSection>
        </NativeList>
        <Separator />
        <Badge>
          <Text>RNR + Uniwind</Text>
        </Badge>
        <Skeleton className="h-12 w-full" />
      </SectionCard>

      <NativeSheet
        handle
        onOpenChange={setSheetOpen}
        open={sheetOpen}
        snapPoints={["72%", "90%"]}
      >
        <View className="gap-3 p-5">
          <Text className="font-semibold">NativeSheet</Text>
          <Text variant="muted">
            Sheet 入口使用 TrueSheet，可通过 detents 或百分比 snapPoints 调节高度。
          </Text>
          <Button onPress={() => setSheetOpen(false)} variant="outline">
            <Text>关闭</Text>
          </Button>
        </View>
      </NativeSheet>
    </View>
  );
}
