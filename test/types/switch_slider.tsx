import { createRef } from "react";
import type { View } from "react-native";
import { Switch, Slider, type SwitchProps, type SliderProps } from "../../src/core";
const rn = createRef<View>();
const dom = createRef<HTMLDivElement>();
void (<Switch native isSelected defaultSelected onSelectedChange={v => v.valueOf()} size="lg"
  label={({ isSelected }) => isSelected ? "开启" : "关闭"} description="说明" labelPosition="left"
  nativeSwiftProps={{ modifiers: [] }} nativeComposeProps={{ enabled: false }} nativeHaptics="light"
  herouiNativeProps={{ ref: rn }} herouiWebProps={{ ref: dom, onFocus: e => e.currentTarget.getAttribute("id") }}
  controlProps={{ herouiNativeProps: { animation: { scale: { value: [1, 0.95] } } } }}
  thumbProps={{ herouiNativeProps: { animation: { left: { value: 2 } } } }} />);
void (<Slider value={30} onChange={v => v.toFixed(2)} onChangeEnd={v => v.toFixed(2)} minValue={0} maxValue={100} step={5} />);
void (<Slider defaultValue={[20, 80]} onChange={v => v.map(Math.round)} onChangeEnd={v => v.map(Math.round)} thumbLabels={["最低", "最高"]} />);
void (<Slider<number[]> onChange={v => v.map(Math.round)} nativeHapticsInterval={10} />);
void (<Slider label="音量" showValueLabel valueLabel={({ formattedValue }) => formattedValue}
  herouiNativeProps={{ ref: rn }} herouiWebProps={{ ref: dom, style: ({ isDisabled }) => ({ opacity: isDisabled ? 0.5 : 1 }) }}
  trackProps={{ herouiNativeProps: { hitSlop: 16 } }} thumbProps={{ herouiNativeProps: { animation: { scale: { value: [1, 0.7] } } } }} />);
void ({} satisfies SwitchProps);
void ({} satisfies SliderProps);
// @ts-expect-error RNR checked is removed.
void (<Switch checked />);
// @ts-expect-error Old size scale is removed.
void (<Switch size="xl" />);
// @ts-expect-error Shared selection cannot be overridden in a platform namespace.
void (<Switch herouiWebProps={{ isSelected: true }} />);
// @ts-expect-error No hidden second selection model in the native control slot.
void (<Switch controlProps={{ herouiNativeProps: { isSelected: true } }} />);
// @ts-expect-error Native refs are not DOM refs.
void (<Switch herouiWebProps={{ ref: rn }} />);
// @ts-expect-error Slider uses HeroUI minValue.
void (<Slider min={0} />);
// @ts-expect-error Neither library has Slider size.
void (<Slider size="sm" />);
// @ts-expect-error Array callbacks are inferred for array values.
void (<Slider value={[20,80]} onChange={v => v.toFixed(2)} />);
// @ts-expect-error Platform props cannot replace public callbacks.
void (<Slider herouiNativeProps={{ onChange: () => {} }} />);
// @ts-expect-error Native thumb refs are not DOM refs.
void (<Slider thumbProps={{ herouiNativeProps: { ref: dom } }} />);
