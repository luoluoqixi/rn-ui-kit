import { Menubar, type MenubarMenuData } from "rn-ui-kit/core";
import * as React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ExampleBlock, ExampleStack } from "../shared";

export function MenubarExample() {
  const insets = useSafeAreaInsets();
  const contentInsets = { top: insets.top, bottom: insets.bottom, left: 12, right: 12 };
  const [valueXs, setValueXs] = React.useState<string | undefined>();
  const [valueSm, setValueSm] = React.useState<string | undefined>();
  const [valueMd, setValueMd] = React.useState<string | undefined>();
  const [valueLg, setValueLg] = React.useState<string | undefined>();
  const [valueXl, setValueXl] = React.useState<string | undefined>();
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const [isFindOpen, setIsFindOpen] = React.useState(false);
  const [showBookmarks, setShowBookmarks] = React.useState(false);
  const [showFullUrls, setShowFullUrls] = React.useState(false);
  const [profile, setProfile] = React.useState("michael");

  const closeSubs = () => {
    setIsShareOpen(false);
    setIsFindOpen(false);
  };

  const handleValueChangeXs = (nextValue: string | undefined) => {
    if (nextValue == null) closeSubs();
    setValueXs(nextValue);
  };

  const handleValueChangeSm = (nextValue: string | undefined) => {
    if (nextValue == null) closeSubs();
    setValueSm(nextValue);
  };

  const handleValueChangeMd = (nextValue: string | undefined) => {
    if (nextValue == null) closeSubs();
    setValueMd(nextValue);
  };

  const handleValueChangeLg = (nextValue: string | undefined) => {
    if (nextValue == null) closeSubs();
    setValueLg(nextValue);
  };

  const handleValueChangeXl = (nextValue: string | undefined) => {
    if (nextValue == null) closeSubs();
    setValueXl(nextValue);
  };

  const items: MenubarMenuData[] = [
    {
      value: "file",
      title: "文件",
      triggerProps: { onPress: closeSubs },
      contentProps: { insets: contentInsets },
      items: [
        { title: "新建标签页", shortcut: "⌘T" },
        { title: "新建窗口", shortcut: "⌘N" },
        { title: "新建无痕窗口", disabled: true },
        { type: "separator" },
        {
          type: "submenu",
          title: "分享",
          submenuProps: { open: isShareOpen, onOpenChange: setIsShareOpen },
          items: [{ title: "邮件链接" }, { title: "信息" }, { title: "备忘录" }],
        },
        { type: "separator" },
        { title: "打印...", shortcut: "⌘P" },
      ],
    },
    {
      value: "edit",
      title: "编辑",
      triggerProps: { onPress: closeSubs },
      contentProps: { insets: contentInsets, className: "native:w-48" },
      items: [
        { title: "撤销", shortcut: "⌘Z" },
        { title: "重做", shortcut: "⇧⌘Z" },
        { type: "separator" },
        {
          type: "submenu",
          title: "查找",
          submenuProps: { open: isFindOpen, onOpenChange: setIsFindOpen },
          items: [
            { title: "搜索网页" },
            { type: "separator" },
            { title: "查找..." },
            { title: "查找下一个" },
            { title: "查找上一个" },
          ],
        },
        { type: "separator" },
        { title: "剪切" },
        { title: "复制" },
        { title: "粘贴" },
      ],
    },
    {
      value: "view",
      title: "视图",
      triggerProps: { onPress: closeSubs },
      contentProps: { insets: contentInsets },
      items: [
        {
          type: "checkbox",
          title: "始终显示书签栏",
          checked: showBookmarks,
          onCheckedChange: setShowBookmarks,
          checkboxProps: { closeOnPress: false },
        },
        {
          type: "checkbox",
          title: "始终显示完整网址",
          checked: showFullUrls,
          onCheckedChange: setShowFullUrls,
          checkboxProps: { closeOnPress: false },
        },
        { type: "separator" },
        { title: "重新加载", inset: true, shortcut: "⌘R" },
        { title: "强制重新加载", disabled: true, inset: true, shortcut: "⇧⌘R" },
        { type: "separator" },
        { title: "切换全屏", inset: true },
        { type: "separator" },
        { title: "隐藏侧边栏", inset: true },
      ],
    },
    {
      value: "profile",
      title: "个人资料",
      triggerProps: { onPress: closeSubs },
      contentProps: { insets: contentInsets },
      items: [
        {
          type: "radio-group",
          radioGroupProps: { value: profile, onValueChange: setProfile },
          items: [
            {
              type: "radio",
              title: "Andy",
              value: "andy",
              radioItemProps: { closeOnPress: false },
            },
            {
              type: "radio",
              title: "Michael",
              value: "michael",
              radioItemProps: { closeOnPress: false },
            },
            {
              type: "radio",
              title: "Creed",
              value: "creed",
              radioItemProps: { closeOnPress: false },
            },
          ],
        },
        { type: "separator" },
        { title: "编辑...", inset: true },
        { type: "separator" },
        { title: "添加个人资料...", inset: true },
      ],
    },
  ];

  return (
    <ExampleStack>
      <ExampleBlock title="菜单栏">
        <Menubar
          size="xs"
          contentSize="xs"
          nativeHaptics
          itemNativeHaptics
          className="self-center web:w-fit"
          items={items}
          value={valueXs}
          onValueChange={handleValueChangeXs}
        />
        <Menubar
          size="sm"
          contentSize="sm"
          nativeHaptics
          itemNativeHaptics
          className="self-center web:w-fit"
          items={items}
          value={valueSm}
          onValueChange={handleValueChangeSm}
        />
        <Menubar
          size="md"
          contentSize="md"
          nativeHaptics
          itemNativeHaptics
          className="self-center web:w-fit"
          items={items}
          value={valueMd}
          onValueChange={handleValueChangeMd}
        />
        <Menubar
          size="lg"
          contentSize="lg"
          nativeHaptics
          itemNativeHaptics
          className="self-center web:w-fit"
          items={items}
          value={valueLg}
          onValueChange={handleValueChangeLg}
        />
        <Menubar
          size="xl"
          contentSize="xl"
          nativeHaptics
          itemNativeHaptics
          className="self-center web:w-fit"
          items={items}
          value={valueXl}
          onValueChange={handleValueChangeXl}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
