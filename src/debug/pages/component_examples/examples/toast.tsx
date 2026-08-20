import { useState } from "react";

import { Button, Switch, useToast } from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function ToastExample() {
  const { toast } = useToast();
  const [isNative, setIsNative] = useState(true);

  return (
    <ExampleStack>
      <ExampleBlock description="涵盖普通结果、持续加载与异步任务状态。" title="全局反馈">
        <ExampleRow>
          <Switch checked={isNative} onCheckedChange={setIsNative} label="使用 Native Toast" />
        </ExampleRow>
        <ExampleRow>
          <Button
            onPress={() =>
              toast.success("保存成功", { description: "工作区配置已写入本地。", native: isNative })
            }
            theme="green"
          >
            成功
          </Button>
          <Button
            onPress={() =>
              toast.warning("空间不足", { description: "建议先清理附件缓存。", native: isNative })
            }
            variant="outlined"
          >
            警告
          </Button>
          <Button
            onPress={() =>
              toast.error("同步失败", { description: "请检查网络连接。", native: isNative })
            }
            theme="red"
          >
            失败
          </Button>
        </ExampleRow>
        <ExampleRow>
          <Button
            onPress={() => {
              const id = toast.loading("正在刷新索引", {
                duration: Number.POSITIVE_INFINITY,
                native: isNative,
              });
              setTimeout(() => {
                toast.close(id);
                toast.success("索引已刷新", {
                  native: isNative,
                });
              }, 900);
            }}
            variant="outlined"
          >
            加载后完成
          </Button>
          <Button onPress={() => toast.closeAll()} variant="outlined">
            关闭全部
          </Button>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
