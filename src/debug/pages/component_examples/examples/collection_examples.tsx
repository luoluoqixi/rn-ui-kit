import {
  CalendarDays,
  CircleOff,
  Clock,
  Clock4,
  Info,
  ListFilter,
  MoreHorizontal,
  Palette,
  RefreshCw,
  SlidersHorizontal,
  Smartphone,
  Timer,
  Users,
} from "@tamagui/lucide-icons-2";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  FlashList,
  ListGroup,
  ListItem,
  NativeList,
  NativeListInputItem,
  NativeListItem,
  NativeListMenuItem,
  NativeListNavigationItem,
  NativeListSection,
  NativeListSelectItem,
  NativeListSwitchItem,
  NativeListTextAreaItem,
  ScrollView,
  Select,
  SelectItemData,
  Switch,
  Text,
  isIos15,
  os,
} from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";
import type { ComponentExampleDefinition } from "../types";

const NATIVE_LIST_ICON_COLOR = "#7c3aed";
const NATIVE_LIST_ICON_SIZE = 20;
const NATIVE_LIST_BACKUP_OPTIONS = [
  { Icon: Timer, sfSymbol: "timer", title: "30 分钟", value: "thirty-minutes" },
  { Icon: Clock, sfSymbol: "clock", title: "1 小时", value: "one-hour" },
  {
    Icon: Clock4,
    sfSymbol: isIos15() ? "clock" : "clock.badge",
    title: "4 小时",
    value: "four-hours",
  },
  { Icon: CalendarDays, sfSymbol: "calendar", title: "每天", value: "daily" },
  { Icon: CircleOff, sfSymbol: "nosign", title: "从不", value: "never" },
] as const;

const NATIVE_LIST_SORT_LIST: SelectItemData[] = [
  { value: "defaultSort", label: "默认排序" },
  { value: "timeSort", label: "时间排序" },
];

