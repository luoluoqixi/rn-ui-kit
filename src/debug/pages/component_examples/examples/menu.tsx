import { Download, FilePlus, Settings } from "@tamagui/lucide-icons-2";

import { useState } from "react";

import { Button, Menu, Text, type MenuItemData } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function MenuExample() {
  const [action, setAction] = useState("尚未选择");
  const items: MenuItemData[] = [
    {
      icon: <FilePlus color="$color10" size={14} />,
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
          icon: <Settings color="$color10" size={14} />,
          iconProps: {
            androidIconName: "ic_menu_preferences",
            ios: { name: "gearshape" },
          },
          label: "显示设置",
          onSelect: () => setAction("显示设置"),
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
      icon: <Download color="$color10" size={14} />,
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
      <ExampleBlock
        description="包含三条根菜单分割线及一条子菜单分割线，用于检查普通、禁用、选中和 destructive 项之间的分组显示。"
        title="复杂项目菜单"
      >
        <Menu arrow items={items} trigger={<Button variant="outlined">打开 Menu</Button>} />
        <Menu arrow items={items} nativeTrigger nativeTriggerLabel="打开 Native Menu" />
        <Text opacity={0.6}>最近动作：{action}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
