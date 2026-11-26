import { useRef } from "react";

import { Input, Label, type TextInputHandle } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function LabelExample() {
  const nameRef = useRef<TextInputHandle>(null);
  const requiredRef = useRef<TextInputHandle>(null);
  const invalidRef = useRef<TextInputHandle>(null);
  return (
    <ExampleStack>
      <ExampleBlock
        title="基本标签"
        description="点击标签聚焦输入框；两端分别使用 HTML 关联与原生 ref。"
      >
        <Label nativeID="label-name" htmlFor="input-name" controlRef={nameRef}>
          工作区名称
        </Label>
        <Input
          controlRef={nameRef}
          nativeID="input-name"
          accessibilityLabel="工作区名称"
          aria-labelledby="label-name"
          placeholder="为工作区命名"
        />
      </ExampleBlock>
      <ExampleBlock title="必填项">
        <Label
          nativeID="label-required"
          htmlFor="input-required"
          controlRef={requiredRef}
          isRequired
        >
          电子邮箱
        </Label>
        <Input
          controlRef={requiredRef}
          nativeID="input-required"
          accessibilityLabel="电子邮箱"
          aria-labelledby="label-required"
          isRequired
          inputMode="email"
          placeholder="name@example.com"
        />
      </ExampleBlock>
      <ExampleBlock title="无效状态">
        <Label
          nativeID="label-invalid"
          htmlFor="input-invalid"
          controlRef={invalidRef}
          isRequired
          isInvalid
        >
          项目标识
        </Label>
        <Input
          controlRef={invalidRef}
          nativeID="input-invalid"
          accessibilityLabel="项目标识"
          aria-labelledby="label-invalid"
          isInvalid
          defaultValue="项目 标识"
        />
      </ExampleBlock>
      <ExampleBlock title="禁用状态">
        <Label nativeID="label-disabled" htmlFor="input-disabled" isDisabled>
          归档名称
        </Label>
        <Input
          nativeID="input-disabled"
          accessibilityLabel="归档名称"
          aria-labelledby="label-disabled"
          isDisabled
          defaultValue="只读工作区"
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