function NativeListExample() {
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [native, setNative] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
  const [fallbackMounted, setFallbackMounted] = useState(true);
  const [theme, setTheme] = useState<string | null>("system");
  const [syncInterval, setSyncInterval] = useState<string | null>("hourly");
  const [backupInterval, setBackupInterval] = useState("four-hours");
  const [lastAction, setLastAction] = useState("尚未点击");
  const [workspaceName, setWorkspaceName] = useState("rn-ui-kit");
  const [workspaceNote, setWorkspaceNote] = useState("");

  useEffect(() => {
    if (native) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setFallbackMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [native]);

  return (
    <ExampleStack>
      <ExampleBlock
        description="完整覆盖下拉刷新、导航、开关、单选、Select 与平台原生 picker 变体。"
        title="工作区设置"
      >
        <Switch
          checked={native}
          label="使用原生 List 外观"
          labelPosition="end"
          onCheckedChange={(nextNative) => {
            setFallbackMounted(false);
            setNative(nextNative);
          }}
        />
        <Switch
          checked={editMode}
          label={`备忘录式编辑模式（已选 ${selectedIds.length} 项）`}
          labelPosition="end"
          onCheckedChange={(nextEditMode) => {
            setEditMode(nextEditMode);
            if (!nextEditMode) {
              setSelectedIds([]);
            }
          }}
        />
        <View style={styles.nativeListFrame}>
          {native || fallbackMounted ? (
            <NativeList
              editMode={editMode}
              fixesIOS26NestedScrollIndicatorSafeArea
              key={native ? "native-list" : "fallback-list"}
              native={native}
              nestedScrollEnabled
              onSelectedIdsChange={setSelectedIds}
              onRefresh={async () => {
                await new Promise<void>((resolve) => {
                  setTimeout(resolve, 1200);
                });
                setLastAction("下拉刷新完成");
              }}
              selectedIds={selectedIds}
            >
              <NativeListSection
                footer="输入框占满一行；iOS 聚焦编辑时会显示系统清除按钮。"
                title="名称"
              >
                <NativeListInputItem
                  inputProps={{
                    autoCapitalize: "none",
                    onChangeText: setWorkspaceName,
                    placeholder: "输入工作区名称",
                    value: workspaceName,
                  }}
                />
                <NativeListInputItem
                  subtitle="subtitle"
                  title="名称"
                  inputProps={{
                    autoCapitalize: "none",
                    onChangeText: setWorkspaceName,
                    placeholder: "输入工作区名称",
                    value: workspaceName,
                  }}
                />
              </NativeListSection>
              <NativeListSection
                footer="导航行适合跳转到更深层的设置页。"
                title="工作区"
                titleColor="#7c3aed"
                trailing={
                  <Select
                    value="defaultSort"
                    renderValue={() => "排序方式"}
                    options={NATIVE_LIST_SORT_LIST}
                    nativeTrigger
                    nativeTriggerLabelProps={{
                      fontSize: 14,
                      color: "$accent11",
                      opacity: 1,
                    }}
                    nativeTriggerContainerStyle={{
                      alignItems: "center",
                      flexDirection: "row",
                      flexShrink: 1,
                      gap: 4,
                      maxWidth: 180,
                      minHeight: 32,
                      minWidth: 0,
                    }}
                  />
                }
              >
                <NativeListNavigationItem
                  chevronColor={NATIVE_LIST_ICON_COLOR}
                  icon={<Info color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />}
                  sfSymbol="info.circle"
                  onPress={() => setLastAction("打开详情")}
                  selectionId="workspace-details"
                  subtitle="带有 chevron 的导航行"
                  subtitleColor="#64748b"
                  subtitleFontSize={12}
                  title="详情"
                  titleColor="#7c3aed"
                  titleFontSize={18}
                />
                <NativeListNavigationItem
                  icon={<Users color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />}
                  sfSymbol="person.2"
                  onPress={() => setLastAction("打开成员管理")}
                  subtitle="邀请、角色与访问权限"
                  title="成员"
                />
              </NativeListSection>
              <NativeListSection
                footer="numberOfLines 控制可见高度；超出内容可在整个输入区域内滚动。"
                title="备注"
              >
                <NativeListTextAreaItem
                  textAreaProps={{
                    numberOfLines: 4,
                    onChangeText: setWorkspaceNote,
                    placeholder: "添加工作区备注",
                    value: workspaceNote,
                  }}
                />
              </NativeListSection>
              <NativeListSection footer="Switch 适合即时生效的独立偏好。" title="同步">
                <NativeListSwitchItem
                  icon={<RefreshCw color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />}
                  sfSymbol="arrow.clockwise"
                  selectionId="auto-sync"
                  switchProps={{ checked: autoSyncEnabled, onCheckedChange: setAutoSyncEnabled }}
                  title="自动同步"
                />
                <NativeListSelectItem
                  icon={<Palette color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />}
                  sfSymbol="paintpalette"
                  selectProps={{
                    onValueChange: setTheme,
                    options: [
                      { label: "浅色", value: "light" },
                      { label: "深色", value: "dark" },
                      { label: "跟随系统", value: "system" },
                    ],
                    value: theme ?? undefined,
                  }}
                  title="主题模式"
                  valueColor="#7c3aed"
                  valueFontSize={15}
                />
                <NativeListSelectItem
                  icon={<Timer color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />}
                  sfSymbol="timer"
                  selectProps={{
                    onValueChange: setSyncInterval,
                    options: [
                      { label: "每 15 分钟", value: "15-minutes" },
                      { label: "每小时", value: "hourly" },
                      { label: "每天", value: "daily" },
                    ],
                    value: syncInterval ?? undefined,
                  }}
                  title="同步频率"
                />
                <NativeListMenuItem
                  icon={
                    <MoreHorizontal color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />
                  }
                  menuProps={{
                    items: [
                      {
                        label: "立即同步",
                        onSelect: () => setLastAction("立即同步"),
                        value: "sync-now",
                      },
                      {
                        label: "查看同步记录",
                        onSelect: () => setLastAction("查看同步记录"),
                        value: "view-sync-history",
                      },
                    ],
                  }}
                  sfSymbol="ellipsis.circle"
                  subtitle="Menu 不维护选中值，仅触发操作"
                  title="同步操作"
                  value="更多"
                />
                <NativeListMenuItem
                  icon={
                    <MoreHorizontal color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />
                  }
                  menuProps={{
                    items: [
                      {
                        label: "立即同步",
                        onSelect: () => setLastAction("立即同步"),
                        value: "sync-now",
                      },
                      {
                        label: "查看同步记录",
                        onSelect: () => setLastAction("查看同步记录"),
                        value: "view-sync-history",
                      },
                    ],
                  }}
                  sfSymbol="ellipsis.circle"
                  subtitle="自定义颜色和大小"
                  title="同步操作"
                  value="更多"
                  valueColor="#7c3aed"
                  valueFontSize={15}
                />
              </NativeListSection>
              <NativeListSection
                footer="selected 与 chevron={false} 可组合成互斥选择列表。"
                title="自动备份"
              >
                {NATIVE_LIST_BACKUP_OPTIONS.map(({ Icon, sfSymbol, title, value }) => (
                  <NativeListItem
                    chevron={false}
                    icon={<Icon color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />}
                    key={value}
                    onPress={() => setBackupInterval(value)}
                    selectionId={`backup-${value}`}
                    selected={backupInterval === value}
                    sfSymbol={sfSymbol}
                    title={title}
                  />
                ))}
              </NativeListSection>
              <NativeListSection
                footer="同一个 Select 可根据平台选择不同的原生 picker 形态。"
                title="平台 picker"
              >
                <NativeListSelectItem
                  icon={<ListFilter color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />}
                  sfSymbol="line.3.horizontal.decrease.circle"
                  selectProps={{
                    onValueChange: setTheme,
                    options: [
                      { label: "浅色", value: "light" },
                      { label: "深色", value: "dark" },
                      { label: "跟随系统", value: "system" },
                    ],
                    placeholder: "选择主题模式",
                    value: theme ?? undefined,
                  }}
                  title="默认 Select"
                />
                {os() === "ios" ? (
                  <NativeListSelectItem
                    icon={
                      <SlidersHorizontal
                        color={NATIVE_LIST_ICON_COLOR}
                        size={NATIVE_LIST_ICON_SIZE}
                      />
                    }
                    sfSymbol="slider.horizontal.3"
                    selectProps={{
                      nativePickerMode: "wheel",
                      onValueChange: setTheme,
                      options: [
                        { label: "浅色", value: "light" },
                        { label: "深色", value: "dark" },
                        { label: "跟随系统", value: "system" },
                      ],
                      placeholder: "选择主题模式",
                      value: theme ?? undefined,
                    }}
                    title="iOS Wheel"
                  />
                ) : null}
                {os() === "android" ? (
                  <NativeListSelectItem
                    icon={
                      <Smartphone color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />
                    }
                    selectProps={{
                      nativePickerMode: "dialog",
                      onValueChange: setTheme,
                      options: [
                        { label: "浅色", value: "light" },
                        { label: "深色", value: "dark" },
                        { label: "跟随系统", value: "system" },
                      ],
                      placeholder: "选择主题模式",
                      value: theme ?? undefined,
                    }}
                    title="Android Dialog"
                  />
                ) : null}
              </NativeListSection>
            </NativeList>
          ) : null}
        </View>
        <Text opacity={0.6}>
          编辑模式：{editMode ? `已选 ${selectedIds.length} 项` : "关闭"} · 最近动作：
          {lastAction} · 自动同步：{autoSyncEnabled ? "开启" : "关闭"} · 主题：
          {theme ?? "未选择"} · 频率：{syncInterval ?? "未选择"} · 备份：{backupInterval} · 名称：
          {workspaceName || "未填写"} · 备注：{workspaceNote || "未填写"}
        </Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function ListGroupExample() {
  const [lastAction, setLastAction] = useState("尚未点击");

  return (
    <ExampleStack>
      <ExampleBlock
        description="ListGroup 适合承载一组带标题、说明和连续分隔线的入口。"
        title="内容库"
      >
        <ListGroup
          items={[
            {
              onPress: () => setLastAction("最近文件"),
              subTitle: "显示最近访问的文件",
              title: "最近文件",
            },
            {
              onPress: () => setLastAction("收藏夹"),
              subTitle: "显示收藏内容",
              title: "收藏夹",
            },
            {
              onPress: () => setLastAction("共享给团队"),
              subTitle: "管理外部协作者可以访问的内容",
              title: "共享与权限",
            },
          ]}
          rounded="$4"
          separator
          size="$4"
        />
        <Text opacity={0.6}>最近动作：{lastAction}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function ListItemExample() {
  const [pressed, setPressed] = useState(0);
  const [archived, setArchived] = useState(false);

  return (
    <ExampleStack>
      <ExampleBlock
        description="独立 ListItem 可以脱离 ListGroup 用于局部的可点击信息卡。"
        title="单条记录"
      >
        <ListItem
          onPress={() => setPressed((current) => current + 1)}
          style={styles.listItem}
          subTitle="ListItem 可以独立使用"
          title="单个列表项"
        />
        <ListItem
          onPress={() => setArchived((current) => !current)}
          style={styles.listItem}
          subTitle={archived ? "已归档，点击恢复" : "点击后归档该条记录"}
          title={archived ? "归档记录" : "当前记录"}
        />
        <Text opacity={0.6}>已点击 {pressed} 次</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

const flashListData = Array.from({ length: 40 }, (_, index) => ({
  id: `flash-row-${index}`,
  label: `FlashList row ${index + 1}`,
}));

function FlashListExample() {
  return (
    <ExampleStack>
      <ExampleBlock
        description="固定高度中渲染 40 条数据，适合作为长列表的性能基线。"
        title="虚拟化列表"
      >
        <View style={styles.listFrame}>
          <FlashList
            data={flashListData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listRow}>
                <Text>{item.label}</Text>
              </View>
            )}
          />
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}

function ScrollViewExample() {
  return (
    <ExampleStack>
      <ExampleBlock
        description="嵌套容器保持自己的滚动位置，不影响示例详情页。"
        title="独立滚动区域"
      >
        <View style={styles.scrollFrame}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator style={styles.scrollView}>
            {Array.from({ length: 20 }, (_, index) => (
              <View key={index} style={styles.listRow}>
                <Text>ScrollView row {index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}

export const collectionExamples = [
  {
    Component: NativeListExample,
    group: "列表与滚动",
    key: "native-list",
    label: "NativeList",
  },
  {
    Component: ListGroupExample,
    group: "列表与滚动",
    key: "list-group",
    label: "ListGroup",
  },
  {
    Component: ListItemExample,
    group: "列表与滚动",
    key: "list-item",
    label: "ListItem",
  },
  {
    Component: FlashListExample,
    group: "列表与滚动",
    key: "flash-list",
    label: "FlashList",
  },
  {
    Component: ScrollViewExample,
    group: "列表与滚动",
    key: "scroll-view",
    label: "ScrollView",
  },
] satisfies ComponentExampleDefinition[];

const styles = StyleSheet.create({
  listFrame: { height: 320, minHeight: 0 },
  listItem: { borderRadius: 12, borderWidth: StyleSheet.hairlineWidth },
  listRow: {
    borderBottomColor: "rgba(128, 128, 128, 0.22)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  nativeListFrame: { height: 620, minHeight: 0 },
  scrollFrame: { height: 260, minHeight: 0 },
  scrollView: { flex: 1 },
});
