import { useState } from "react";

import { Button, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function ButtonExample() {
  const [count, setCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setCount((current) => current + 1);
      setSaving(false);
    }, 700);
  };

  return (
    <ExampleStack>
      <ExampleBlock description="把按钮变体放进一个有明确状态的保存操作中。" title="保存工作区">
        <ExampleRow>
          <Button disabled={saving} onPress={save} theme="accent">
            {saving ? "正在保存…" : "保存更改"}
          </Button>
          <Button disabled={saving} onPress={() => setCount(0)} variant="outlined">
            重置计数
          </Button>
          <Button chromeless onPress={() => setCount((current) => current + 1)}>
            仅更新
          </Button>
        </ExampleRow>
        <Text opacity={0.6}>已完成 {count} 次保存；提交期间其他操作会被禁用。</Text>
      </ExampleBlock>
      <ExampleBlock description="同一 API 的语义色、轮廓与禁用状态。" title="操作层级">
        <ExampleRow>
          <Button theme="green">确认</Button>
          <Button theme="red">删除</Button>
          <Button variant="outlined">次要操作</Button>
          <Button disabled>不可用</Button>
          <Button native>Native</Button>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
