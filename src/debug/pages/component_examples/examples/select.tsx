import { useMemo, useState, type ComponentProps } from "react";
import { View } from "react-native";

import { isAndroid, isIos, isWeb, Label, os, Select, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

const colors = [
  ["蓝色", "#007aff", "blue"],
  ["绿色", "#34c759", "green"],
  ["橙色", "#ff9500", "orange"],
  ["粉色", "#ff2d55", "pink"],
  ["红色", "#ff3b30", "red"],
  ["白色", "#f2f2f7", "white"],
  ["黑色", "#000000", "black"],
  ["紫色", "#af52de", "purple"],
  ["黄色", "#ffcc00", "yellow"],
  ["灰色", "#8e8e93", "gray"],
  ["棕色", "#a2845e", "brown"],
  ["青色", "#32ade6", "cyan"],
  ["靛色", "#5856d6", "indigo"],
  ["金色", "#d4af37", "gold"],
  ["银色", "#c0c0c0", "silver"],
].map(([label, swatchColor, value]) => ({ label, swatchColor, value }));

const themes = [
  { label: "浅色", value: "light" },
  { label: "深色", value: "dark" },
  { label: "跟随系统", value: "system" },
];

const groups = [
  {
    items: [
      { label: "文件名 (A-Z)", value: "name-asc" },
      { label: "文件名 (Z-A)", value: "name-desc" },
    ],
  },
  {
    items: [
      { label: "编辑时间 (从新到旧)", value: "edit-desc" },
      { label: "编辑时间 (从旧到新)", value: "edit-asc" },
    ],
  },
  {
    items: [
      { label: "创建时间 (从新到旧)", value: "create-desc" },
      { label: "创建时间 (从旧到新)", value: "create-asc" },
    ],
  },
];

function SelectPair({ children, ...props }: ComponentProps<typeof Select>) {
  return (
    <View className="gap-2">
      <View className="flex-row gap-2">
        <Select {...props}>{children}</Select>
        <Select {...props} nativeTrigger />
      </View>
      <Select {...props} className="w-full">
        {children}
      </Select>
      <Select {...props} className="w-full" nativeTrigger />
    </View>
  );
}

export function SelectExample() {
  const [color, setColor] = useState<string | null>("blue");
  const [theme, setTheme] = useState<string | null>("light");
  const [grouped, setGrouped] = useState<string | null>("name-asc");
  const [nativeValue, setNativeValue] = useState<string | null>("blue");
  const colorItems = useMemo(() => colors, []);
  const themeItems = useMemo(() => themes, []);
  const groupedItems = useMemo(() => groups, []);

  return (
    <ExampleStack>
      <ExampleBlock title="Sheet 示例">
        <Label>Native Sheet</Label>
        <SelectPair
          items={colorItems}
          native="sheet"
          onValueChange={setColor}
          placeholder="选择主题色"
          value={color}
        />
        <Text variant="muted">当前主题色：{color ?? "未选择"}</Text>
      </ExampleBlock>

      <ExampleBlock title="原生示例">
        {!isWeb() && (
          <>
            <Label>Native Dropdown</Label>
            <SelectPair
              items={colorItems}
              native="dropdown"
              onValueChange={setNativeValue}
              placeholder="选择主题色"
              value={nativeValue}
            />
          </>
        )}
        {os() === "android" && (
          <>
            <Label>Native Dialog</Label>
            <SelectPair
              items={colorItems}
              native="dialog"
              onValueChange={setNativeValue}
              placeholder="选择主题色"
              value={nativeValue}
            />
          </>
        )}
        {os() === "ios" && (
          <>
            <Label>Native Wheel</Label>
            <SelectPair
              items={colorItems}
              native="wheel"
              onValueChange={setNativeValue}
              placeholder="选择主题色"
              value={nativeValue}
            />
          </>
        )}
        {isWeb() && (
          <>
            <Label>Browser Native Select</Label>
            <SelectPair
              items={colorItems}
              native
              onValueChange={setNativeValue}
              placeholder="选择主题色"
              value={nativeValue}
            />
          </>
        )}
      </ExampleBlock>

      <ExampleBlock title="简单示例">
        <Label>Select Sheet</Label>
        <SelectPair
          items={themeItems}
          native="sheet"
          onValueChange={setTheme}
          placeholder="选择主题"
          value={theme}
        />
        <Label>Select Native=true</Label>
        <SelectPair
          items={themeItems}
          native
          onValueChange={setTheme}
          placeholder="选择主题"
          value={theme}
        />
        <Text variant="muted">当前主题：{theme ?? "未选择"}</Text>
      </ExampleBlock>

      <ExampleBlock title="Grouped 示例">
        <Label>Grouped Native Sheet</Label>
        <SelectPair
          itemGroups={groupedItems}
          native="sheet"
          onValueChange={setGrouped}
          placeholder="选择排序方式"
          value={grouped}
        />
        <Text variant="muted">当前排序：{grouped ?? "未选择"}</Text>
      </ExampleBlock>

      <ExampleBlock title="其他模式">
        <Label>Native false</Label>
        <SelectPair
          items={colorItems}
          native={false}
          onValueChange={setColor}
          placeholder="选择主题色"
          value={color}
        />
        {isWeb() && (
          <SelectPair
            items={colorItems}
            native={false}
            showScrollButtons={false}
            onValueChange={setColor}
            placeholder="选择主题色"
            value={color}
          />
        )}
      </ExampleBlock>

      <ExampleBlock title="禁用模式">
        <Label>正常 disable</Label>
        <SelectPair
          items={colorItems}
          disabled
          native={false}
          onValueChange={setColor}
          placeholder="选择主题色"
          value={color}
        />
        <Label>Sheet disable</Label>
        <SelectPair
          items={colorItems}
          disabled
          native="sheet"
          onValueChange={setColor}
          placeholder="选择主题色"
          value={color}
        />
        {!isWeb() && (
          <>
            <Label>Dropdown disable</Label>
            <SelectPair
              items={colorItems}
              disabled
              native="dropdown"
              onValueChange={setColor}
              placeholder="选择主题色"
              value={color}
            />
          </>
        )}
        {isAndroid() && (
          <>
            <Label>Dialog disable</Label>
            <SelectPair
              items={colorItems}
              disabled
              native="dialog"
              onValueChange={setColor}
              placeholder="选择主题色"
              value={color}
            />
          </>
        )}
        {isIos() && (
          <>
            <Label>Wheel disable</Label>
            <SelectPair
              items={colorItems}
              disabled
              native="wheel"
              onValueChange={setColor}
              placeholder="选择主题色"
              value={color}
            />
          </>
        )}
      </ExampleBlock>
    </ExampleStack>
  );
}
