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
  Square,
  SquareCheckBig,
  Timer,
  Users,
} from "lucide-react-native";

import { useEffect, useState } from "react";

import { StyleSheet, View } from "react-native";

import {
  NativeList,
  NativeListInputItem,
  NativeListItem,
  NativeListDropdownItem,
  NativeListNavigationItem,
  NativeListSection,
  NativeListSelectItem,
  NativeListSwitchItem,
  NativeListTextAreaItem,
  type NativeListBasicStyle,
  type NativeListIosStyle,
  Select,
  type SelectItemData,
  Switch,
  Text,
  isIos15,
  os,
  useUiTheme,
  useNativeListEditMode,
  NATIVE_TRIGGER_LABEL_OPACITY,
  NativeListSectionRenderContext,
} from "rn-ui-kit/core";

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

const NATIVE_LIST_IOS_STYLE_OPTIONS: SelectItemData[] = [
  { value: "automatic", label: "系统自动" },
  { value: "plain", label: "通栏无圆角" },
  { value: "inset", label: "内缩" },
  { value: "insetGrouped", label: "圆角分组" },
  { value: "grouped", label: "分组" },
  { value: "sidebar", label: "侧边栏" },
];

const NATIVE_LIST_BASIC_STYLE_OPTIONS: SelectItemData[] = [
  { value: "rounded", label: "圆角" },
  { value: "plain", label: "非圆角" },
  { value: "plainFullWidth", label: "非圆角 + 通栏" },
];

function renderNativeListSortTrailing(context: NativeListSectionRenderContext) {
  const { editMode } = context;
  return (
    <Select
      disabled={editMode}
      value="defaultSort"
      renderValue={() => "排序方式"}
      options={NATIVE_LIST_SORT_LIST}
      nativeTrigger
      nativeTriggerLabelProps={{
        style: { fontSize: 14, color: "#7c3aed", opacity: 0.8 },
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
  );
}

const styles = StyleSheet.create({
  exampleControlCopy: { flex: 1, gap: 2, minWidth: 0 },
  exampleControlRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
    minHeight: 48,
  },
  exampleIosStyleTrigger: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 0,
    gap: 4,
    justifyContent: "flex-end",
    maxWidth: 150,
    minHeight: 36,
    minWidth: 112,
    paddingHorizontal: 10,
  },
  exampleHeader: { gap: 10 },
  exampleRoot: { flex: 1, gap: 12, minHeight: 0, padding: 16 },
  nativeListFrame: { flex: 1, minHeight: 0 },
});

