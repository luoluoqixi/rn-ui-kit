import { useState } from "react";
import { View } from "react-native";

import {
  BrightnessSlider,
  ColorPicker,
  HueCircular,
  HueSlider,
  OpacitySlider,
  Panel1,
  Panel2,
  Panel3,
  Preview,
  PreviewText,
  SaturationSlider,
  Swatches,
  Text,
  useUiTheme,
  type AccentScale,
} from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

const SWATCHES = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export function ColorPickerExample() {
  const theme = useUiTheme();
  const [color, setColor] = useState("#3b82f6");
  return (
    <ExampleStack>
      <ExampleBlock title="主色色阶" description="编号越大强调越强；accent03 为 hover，accent 为按下与选中。">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {Array.from({ length: 12 }, (_, index) => {
            const name = `accent${String(index + 1).padStart(2, "0")}` as keyof AccentScale;
            return (
              <View key={name} style={{ gap: 4, width: 100 }}>
                <View style={{ backgroundColor: theme[name], height: 48, borderRadius: 6, borderWidth: 1, borderColor: theme.border }} />
                <Text>{name}</Text>
                <Text variant="muted">{theme[name]}</Text>
              </View>
            );
          })}
        </View>
      </ExampleBlock>
      <ExampleBlock description={`当前颜色：${color}`} title="ColorPicker">
        <ColorPicker
          value={color}
          onChangeJS={({ hex }) => setColor(hex)}
          onCompleteJS={({ hex }) => setColor(hex)}
          style={{ gap: 14, width: "100%" }}
        >
          <Preview style={{ height: 48, width: "100%" }} />
          <Panel1 style={{ height: 260, width: "100%" }} />
          <HueSlider />
          <BrightnessSlider />
          <OpacitySlider />
          <PreviewText colorFormat="hex" />
          <Swatches
            colors={SWATCHES}
            style={{ gap: 8 }}
            swatchStyle={{ height: 30, width: 30 }}
          />
        </ColorPicker>
      </ExampleBlock>
      <ExampleBlock title="不同布局">
        <View style={{ gap: 12 }}>
          <ColorPicker style={{ gap: 14 }} value={color} onChangeJS={({ hex }) => setColor(hex)}>
            <Panel1 style={{ height: 180, width: "100%" }} />
            <HueSlider />
            <PreviewText colorFormat="rgb" />
          </ColorPicker>
        </View>
      </ExampleBlock>
      <ExampleBlock description="Panel2 适合以色相和明度为主的紧凑布局。" title="Panel2">
        <ColorPicker
          value={color}
          onChangeJS={({ hex }) => setColor(hex)}
          style={{ gap: 16 }}
          thumbShape="ring"
          thumbSize={28}
        >
          <Panel2 style={{ height: 220, width: "100%" }} />
          <HueSlider />
          <PreviewText colorFormat="hsl" />
        </ColorPicker>
      </ExampleBlock>
      <ExampleBlock description="Panel3 与独立通道滑块可以组合成更完整的编辑器。" title="多通道组合">
        <ColorPicker
          sliderThickness={24}
          style={{ gap: 16 }}
          thumbSize={24}
          value={color}
          onChangeJS={({ hex }) => setColor(hex)}
        >
          <Panel3 style={{ height: 220, width: "100%" }} />
          <HueSlider />
          <SaturationSlider />
          <BrightnessSlider />
          <PreviewText colorFormat="hsva" />
        </ColorPicker>
      </ExampleBlock>
      <ExampleBlock description="环形色相选择器适合窄屏或横向工具栏。" title="HueCircular">
        <ColorPicker style={{ gap: 16 }} value={color} onChangeJS={({ hex }) => setColor(hex)}>
          <View style={{ alignItems: "center" }}>
            <HueCircular style={{ height: 220, width: 220 }} />
          </View>
          <Panel1 style={{ height: 160, width: "100%" }} />
          <PreviewText colorFormat="hex" />
        </ColorPicker>
      </ExampleBlock>
    </ExampleStack>
  );
}
