import { Download, FilePlus, Settings } from "lucide-react-native";
import { ComponentProps, useState } from "react";

import { Dropdown, isWeb, Text, type DropdownItemData } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
import { View } from "react-native";

function DropdownPair({ children, ...props }: ComponentProps<typeof Dropdown>) {
  return (
    <View className="gap-2">
      <View className="flex-row gap-2">
        <Dropdown nativeHaptics itemNativeHaptics {...props} children={children} />
        <Dropdown nativeHaptics itemNativeHaptics nativeTrigger {...props} children={children} />
      </View>
      <Dropdown
        nativeHaptics
        itemNativeHaptics
        triggerClassName="w-full"
        {...props}
        children={children}
      />
      <Dropdown
        nativeHaptics
        itemNativeHaptics
        nativeTrigger
        triggerClassName="w-full"
        {...props}
        children={children}
      />
    </View>
  );
}

export function DropdownExample() {
  const [action, setAction] = useState("尚未选择");
  const [sourceMode, setSourceMode] = useState(true);
  const [alignment, setAlignment] = useState("left");
  const [styles, setStyles] = useState(["bold", "italic"]);
  const editorItems: DropdownItemData[] = [
    { value: "space", label: "新建工作区", shortcut: "⌘ N", onSelect: () => setAction("新建工作区") },
    { value: "section-space", separator: true, separatorVariant: "thick" },
    { value: "focus", label: "专注模式", onSelect: () => setAction("专注模式") },
    { value: "section-format", separator: true, separatorVariant: "thick" },
    { value: "heading", label: "一级标题", shortcut: "⌘ 1", onSelect: () => setAction("一级标题") },
    { value: "list", label: "项目列表", shortcut: "⌘ L", onSelect: () => setAction("项目列表") },
    { value: "tasks", label: "任务列表", onSelect: () => setAction("任务列表") },
    { value: "divider-tools", separator: true },
    { value: "link", label: "插入链接", shortcut: "⌘ K", onSelect: () => setAction("插入链接") },
    { value: "configure", label: "菜单设置", onSelect: () => setAction("菜单设置") },
  ];
  const alignmentItems: DropdownItemData[] = [
    { value: "left", label: "左对齐" },
    { value: "center", label: "居中对齐" },
    { value: "right", label: "右对齐" },
  ].map(item => ({ ...item, selected: alignment === item.value, selectionIndicatorVariant: "dot", shouldCloseOnSelect: false, onSelect: () => setAlignment(item.value) }));
  const styleItems: DropdownItemData[] = [
    { value: "bold", label: "粗体", shortcut: "⌘ B" },
    { value: "italic", label: "斜体", shortcut: "⌘ I" },
    { value: "underline", label: "下划线", shortcut: "⌘ U" },
  ].map(item => ({ ...item, checkbox: true, selected: styles.includes(item.value), onSelect: () => setStyles(previous => previous.includes(item.value) ? previous.filter(value => value !== item.value) : [...previous, item.value]) }));
  const longItems: DropdownItemData[] = Array.from({ length: 40 }, (_, i) => ({
    value: "document-" + (i + 1), label: "项目文档 " + String(i + 1).padStart(2, "0"),
    onSelect: () => setAction("项目文档 " + (i + 1)),
  }));
  const selectionItems: DropdownItemData[] = [
    {
      value: "source-mode",
      label: "源码模式",
      icon: <FilePlus color="#64748b" size={16} />,
      selected: sourceMode,
      onSelect: () => setSourceMode((value) => !value),
    },
    {
      value: "preview-mode",
      label: "预览模式",
      selected: !sourceMode,
      onSelect: () => setSourceMode((value) => !value),
    },
    {
      value: "nested-selection",
      label: "子菜单",
      subMenu: [
        { value: "inherited", label: "继承位置", selected: true },
        {
          value: "override",
          label: "单项固定左侧",
          selected: true,
          selectionIndicatorPosition: "left",
        },
      ],
    },
  ];
  const items: DropdownItemData[] = [
    {
      icon: <FilePlus color="#64748b" size={16} />,
      iconProps: {
        androidIconName: "ic_menu_add",
        ios: { name: "doc.badge.plus" },
      },
      label: "新建文件",
      onSelect: () => setAction("新建文件"),
      value: "new-file",
    },
    {
      label: "打开最近文件",
      onSelect: () => setAction("打开最近文件"),
      value: "open-recent",
    },
    { separator: true, value: "separator-file" },
    {
      label: "显示方式",
      subMenu: [
        {
          label: "列表",
          onSelect: () => setAction("显示方式：列表"),
          selected: true,
          value: "view-list",
        },
        {
          label: "紧凑列表",
          onSelect: () => setAction("显示方式：紧凑列表"),
          value: "view-compact",
        },
        { separator: true, value: "separator-view" },
        {
          icon: <Settings color="#64748b" size={16} />,
          iconProps: {
            androidIconName: "ic_menu_preferences",
            ios: { name: "gearshape" },
          },
          label: "显示设置",
          onSelect: () => setAction("显示设置"),
          subtitle: "嵌套 Dropdown",
          value: "view-settings",
        },
      ],
      subMenuTitle: false,
      value: "view-options",
    },
    {
      disabled: true,
      label: "云端同步（不可用）",
      onSelect: () => setAction("云端同步"),
      value: "cloud-sync",
    },
    { separator: true, value: "separator-export" },
    {
      icon: <Download color="#64748b" size={16} />,
      iconProps: {
        androidIconName: "ic_menu_save",
        ios: { name: "square.and.arrow.down" },
      },
      label: "导出快照",
      onSelect: () => setAction("导出快照"),
      value: "export-snapshot",
    },
    {
      label: "复制分享链接",
      onSelect: () => setAction("复制分享链接"),
      value: "copy-share-link",
    },
    { separator: true, value: "separator-danger" },
    {
      destructive: true,
      label: "清空记录",
      onSelect: () => setAction("清空记录"),
      value: "clear-history",
    },
  ];

  return (
    <ExampleStack>
      <ExampleBlock title="项目菜单">
        <DropdownPair native={false} items={items} triggerLabel="打开 Dropdown" />
        <Text color="muted">最近动作：{action}</Text>
      </ExampleBlock>
      <ExampleBlock title="分区与快捷键" description="粗分隔线划分功能区，细分隔线分开相关操作；右侧快捷键仅作提示。">
        <Dropdown native={false} nativeHaptics itemNativeHaptics items={editorItems} triggerLabel="编辑菜单" />
        <Text color="muted">最近动作：{action}</Text>
      </ExampleBlock>
      <ExampleBlock title="单选与多选" description="选择后菜单保持打开；单选使用圆点，多选使用勾号。">
        <View className="flex-row flex-wrap gap-3">
          <Dropdown native={false} nativeHaptics itemNativeHaptics items={alignmentItems} triggerLabel="段落对齐" />
          <Dropdown native={false} nativeHaptics itemNativeHaptics items={styleItems} triggerLabel="文字样式" />
        </View>
        <Text color="muted">当前对齐：{alignmentItems.find(item => item.value === alignment)?.label as string}</Text>
        <Text color="muted">文字样式：{styleItems.filter(item => item.selected).map(item => item.label as string).join("、") || "无"}</Text>
      </ExampleBlock>
      <ExampleBlock title="长菜单滚动" description="40 个文档限制在 280 高度内，滚动到底部后仍可选择。">
        <Dropdown native={false} nativeHaptics itemNativeHaptics contentProps={{ maxHeight: 280 }} items={longItems} triggerLabel="浏览全部文档" />
        <Text color="muted">最近动作：{action}</Text>
      </ExampleBlock>
      <ExampleBlock title="弹出方向" description="从触发器上、下、左、右打开；靠近屏幕边缘时会避让。">
        <View className="gap-3">
          <View className="items-center"><Dropdown native={false} items={items.slice(0, 2)} contentProps={{ side: "top", align: "center" }} triggerLabel="向上" /></View>
          <View className="flex-row justify-between">
            <Dropdown native={false} items={items.slice(0, 2)} contentProps={{ side: "right", align: "center" }} triggerLabel="向右" />
            <Dropdown native={false} items={items.slice(0, 2)} contentProps={{ side: "left", align: "center" }} triggerLabel="向左" />
          </View>
          <View className="items-center"><Dropdown native={false} items={items.slice(0, 2)} contentProps={{ side: "bottom", align: "center" }} triggerLabel="向下" /></View>
        </View>
      </ExampleBlock>
      <ExampleBlock title="勾选标记位置">
        <Dropdown
          native={false}
          nativeTrigger
          items={selectionItems}
          triggerLabel="默认左侧"
        />
        <Dropdown
          native={false}
          nativeTrigger
          selectionIndicatorPosition="right"
          items={selectionItems}
          triggerLabel="右侧勾选"
        />
      </ExampleBlock>
      {!isWeb() && (
        <ExampleBlock title="原生项目菜单">
          <DropdownPair native items={items} triggerLabel="Native" />
          <Text color="muted">最近动作：{action}</Text>
        </ExampleBlock>
      )}
      <ExampleBlock title="禁用">
        <DropdownPair disabled native={false} items={items} triggerLabel="打开 Dropdown" />
        <DropdownPair disabled native={true} items={items} triggerLabel="打开 Dropdown" />
      </ExampleBlock>
    </ExampleStack>
  );
}
