import { useMemo, useState } from "react";

import { Button, ContextMenu, isWeb, Text, type ContextMenuItemData } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function ContextMenuExample() {
  const [action, setAction] = useState("尚未选择");
  const [showDetails, setShowDetails] = useState(false);
  const items = useMemo<ContextMenuItemData[]>(
    () => [
      {
        label: "打开",
        onSelect: () => setAction("打开"),
        value: "open",
      },
      {
        label: "重命名",
        onSelect: () => setAction("重命名"),
        value: "rename",
      },
      { separator: true, value: "separator-actions" },
      {
        label: "更多操作",
        subMenu: [
          {
            label: "复制链接",
            onSelect: () => setAction("复制链接"),
            value: "copy-link",
          },
          {
            label: "移动到归档",
            onSelect: () => setAction("移动到归档"),
            value: "archive",
          },
          {
            label: "设置",
            onSelect: () => setAction("设置"),
            subtitle: "嵌套 ContextMenu",
            value: "nested-settings",
          },
        ],
        subMenuTitle: false,
        value: "more",
      },
      {
        checked: showDetails,
        label: "显示详细信息",
        onCheckedChange: setShowDetails,
        value: "details",
      },
      { disabled: true, label: "暂不可用", value: "disabled" },
      { separator: true, value: "separator-danger" },
      {
        destructive: true,
        label: "删除项目",
        onSelect: () => setAction("删除项目"),
        value: "delete",
      },
      {
        label: "测试项目1",
        onSelect: () => setAction("测试项目1"),
        value: "test1",
      },
      {
        label: "测试项目2",
        onSelect: () => setAction("测试项目2"),
        value: "test2",
      },
      {
        label: "测试项目3",
        onSelect: () => setAction("测试项目3"),
        value: "test3",
      },
      {
        label: "测试项目4",
        onSelect: () => setAction("测试项目4"),
        value: "test4",
      },
      {
        label: "测试项目5",
        onSelect: () => setAction("测试项目5"),
        value: "test5",
      },
    ],
    [showDetails],
  );

  return (
    <ExampleStack>
      {!isWeb() && (
        <ExampleBlock title="ContextMenu 原生菜单">
          <ContextMenu
            items={items}
            native
            nativeHaptics
            trigger={<Button variant="secondary">长按打开原生菜单</Button>}
          />
          <Text variant="muted">最近动作：{action}</Text>
          <Text variant="muted">详细信息：{showDetails ? "显示" : "隐藏"}</Text>
        </ExampleBlock>
      )}

      <ExampleBlock title="ContextMenu 菜单">
        <ContextMenu
          items={items}
          itemNativeHaptics
          native={false}
          nativeHaptics
          trigger={
            <Button variant="secondary">{isWeb() ? "右键打开项目菜单" : "长按打开项目菜单"}</Button>
          }
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
