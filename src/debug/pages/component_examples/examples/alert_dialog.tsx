import { useState } from "react";

import { AlertDialog, Button } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function AlertDialogExample() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("尚未操作");

  return (
    <ExampleStack>
      <ExampleBlock description={`最近结果：${result}`} title="危险操作确认">
        <AlertDialog
          cancelLabel="取消"
          contentProps={{ style: { width: "90%", maxWidth: 420 } }}
          destructiveLabel="删除"
          description="先在弹窗中做最后确认；此操作仅用于演示，不会删除真实数据。"
          onOpenChange={setOpen}
          open={open}
          title="删除 3 个草稿？"
          trigger={<Button onPress={() => setOpen(true)}>打开 AlertDialog</Button>}
          actions={
            <Button
              onPress={() => {
                setResult("确认删除");
                setOpen(false);
              }}
              theme="red"
            >
              自定义动作
            </Button>
          }
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
