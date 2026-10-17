import * as React from "react";
import { Platform, ScrollView, View, useWindowDimensions } from "react-native";

import { NativeSheet, NativeSheetScrollContent } from "../sheet/native_sheet";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { resolveRenderProp } from "../utils/render";
import { useUiTheme } from "../utils/theme";
import {
  renderSelectText,
  flattenItems,
  SelectNativeTrigger,
  SelectBasicTrigger,
  useSelectState,
} from "./shared";
import type { SelectHandle, SelectItemData, SelectItemGroupData, SelectProps } from "./types";

const SELECT_SHEET_MAX_DETENT = 0.5;
const SELECT_SHEET_MIN_DETENT = 0.18;
const SELECT_SHEET_ITEM_HEIGHT = 52;
const SELECT_SHEET_GROUP_LABEL_HEIGHT = 28;
const SELECT_SHEET_CHROME_HEIGHT = 12 + 5 + 6 + 4 + 24;
const SELECT_SHEET_GRABBER_TOP_MARGIN = 12;
const SELECT_SHEET_GRABBER_WIDTH = 92;
const SELECT_SHEET_GRABBER_HEIGHT = 5;
const SELECT_SHEET_GRABBER_CONTENT_INSET_TOP = 24;
const SELECT_SHEET_WEB_GRABBER_HEADER_HEIGHT = 24;

type NativeListType = typeof import("../native_list");

let NativeListCache: NativeListType | undefined;

function requireNativeList(): NativeListType {
  if (NativeListCache == null) {
    NativeListCache = require("../native_list");
  }
  if (NativeListCache == null) {
    throw new Error(`require NativeList error`);
  }
  return NativeListCache;
}

function getNativeList() {
  return requireNativeList().NativeList;
}

function getNativeListItem() {
  return requireNativeList().NativeListItem;
}

function getNativeListSection() {
  return requireNativeList().NativeListSection;
}

function withGrabberAlpha(color: string, alpha: number) {
  const hex = color.trim().replace(/^#/, "");
  if (hex.length !== 6 || !/^[0-9a-f]+$/i.test(hex)) return color;
  const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  return `rgba(${channels.join(", ")}, ${alpha})`;
}

function estimateSelectSheetContentHeight(groups: SelectItemGroupData[]) {
  return (
    SELECT_SHEET_CHROME_HEIGHT +
    groups.reduce(
      (height, group) =>
        height +
        group.items.length * SELECT_SHEET_ITEM_HEIGHT +
        (group.label == null ? 0 : SELECT_SHEET_GROUP_LABEL_HEIGHT),
      0,
    )
  );
}

export const SelectSheet = React.forwardRef<SelectHandle, SelectProps>(function SelectSheet(
  { children, ...props },
  ref,
) {
  const NativeList = getNativeList();
  const { height: windowHeight } = useWindowDimensions();
  if (
    children != null &&
    props.items == null &&
    props.itemGroups == null &&
    props.options == null
  ) {
    return <>{children}</>;
  }
  const { value, setValue } = useSelectState(props);
  const items = flattenItems(props);
  const groups = props.itemGroups ?? [{ items }];
  let selectedIndex = 0;
  let itemsBeforeSelected = 0;
  for (const group of groups) {
    const index = group.items.findIndex((item) => item.value === value);
    if (index >= 0) {
      selectedIndex = itemsBeforeSelected + index;
      break;
    }
    itemsBeforeSelected += group.items.length + 1;
  }
  const [open, setOpen] = React.useState(false);
  const androidScrollRef = React.useRef<ScrollView | null>(null);
  const androidInitialScrollDoneRef = React.useRef(false);
  const initialScrollY = Math.max(0, selectedIndex * 52 - 104);
  const estimatedContentHeight = estimateSelectSheetContentHeight(groups);
  const sheetDetent = Math.max(
    SELECT_SHEET_MIN_DETENT,
    Math.min(SELECT_SHEET_MAX_DETENT, estimatedContentHeight / Math.max(1, windowHeight)),
  );
  const customDetents = props.sheetProps?.detents;
  const customSnapPoints = props.sheetProps?.snapPoints;
  const resolvedDetents =
    customDetents != null && customDetents.length > 0
      ? customDetents
      : customSnapPoints != null && customSnapPoints.length > 0
        ? undefined
        : [sheetDetent];
  const haptics = useResolvedNativeHaptics(props.nativeHaptics);
  const theme = useUiTheme();
  const selectedValue = value ?? undefined;
  const select = (next: string) => {
    setValue(next);
    setOpen(false);
    props.onOpenChange?.(false);
  };
  const openSheet = () => {
    if (props.disabled || props.isDisabled) return;
    setOpen(true);
    androidInitialScrollDoneRef.current = false;
    props.onOpenChange?.(true);
    triggerNativeHaptics(haptics);
  };
  React.useImperativeHandle(
    ref,
    () => ({
      open: openSheet,
      close: () => setOpen(false),
    }),
    [openSheet],
  );
  const scrollAndroidToSelectedItem = React.useCallback(() => {
    if (Platform.OS !== "android") return;

    requestAnimationFrame(() => {
      androidScrollRef.current?.scrollTo({ animated: false, y: initialScrollY });
    });
  }, [initialScrollY]);
  return (
    <>
      {props.nativeTrigger ? (
        <SelectNativeTrigger props={props} value={selectedValue} onPress={openSheet} />
      ) : (
        <SelectBasicTrigger props={props} value={value ?? undefined} onPress={openSheet} />
      )}
      <NativeSheet
        {...(props.sheetProps as object)}
        detents={resolvedDetents}
        grabber={props.sheetProps?.grabber ?? true}
        grabberContentInsetTop={Platform.OS === "web" ? 0 : SELECT_SHEET_GRABBER_CONTENT_INSET_TOP}
        grabberOptions={{
          adaptive: false,
          color: withGrabberAlpha(theme.mutedForeground, 0.65),
          height: SELECT_SHEET_GRABBER_HEIGHT,
          topMargin: SELECT_SHEET_GRABBER_TOP_MARGIN,
          width: SELECT_SHEET_GRABBER_WIDTH,
        }}
        open={open}
        scrollable
        // TrueSheet Web 的 grabber 是绝对定位的；header 槽位位于滚动容器外，
        // 可防止列表内容滚动到拖拽条下方。
        header={
          Platform.OS === "web" ? (
            <View style={{ height: SELECT_SHEET_WEB_GRABBER_HEADER_HEIGHT, width: "100%" }} />
          ) : undefined
        }
        onOpenChange={(next) => {
          setOpen(next);
          props.onOpenChange?.(next);
        }}
        onAnimationComplete={({ open: didOpen }) => {
          if (didOpen) scrollAndroidToSelectedItem();
        }}
      >
        <View
          style={{
            flex: 1,
            minHeight: 0,
            paddingTop: 0,
            width: "100%",
          }}
        >
          {Platform.OS === "ios" ? (
            <NativeList
              contentMarginBottom={0}
              contentMarginTop={4}
              initialScrollTarget={selectedValue ?? items[0]?.value}
              native
              scrollable
              style={{ flex: 1, minHeight: 0, width: "100%" }}
            >
              <SelectSheetGroups
                groups={groups}
                nativeHaptics={props.nativeHaptics}
                onSelect={select}
                selectedValue={selectedValue}
              />
            </NativeList>
          ) : (
            <NativeSheetScrollContent
              ref={androidScrollRef}
              contentOffset={{ x: 0, y: initialScrollY }}
              contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}
              onContentSizeChange={() => {
                if (androidInitialScrollDoneRef.current) return;
                androidInitialScrollDoneRef.current = true;
                scrollAndroidToSelectedItem();
              }}
              onLayout={() => {
                if (androidInitialScrollDoneRef.current) return;
                scrollAndroidToSelectedItem();
              }}
              style={{ flex: 1, minHeight: 0, width: "100%" }}
            >
              <SelectSheetGroups
                groups={groups}
                nativeHaptics={props.nativeHaptics}
                onSelect={select}
                selectedValue={selectedValue}
              />
            </NativeSheetScrollContent>
          )}
        </View>
      </NativeSheet>
    </>
  );
});

