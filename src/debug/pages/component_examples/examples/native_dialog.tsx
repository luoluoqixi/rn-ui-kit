import { useState } from "react";

import { Button, confirmNative } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function NativeDialogExample() {
  const [result, setResult] = useState("尚未打开");

  const openDialog = async () => {
    const next = await confirmNative({
      buttons: [
        { key: "cancel", style: "cancel", text: "取消" },
        { key: "archive", text: "归档" },
        { key: "delete", style: "destructive", text: "删除" },
      ],
      message: "这是平台原生确认弹窗，适合少量且明确的选择。",
      title: "处理当前草稿",
    });
    setResult(String(next));
  };

  return (
    <ExampleStack>
      <ExampleBlock description={`最近结果：${result}`} title="多按钮确认">
        <Button onPress={() => void openDialog()}>打开原生弹窗</Button>
      </ExampleBlock>
    </ExampleStack>
  );
}
