import { Settings } from "@tamagui/lucide-icons-2";

import { useState } from "react";

import { Button, ContextMenu, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function ContextMenuExample() {
  const [action, setAction] = useState("尚未选择");

  return (
    <ExampleStack>
      <ExampleBlock
        description="在桌面端右键、在触控设备长按，均会打开同一组操作。"
        title="文件操作"
      >
        <ContextMenu
          arrow
          items={[
            { label: "重命名", onSelect: () => setAction("重命名"), value: "rename" },
            { label: "复制链接", onSelect: () => setAction("复制链接"), value: "copy-link" },
            {
              label: "更多操作",
              subMenu: [
                {
                  icon: <Settings color="$color10" size={14} />,
                  label: "设置",
                  onSelect: () => setAction("设置"),
                  subtitle: "嵌套 ContextMenu",
                  value: "settings",
                },
                {
                  label: "下载",
                  onSelect: () => setAction("下载"),
                  value: "download",
                },
              ],
              value: "more",
            },
            { label: "separator", separator: true, value: "separator" },
            {
              destructive: true,
              label: "删除",
              onSelect: () => setAction("删除"),
              value: "delete",
            },
          ]}
          trigger={<Button variant="outlined">右键或长按</Button>}
        />
        <Text opacity={0.6}>最近动作：{action}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
