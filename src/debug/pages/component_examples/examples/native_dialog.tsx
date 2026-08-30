import { useState } from "react";

import { Button, confirmNative, triggerNativeHaptics } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function NativeDialogExample() {
  const [result, setResult] = useState("尚未打开");

  const openDialog = async () => {
    triggerNativeHaptics(true);
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

  const showBasicNativeDialog = async () => {
    triggerNativeHaptics(true);
    const result = await confirmNative({
      cancelText: "稍后",
      confirmText: "保存",
      message: "当前草稿还没有写入本地文件。",
      title: "保存更改",
    });
    setResult(`普通确认：${result}`);
  };

  const showDestructiveNativeDialog = async () => {
    triggerNativeHaptics(true);
    const result = await confirmNative({
      confirmText: "删除",
      destructive: true,
      message: "删除后仅用于演示，不会真的移除文件。",
      title: "删除笔记",
    });
    setResult(`危险操作：${result}`);
  };

  return (
    <ExampleStack>
      <ExampleBlock description={`最近结果：${result}`} title="多按钮确认">
        <Button onPress={() => void openDialog()}>打开原生弹窗</Button>
        <Button onPress={showBasicNativeDialog}>原生确认</Button>
        <Button onPress={showDestructiveNativeDialog} variant="destructive">
          原生危险确认
        </Button>
      </ExampleBlock>
    </ExampleStack>
  );
}
