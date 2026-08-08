import { useMemo, useState } from "react";

import { isWeb, Label, os, Select, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

import { View } from "react-native";

export function SelectExample() {
  const [selectValue, setSelectValue] = useState<string | null>("blue");
  const [selectValue2, setSelectValue2] = useState<string | null>("light");

  const [selectGroupedValue, setSelectGroupedValue] = useState<string | null>("edit-desc");
  const [selectNativePickerValue, setSelectNativePickerValue] = useState<string | null>("blue");

  const selectItems = useMemo(
    () => [
      { label: "蓝色", value: "blue" },
      { label: "绿色", value: "green" },
      { label: "橙色", value: "orange" },
      { label: "粉色", value: "pink" },
      { label: "红色", value: "red" },
      { label: "白色", value: "white" },
      { label: "黑色", value: "black" },
      { label: "紫色", value: "purple" },
      { label: "黄色", value: "yellow" },
      { label: "灰色", value: "gray" },
      { label: "棕色", value: "brown" },
      { label: "青色", value: "cyan" },
      { label: "靛色", value: "indigo" },
      { label: "金色", value: "gold" },
      { label: "银色", value: "silver" },
    ],
    [],
  );

  const selectItems2 = useMemo(
    () => [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
    ],
    [],
  );

  const selectSortGroups = useMemo(
    () => [
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
    ],
    [],
  );

  return (
    <ExampleStack>
      <ExampleBlock description="" title="Sheet示例">
        {!isWeb() && (
          <>
            <Label>Select (native-sheet)</Label>
            <Select
              items={selectItems}
              native="native-sheet"
              onValueChange={setSelectValue}
              placeholder="选择主题色"
              value={selectValue ?? undefined}
            />
            <Label>Select (custom-sheet)</Label>
            <Select
              items={selectItems}
              native="custom-sheet"
              onValueChange={setSelectValue}
              placeholder="选择主题色"
              value={selectValue ?? undefined}
            />
          </>
        )}
        {isWeb() && (
          <>
            <Label>Select (sheet)</Label>
            <Select
              items={selectItems}
              native="native-sheet"
              onValueChange={setSelectValue}
              placeholder="选择主题色"
              value={selectValue ?? undefined}
            />
          </>
        )}
        <Select
          items={selectItems}
          native="native-sheet"
          nativeTrigger
          onValueChange={setSelectValue}
          placeholder="选择主题色"
          value={selectValue ?? undefined}
        />
        <Text color="$color">当前主题色：{selectValue ?? "未选择"}</Text>
      </ExampleBlock>

      <ExampleBlock title="原生示例">
        {!isWeb() && (
          <View>
            <Label>Select Native (Dropdown)</Label>
            <Select
              items={selectItems}
              native
              nativePickerMode="dropdown"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Select
              items={selectItems}
              native
              nativeTrigger
              nativePickerMode="dropdown"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Text color="$color">当前主题色(原生)：{selectNativePickerValue ?? "未选择"}</Text>
          </View>
        )}

        {isWeb() && (
          <ExampleBlock title="Web示例">
            <Label>Select (长列表)</Label>
            <Select
              items={selectItems}
              native={false}
              onValueChange={setSelectValue}
              placeholder="选择主题色"
              value={selectValue ?? undefined}
            />
            <Select
              items={selectItems}
              native={false}
              nativeTrigger
              onValueChange={setSelectValue}
              placeholder="选择主题色"
              value={selectValue ?? undefined}
            />
            <Text color="$color">当前主题色：{selectValue ?? "未选择"}</Text>
          </ExampleBlock>
        )}

        {os() === "ios" && (
          <View>
            <Label>Select Native (Wheel Sheet)</Label>
            <Select
              items={selectItems}
              native
              nativePickerMode="wheel"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Select
              items={selectItems}
              native
              nativeTrigger
              nativePickerMode="wheel"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Text color="$color">
              当前主题色(原生 Sheet)：{selectNativePickerValue ?? "未选择"}
            </Text>
          </View>
        )}
        {os() === "android" && (
          <View>
            <Label>Select Native (Dialog)</Label>
            <Select
              items={selectItems}
              native
              nativePickerMode="dialog"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Select
              items={selectItems}
              native
              nativeTrigger
              nativePickerMode="dialog"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Text color="$color">当前主题色(原生)：{selectNativePickerValue ?? "未选择"}</Text>
          </View>
        )}
      </ExampleBlock>

      <ExampleBlock title="简单示例">
        <Label>Select</Label>
        <Select
          items={selectItems2}
          native={false}
          onValueChange={setSelectValue2}
          placeholder="选择主题"
          value={selectValue2 ?? undefined}
        />
        <Select
          items={selectItems2}
          native={false}
          nativeTrigger
          onValueChange={setSelectValue2}
          placeholder="选择主题"
          value={selectValue2 ?? undefined}
        />
        <Text color="$color">当前主题：{selectValue2 ?? "未选择"}</Text>

        <View>
          <Label>Select Native</Label>
          <Select
            items={selectItems2}
            onValueChange={setSelectValue2}
            placeholder="选择主题"
            value={selectValue2 ?? undefined}
            native
          />
          <Select
            items={selectItems2}
            nativeTrigger
            onValueChange={setSelectValue2}
            placeholder="选择主题"
            value={selectValue2 ?? undefined}
            native
          />
          <Text color="$color">当前主题(原生)：{selectValue2 ?? "未选择"}</Text>
        </View>
      </ExampleBlock>

      <ExampleBlock title="Grouped示例">
        <Label>Select Grouped</Label>
        <Select
          native={false}
          itemGroups={selectSortGroups}
          onValueChange={setSelectGroupedValue}
          placeholder="选择排序方式"
          value={selectGroupedValue ?? undefined}
        />
        <Select
          native={false}
          nativeTrigger
          itemGroups={selectSortGroups}
          onValueChange={setSelectGroupedValue}
          placeholder="选择排序方式"
          value={selectGroupedValue ?? undefined}
        />
        <Text color="$color">当前排序：{selectGroupedValue ?? "未选择"}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
