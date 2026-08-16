import { useState } from "react";

import { Button, Slider, isWeb } from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function SliderExample() {
  const [value, setValue] = useState(42);

  return (
    <ExampleStack>
      <ExampleBlock description={`字号：${value}px`} title="可拖拽数值">
        <Slider
          max={72}
          min={12}
          onValueChange={(next) => setValue(next[0] ?? 12)}
          step={1}
          value={[value]}
        />
        {!isWeb() && (
          <Slider
            style={{
              marginVertical: 15,
            }}
            native={false}
            max={72}
            min={12}
            onValueChange={(next) => setValue(next[0] ?? 12)}
            step={1}
            value={[value]}
          />
        )}
        <ExampleRow>
          <Button onPress={() => setValue(12)} size="$3" variant="outlined">
            最小
          </Button>
          <Button onPress={() => setValue(42)} size="$3" variant="outlined">
            默认
          </Button>
          <Button onPress={() => setValue(72)} size="$3" variant="outlined">
            最大
          </Button>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
