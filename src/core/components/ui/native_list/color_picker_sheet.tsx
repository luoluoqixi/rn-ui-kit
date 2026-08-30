import * as React from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import {
  BrightnessSlider,
  ColorPicker,
  HueSlider,
  Panel1,
  Preview,
} from "../color_picker";
import type { ColorFormatsObject } from "../color_picker";
import { Button } from "../button";
import { NativeSheet, NativeSheetScrollContent } from "../sheet/native_sheet";
import { Text } from "../text";
import { isIos26Plus } from "../utils/platform";
import type { ButtonProps } from "../button";
import type { NativeListColorPickerItemProps } from "./types";

const DEFAULT_PICKER_HEIGHT = 480;

export type NativeListColorPickerSheetProps = Pick<
  NativeListColorPickerItemProps,
  | "color"
  | "colorPickerProps"
  | "confirmOnDone"
  | "onColorChange"
  | "pickerHeight"
  | "sheetProps"
> & { open: boolean; onOpenChange: (open: boolean) => void };

export function NativeListColorPickerSheet({
  color,
  colorPickerProps,
  confirmOnDone = true,
  onColorChange,
  open,
  onOpenChange,
  pickerHeight = DEFAULT_PICKER_HEIGHT,
  sheetProps,
  nativeButtonSwiftProps,
}: Pick<
  NativeListColorPickerItemProps,
  | "color"
  | "colorPickerProps"
  | "confirmOnDone"
  | "onColorChange"
  | "pickerHeight"
  | "sheetProps"
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nativeButtonSwiftProps?: ButtonProps["nativeSwiftProps"];
}) {
  const { height: windowHeight } = useWindowDimensions();
  const usesIos26GlassButtons = isIos26Plus();
  const [draftColor, setDraftColor] = React.useState(color);
  // Keep the detent stable throughout presentation and dismissal. Measuring the
  // picker after the sheet mounts causes Android BottomSheet to reconfigure its
  // behavior mid-animation, which can briefly expand it to the largest height.
  const sheetChromeExtraHeight = confirmOnDone ? (usesIos26GlassButtons ? 48 : 40) : 32;
  const detent = Math.min(
    1,
    Math.max(0.25, (pickerHeight + sheetChromeExtraHeight) / Math.max(1, windowHeight)),
  );
  const resolvedDetents = React.useMemo(() => [detent], [detent]);
  const resolvedScrollableOptions = React.useMemo(
    () => ({ ...sheetProps?.scrollableOptions, scrollingExpandsSheet: false }),
    [sheetProps?.scrollableOptions],
  );
  const handleChange = React.useCallback(
    (colors: ColorFormatsObject) => {
      colorPickerProps?.onChangeJS?.(colors);
      setDraftColor(colors.hex);
      if (!confirmOnDone) onColorChange?.(colors.hex);
    },
    [colorPickerProps, confirmOnDone, onColorChange],
  );
  const handleComplete = React.useCallback(
    (colors: ColorFormatsObject) => colorPickerProps?.onCompleteJS?.(colors),
    [colorPickerProps],
  );
  React.useEffect(() => {
    if (open) setDraftColor(color);
  }, [color, open]);
  const cancel = React.useCallback(() => onOpenChange(false), [onOpenChange]);
  const done = React.useCallback(() => {
    if (confirmOnDone && draftColor !== color) onColorChange?.(draftColor);
    onOpenChange(false);
  }, [color, confirmOnDone, draftColor, onColorChange, onOpenChange]);

  return (
    <NativeSheet
      {...sheetProps}
      detents={resolvedDetents}
      grabber={sheetProps?.grabber ?? !confirmOnDone}
      open={open}
      scrollable
      scrollableOptions={resolvedScrollableOptions}
      onOpenChange={onOpenChange}
    >
      <NativeSheetScrollContent
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 16, paddingTop: 0 }}
        style={{ flex: 1, minHeight: 0 }}
      >
        <View style={{ width: "100%" }}>
          {confirmOnDone ? (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                height: usesIos26GlassButtons ? 72 : 60,
                justifyContent: "space-between",
              }}
            >
              <Button
                buttonSize={{ height: 40, width: 80 }}
                native={Platform.OS === "ios"}
                nativeButtonStyle={usesIos26GlassButtons ? "glass" : "automatic"}
                nativeSwiftProps={nativeButtonSwiftProps}
                title="取消"
                variant="ghost"
                onPress={cancel}
              />
              <Text className="text-base font-semibold">选择颜色</Text>
              <Button
                buttonSize={{ height: 40, width: 80 }}
                native={Platform.OS === "ios"}
                nativeButtonStyle={usesIos26GlassButtons ? "glass" : "automatic"}
                nativeSwiftProps={nativeButtonSwiftProps}
                title="完成"
                onPress={done}
                variant="ghost"
              />
            </View>
          ) : null}
          <ColorPicker
            {...colorPickerProps}
            value={draftColor}
            onChangeJS={handleChange}
            onCompleteJS={handleComplete}
            style={[{ gap: 16, width: "100%" }, colorPickerProps?.style]}
          >
            {colorPickerProps?.children ?? (
              <>
                <Preview style={{ height: 44, width: "100%" }} />
                <Panel1 style={{ height: 240, width: "100%" }} />
                <HueSlider />
                <BrightnessSlider />
              </>
            )}
          </ColorPicker>
        </View>
      </NativeSheetScrollContent>
    </NativeSheet>
  );
}
