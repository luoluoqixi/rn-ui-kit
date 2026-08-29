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
        <Text variant="muted">最近动作：{action}</Text>
      </ExampleBlock>
      {!isWeb() && (
        <ExampleBlock title="原生项目菜单">
          <DropdownPair native items={items} triggerLabel="Native" />
          <Text variant="muted">最近动作：{action}</Text>
        </ExampleBlock>
      )}
      <ExampleBlock title="禁用">
        <DropdownPair disabled native={false} items={items} triggerLabel="打开 Dropdown" />
        <DropdownPair disabled native={true} items={items} triggerLabel="打开 Dropdown" />
      </ExampleBlock>
    </ExampleStack>
  );
}
