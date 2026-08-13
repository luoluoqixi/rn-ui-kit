import { Download, FilePlus, Settings } from "@tamagui/lucide-icons-2";

import { useState } from "react";

import { Button, Menu, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function MenuExample() {
  const [action, setAction] = useState("尚未选择");

  return (
    <ExampleStack>
      <ExampleBlock description="Menu 适合由普通按钮触发的一组轻量操作。" title="项目菜单">
        <Menu
          arrow
          trigger={<Button variant="outlined">打开 Menu</Button>}
          items={[
            {
              icon: <FilePlus color="$color10" size={14} />,
              iconProps: {
                androidIconName: "ic_menu_add",
                ios: { name: "doc.badge.plus" },
              },
              label: "新建文件",
              onSelect: () => setAction("新建文件"),
              value: "new",
            },
            {
              label: "更多操作",
              subMenu: [
                {
                  icon: <Settings color="$color10" size={14} />,
                  iconProps: {
                    androidIconName: "ic_menu_preferences",
                    ios: { name: "gearshape" },
                  },
                  label: "打开设置",
                  onSelect: () => setAction("打开设置"),
                  value: "settings",
                },
                {
                  icon: <Download color="$color10" size={14} />,
                  iconProps: {
                    androidIconName: "ic_menu_save",
                    ios: { name: "square.and.arrow.down" },
                  },
                  label: "导出快照",
                  onSelect: () => setAction("导出快照"),
                  value: "export",
                },
              ],
              value: "more",
            },
            { label: "separator", separator: true, value: "separator" },
            {
              destructive: true,
              label: "清空记录",
              onSelect: () => setAction("清空记录"),
              value: "clear",
            },
          ]}
        />
        <Menu
          arrow
          nativeTrigger
          nativeTriggerLabel="打开Menu"
          items={[
            {
              icon: <FilePlus color="$color10" size={14} />,
              iconProps: {
                androidIconName: "ic_menu_add",
                ios: { name: "doc.badge.plus" },
              },
              label: "新建文件",
              onSelect: () => setAction("新建文件"),
              value: "new",
            },
            {
              label: "更多操作",
              subMenu: [
                {
                  icon: <Settings color="$color10" size={14} />,
                  iconProps: {
                    androidIconName: "ic_menu_preferences",
                    ios: { name: "gearshape" },
                  },
                  label: "打开设置",
                  onSelect: () => setAction("打开设置"),
                  value: "settings",
                },
                {
                  icon: <Download color="$color10" size={14} />,
                  iconProps: {
                    androidIconName: "ic_menu_save",
                    ios: { name: "square.and.arrow.down" },
                  },
                  label: "导出快照",
                  onSelect: () => setAction("导出快照"),
                  value: "export",
                },
              ],
              subMenuTitle: false,
              value: "more",
            },
            { label: "separator", separator: true, value: "separator" },
            {
              destructive: true,
              label: "清空记录",
              onSelect: () => setAction("清空记录"),
              value: "clear",
            },
          ]}
        />
        <Text opacity={0.6}>最近动作：{action}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
