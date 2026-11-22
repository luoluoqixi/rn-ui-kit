import { useState } from "react";
import { FilePlus, Share2 } from "lucide-react-native";
import { Icon, Menubar, Text, type MenubarMenuData } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function MenubarExample() {
  const [action, setAction] = useState("尚未选择");
  const [bookmarks, setBookmarks] = useState(true);
  const [profile, setProfile] = useState("personal");
  const [open, setOpen] = useState<string>();
  const items: MenubarMenuData[] = [
    { value: "file", title: "文件", items: [
      { value: "new", label: "新建文件", icon: <Icon as={FilePlus} size="sm" />, shortcut: "⌘N", onSelect: () => setAction("新建文件") },
      { value: "open", label: "打开文件", shortcut: "⌘O", onSelect: () => setAction("打开文件") },
      { value: "divider", separator: true },
      { value: "share", label: "分享", icon: <Icon as={Share2} size="sm" />, subMenu: [
        { value: "copy", label: "复制链接", onSelect: () => setAction("复制链接") },
        { value: "mail", label: "发送邮件", onSelect: () => setAction("发送邮件") },
      ] },
      { value: "export", label: "导出", disabled: true },
    ] },
    { value: "edit", title: "编辑", items: [
      { value: "undo", label: "撤销", shortcut: "⌘Z", onSelect: () => setAction("撤销") },
      { value: "redo", label: "重做", shortcut: "⇧⌘Z", onSelect: () => setAction("重做") },
      { value: "divider", separator: true, separatorVariant: "thick" },
      { value: "delete", label: "删除", destructive: true, onSelect: () => setAction("删除") },
    ] },
    { value: "view", title: "视图", items: [
      { value: "bookmarks", label: "显示书签栏", checkbox: true, selected: bookmarks, onSelect: () => setBookmarks(!bookmarks) },
      { value: "divider", separator: true },
      ...["personal", "work"].map(value => ({ value, label: value === "personal" ? "个人空间" : "工作空间",
        selected: profile === value, selectionIndicatorVariant: "dot" as const, shouldCloseOnSelect: false, onSelect: () => setProfile(value) })),
    ] },
    { value: "help", title: "帮助", disabled: true, items: [] },
  ];
  return <ExampleStack>
    <ExampleBlock title="文件与编辑">
      <Menubar items={items} nativeHaptics itemNativeHaptics value={open} onValueChange={setOpen} />
      <Text color="muted">最近操作：{action}；书签栏：{bookmarks ? "显示" : "隐藏"}</Text>
      <Text color="muted">Web 支持左右键切换、上下键进入、Escape 关闭与 Tab 离开；菜单打开后移到另一标题可切换。</Text>
    </ExampleBlock>
    <ExampleBlock title="按钮尺寸与菜单方向">
      <Menubar size="md" items={items.slice(0, 2)} contentProps={{ side: "top" }} nativeHaptics itemNativeHaptics />
      <Text color="muted">标题使用 Button 的 md 尺寸；菜单密度沿用主题默认值。</Text>
    </ExampleBlock>
  </ExampleStack>;
}