function SelectSheetGroups({
  groups,
  selectedValue,
  onSelect,
  nativeHaptics,
}: {
  groups: SelectItemGroupData[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  nativeHaptics?: SelectProps["nativeHaptics"];
}) {
  return (
    <>
      {groups.map((group, index) => (
        <SelectSheetGroup
          group={group}
          key={group.key ?? `select-group-${index}`}
          nativeHaptics={nativeHaptics}
          onSelect={onSelect}
          selectedValue={selectedValue}
        />
      ))}
    </>
  );
}

function SelectSheetGroup({
  group,
  selectedValue,
  onSelect,
  nativeHaptics,
}: {
  group: SelectItemGroupData;
  selectedValue?: string;
  onSelect: (value: string) => void;
  nativeHaptics?: SelectProps["nativeHaptics"];
}) {
  const NativeListSection = getNativeListSection();
  const title =
    group.label == null
      ? undefined
      : renderSelectText(resolveRenderProp(group.label, { value: selectedValue ?? "" }));
  return (
    <NativeListSection title={title}>
      {group.items.map((item) => (
        <SelectSheetItem
          item={item}
          key={item.value}
          nativeHaptics={nativeHaptics}
          onSelect={onSelect}
          selected={item.value === selectedValue}
        />
      ))}
    </NativeListSection>
  );
}

function SelectSheetItem({
  item,
  selected,
  onSelect,
  nativeHaptics,
}: {
  item: SelectItemData;
  selected: boolean;
  onSelect: (value: string) => void;
  nativeHaptics?: SelectProps["nativeHaptics"];
}) {
  const NativeListItem = getNativeListItem();
  const label = resolveRenderProp(item.label, {
    checked: selected,
    disabled: !!(item.disabled ?? item.isDisabled),
    selected,
    value: item.value,
  });
  const context = {
    checked: selected,
    disabled: !!(item.disabled ?? item.isDisabled),
    selected,
    value: item.value,
  };
  return (
    <NativeListItem
      {...(item.itemProps as any)}
      chevron={false}
      disabled={item.disabled ?? item.isDisabled}
      icon={
        item.swatchColor == null ? undefined : (
          <View
            style={{
              backgroundColor: item.swatchColor,
              borderRadius: 7,
              height: 14,
              width: 14,
            }}
          />
        )
      }
      iconColor={item.swatchColor}
      iconSize={item.swatchColor != null ? 14 : undefined}
      iconSlotWidth={item.swatchColor != null ? 24 : undefined}
      nativeHaptics={nativeHaptics}
      nativeScrollId={item.value}
      onPress={() => onSelect(item.value)}
      selected={selected}
      sfSymbol={item.swatchColor != null ? ("circle.fill" as any) : undefined}
      subtitle={resolveRenderProp(item.description, context)}
      trailing={resolveRenderProp(item.endContent, context)}
      title={label}
    />
  );
}
