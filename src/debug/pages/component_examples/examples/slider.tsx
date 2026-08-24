import { useState } from "react";

import { Button, Slider, Text, isWeb } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function SliderExample() {
  const [steppedValue, setSteppedValue] = useState(56);
  const [continuousValue, setContinuousValue] = useState(50);
  const [finishedValue, setFinishedValue] = useState(56);
  const [rangeValues, setRangeValues] = useState([25, 75]);
  const [nativeValue, setNativeValue] = useState(56);
  const [nativeStepValue, setNativeStepValue] = useState(40);

  return (
    <ExampleStack>
      <ExampleBlock description={`拖动结束值：${finishedValue}`} title="Slider">
        <Text className="font-medium">步进值：{steppedValue}</Text>
        <Slider
          max={100}
          min={0}
          native={false}
          onChange={(value) => setSteppedValue(value)}
          onChangeFinished={(value) => setFinishedValue(value)}
          step={1}
          value={steppedValue}
        />
        <Text className="font-medium">连续值：{continuousValue.toFixed(2)}</Text>
        <Slider
          max={100}
          min={0}
          native={false}
          onChange={(value) => setContinuousValue(value)}
          step={0}
          value={continuousValue}
        />
        <Text className="font-medium">
          范围值：{rangeValues[0]} - {rangeValues[1]}
        </Text>
        <Slider
          max={100}
          min={0}
          native={false}
          onValueChange={setRangeValues}
          step={5}
          thumbCount={2}
          value={rangeValues}
        />
        <ExampleRow>
          <Button onPress={() => setSteppedValue(0)} title="最小" variant="outline" />
          <Button onPress={() => setSteppedValue(50)} title="默认" variant="outline" />
          <Button onPress={() => setSteppedValue(100)} title="最大" variant="outline" />
        </ExampleRow>
      </ExampleBlock>

      {!isWeb() ? (
        <ExampleBlock description="Expo UI 原生平台实现。" title="原生 Slider">
          <Text className="font-medium">原生值：{nativeValue.toFixed(2)}</Text>
          <Slider
            max={100}
            min={0}
            step={0}
            onChange={(value) => setNativeValue(value)}
            value={nativeValue}
          />
          <Text className="font-medium">原生步进值：{nativeStepValue}</Text>
          <Slider
            max={100}
            min={0}
            onChange={setNativeStepValue}
            step={1}
            value={nativeStepValue}
          />
          <ExampleRow>
            <Button onPress={() => setNativeValue(0)} title="最小" variant="outline" />
            <Button onPress={() => setNativeValue(50)} title="默认" variant="outline" />
            <Button onPress={() => setNativeValue(100)} title="最大" variant="outline" />
          </ExampleRow>
        </ExampleBlock>
      ) : null}
    </ExampleStack>
  );
}