export function NativeListExample() {
  const uiTheme = useUiTheme();
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [customEditModeIcon, setCustomEditModeIcon] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [native, setNative] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
  const [fallbackMounted, setFallbackMounted] = useState(true);
  const [iosListStyle, setIosListStyle] = useState<NativeListIosStyle>("insetGrouped");
  const [basicListStyle, setBasicListStyle] = useState<NativeListBasicStyle>("rounded");
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
      requestAnimationFrame(() => {
        setFallbackMounted(true);
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [native]);

  return (
    <View style={styles.exampleRoot}>
      <View style={styles.exampleHeader}>
        <Switch
          checked={native}
          label="使用原生 List 外观"
          labelPosition="right"
          onCheckedChange={(nextNative) => {
            setFallbackMounted(false);
            setNative(nextNative);
          }}
        />
        <Switch
          checked={editMode}
          label={`编辑模式（已选 ${selectedIds.length} 项）`}
          labelPosition="right"
          onCheckedChange={(nextEditMode) => {
            setEditMode(nextEditMode);
            if (!nextEditMode) {
              setSelectedIds([]);
            }
          }}
        />
        <Switch
          checked={customEditModeIcon}
          disabled={os() === "ios" && native}
          label="自定义编辑模式图标"
          labelPosition="right"
          onCheckedChange={setCustomEditModeIcon}
        />
        {os() === "ios" ? (
          <View style={styles.exampleControlRow}>
            <View style={styles.exampleControlCopy}>
              <Text style={{ fontSize: 15, opacity: native ? 1 : 0.5 }}>iOS List 样式</Text>
            </View>
            <Select
              disabled={!native}
              native
              nativeDropdownAnchorWidth={180}
              nativeTrigger
              nativeTriggerContainerStyle={styles.exampleIosStyleTrigger}
              nativeTriggerLabelProps={{
                fontSize: 14,
                numberOfLines: 1,
                opacity: native ? 1 : 0.5,
              }}
              onValueChange={(nextStyle) => {
                if (nextStyle != null) {
                  setIosListStyle(nextStyle as NativeListIosStyle);
                }
              }}
              options={NATIVE_LIST_IOS_STYLE_OPTIONS}
              value={iosListStyle}
            />
          </View>
        ) : null}
        {os() !== "ios" || !native ? (
          <View style={styles.exampleControlRow}>
            <View style={styles.exampleControlCopy}>
              <Text style={{ fontSize: 15 }}>Basic List 样式</Text>
            </View>
            <Select
              native
              nativeDropdownAnchorWidth={180}
              nativeTrigger
              nativeTriggerContainerStyle={styles.exampleIosStyleTrigger}
              nativeTriggerLabelProps={{ fontSize: 14, numberOfLines: 1 }}
              onValueChange={(nextStyle) => {
                if (nextStyle != null) {
                  setBasicListStyle(nextStyle as NativeListBasicStyle);
                }
              }}
              options={NATIVE_LIST_BASIC_STYLE_OPTIONS}
              value={basicListStyle}
            />
          </View>
        ) : null}
      </View>
      <View style={styles.nativeListFrame}>
        {native || fallbackMounted ? (
          <NativeList
            nativeHaptics
            dismissKeyboardOnTap
            contextMenuProps={{
              items: [
                {
                  label: "复制标题",
                  onSelect: () => setLastAction("根菜单：复制标题"),
                  value: "copy-title",
                },
                {
                  label: "更多操作",
                  subMenu: [
                    {
                      label: "共享",
                      onSelect: () => setLastAction("根菜单：共享"),
                      value: "share",
                    },
                    {
                      destructive: true,
                      label: "删除",
                      onSelect: () => setLastAction("根菜单：删除"),
                      value: "delete",
                    },
                  ],
                  subMenuTitle: "更多操作",
                  value: "more",
                },
              ],
            }}
            editMode={editMode}
            editModeIcon={
              customEditModeIcon ? <Square color={uiTheme.primary} size={24} /> : undefined
            }
            editModeSelectedIcon={
              customEditModeIcon ? <SquareCheckBig color={uiTheme.primary} size={24} /> : undefined
            }
            refreshEnabledInEditMode={false}
            fixesIOS26NestedScrollIndicatorSafeArea
            iosListStyle={iosListStyle}
            listStyle={basicListStyle}
            key={native ? `native-list-${iosListStyle}` : "fallback-list"}
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
              contextMenuProps={{
                items: [
                  {
                    label: "工作区菜单",
                    onSelect: () => setLastAction("Section 菜单：工作区"),
                    subtitle: "覆盖 NativeList 默认菜单",
                    value: "workspace-menu",
                  },
                ],
              }}
              footer="导航行适合跳转到更深层的设置页。"
              title="工作区"
              titleColor="#7c3aed"
              trailing={renderNativeListSortTrailing}
            >
              <NativeListNavigationItem
                chevronColor={NATIVE_LIST_ICON_COLOR}
                contextMenuProps={{
                  items: [
                    {
                      label: "详情专属菜单",
                      onSelect: () => setLastAction("Item 菜单：详情"),
                      value: "details-menu",
                    },
                  ],
                }}
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
              <NativeListItem
                icon={<CircleOff color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />}
                sfSymbol="nosign"
                onPress={() => setLastAction("点击编辑时不可选择的行")}
                selectionDisabled
                selectionId="workspace-non-selectable"
                subtitle="编辑模式下不显示选择标记，也不会加入已选项"
                title="编辑时不可选择"
              />
              <NativeListItem
                disabled
                selectionDisabled
                icon={<CircleOff color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />}
                sfSymbol="nosign"
                subtitle="disabled 会在非编辑与编辑模式中均禁用整行"
                title="始终禁用"
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
              <NativeListDropdownItem
                icon={
                  <MoreHorizontal color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />
                }
                dropdownProps={{
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
              <NativeListDropdownItem
                icon={
                  <MoreHorizontal color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />
                }
                dropdownProps={{
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
                <>
                  <NativeListSelectItem
                    icon={
                      <SlidersHorizontal
                        color={NATIVE_LIST_ICON_COLOR}
                        size={NATIVE_LIST_ICON_SIZE}
                      />
                    }
                    sfSymbol="slider.horizontal.3"
                    selectProps={{
                      native: "wheel",
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
                  <NativeListSelectItem
                    contextMenuProps={false}
                    icon={
                      <SlidersHorizontal
                        color={NATIVE_LIST_ICON_COLOR}
                        size={NATIVE_LIST_ICON_SIZE}
                      />
                    }
                    sfSymbol="slider.horizontal.3"
                    selectProps={{
                      native: "wheel",
                      onValueChange: setTheme,
                      options: [
                        { label: "浅色", value: "light" },
                        { label: "深色", value: "dark" },
                        { label: "跟随系统", value: "system" },
                      ],
                      placeholder: "选择主题模式",
                      value: theme ?? undefined,
                    }}
                    title="iOS Wheel2"
                    subtitle="禁用 context_menu"
                  />
                </>
              ) : null}
              {os() === "android" ? (
                <NativeListSelectItem
                  icon={<Smartphone color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />}
                  selectProps={{
                    native: "dialog",
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
              <NativeListSelectItem
                icon={
                  <SlidersHorizontal color={NATIVE_LIST_ICON_COLOR} size={NATIVE_LIST_ICON_SIZE} />
                }
                sfSymbol="slider.horizontal.3"
                selectProps={{
                  options: [{ label: "Item", value: "item" }],
                  placeholder: "Item",
                  value: "item",
                }}
                title="仅一个Item"
              />
            </NativeListSection>
          </NativeList>
        ) : null}
      </View>
      <Text numberOfLines={2} style={{ opacity: 0.6 }}>
        编辑模式：{editMode ? `已选 ${selectedIds.length} 项` : "关闭"} · iOS 实现： 编辑图标：
        {customEditModeIcon ? "自定义" : "默认"} · 最近动作：{lastAction} · 自动同步：
        {autoSyncEnabled ? "开启" : "关闭"} · 主题：{theme ?? "未选择"} · 频率：
        {syncInterval ?? "未选择"} · 备份：{backupInterval} · 名称：
        {workspaceName || "未填写"} · 备注：{workspaceNote || "未填写"}
      </Text>
    </View>
  );
}
