import { useState } from "react";
import { Button, isIos, isWeb, Switch, Text, useToast } from "rn-ui-kit/core";
import { View } from "react-native";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function ToastExample() {
  const { toast } = useToast();
  const [isNative, setIsNative] = useState(isIos());

  const showLoadingThenSuccess = () => {
    const id = toast.loading("正在刷新索引", {
      duration: 10_000,
      native: isNative,
      description: "请稍候...",
    });
    setTimeout(() => {
      toast.close(id);
      toast.success("索引已刷新", {
        native: isNative,
        description: "搜索结果已经更新。",
      });
    }, 900);
  };

  const showPromise = () => {
    const operation = new Promise<string>((resolve) => {
      setTimeout(() => resolve("工作区配置"), 1_200);
    });
    toast.promise(operation, {
      loading: "正在保存",
      success: (name) => `${name}保存成功`,
      error: "保存失败",
      description: "异步任务已完成。",
      native: isNative,
      finally: () => undefined,
    });
  };

  const showCustom = () => {
    toast.custom(
      (id) => (
        <View className="min-w-64 gap-2 rounded-lg border border-border bg-background p-3 shadow-lg">
          <Text className="font-semibold">自定义 Toast</Text>
          <Text variant="muted">任意 JSX 内容，支持自己的布局和操作。</Text>
          <Button size="sm" onPress={() => toast.close(id)}>
            关闭
          </Button>
        </View>
      ),
      { native: isNative, duration: 8_000 },
    );
  };

  return (
    <ExampleStack>
      <ExampleBlock
        description="native=true 在 Android/iOS 使用 Burnt；native=false 使用 Sonner 基础 Toast。Web 始终使用基础 Toast。"
        title="基础 Toast"
      >
        {!isWeb() && (
          <ExampleRow>
            <Switch checked={isNative} onCheckedChange={setIsNative} label="使用 Native Toast" />
          </ExampleRow>
        )}
        <ExampleRow>
          <Button
            onPress={() =>
              toast("普通消息", { native: isNative, description: "这是一条基础提示。" })
            }
          >
            普通
          </Button>
          <Button
            onPress={() =>
              toast.info("同步中", { native: isNative, description: "正在连接服务器。" })
            }
            variant="outline"
          >
            信息
          </Button>
          <Button
            onPress={() =>
              toast.success("保存成功", { native: isNative, description: "工作区配置已写入本地。" })
            }
          >
            成功
          </Button>
          <Button
            onPress={() =>
              toast.warning("空间不足", { native: isNative, description: "建议先清理附件缓存。" })
            }
            variant="outline"
          >
            警告
          </Button>
          <Button
            onPress={() =>
              toast.error("同步失败", { native: isNative, description: "请检查网络连接。" })
            }
            variant="destructive"
          >
            失败
          </Button>
          <Button onPress={() => toast.success("仅 Title", { native: isNative })}>仅 Title</Button>
        </ExampleRow>
      </ExampleBlock>

      <ExampleBlock
        description="持续 Toast 可以手动关闭，也可以在异步任务结束后替换为成功状态。"
        title="加载与异步状态"
      >
        <ExampleRow>
          <Button onPress={showLoadingThenSuccess}>加载后完成</Button>
          <Button onPress={showPromise} variant="outline">
            Promise
          </Button>
          <Button
            onPress={() => toast.loading("持续加载", { native: isNative, duration: 30_000 })}
            variant="outline"
          >
            持续加载
          </Button>
        </ExampleRow>
      </ExampleBlock>

      <ExampleBlock
        description="custom 不走 Burnt，Web 和原生基础 Toast 都支持任意 JSX。"
        title="自定义内容"
      >
        <ExampleRow>
          <Button onPress={showCustom}>显示 Custom JSX</Button>
          <Button onPress={() => toast.closeAll()} variant="outline">
            关闭全部
          </Button>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
