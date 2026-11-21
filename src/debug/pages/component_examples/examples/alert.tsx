import { useState } from "react";
import { Alert, Button, Spinner } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";

export function AlertExample() {
  const [refreshed, setRefreshed] = useState(false);
  const [retried, setRetried] = useState(false);
  const [visible, setVisible] = useState(true);
  return (
    <ExampleStack>
      <ExampleSection title="默认与强调状态">
        <Alert title="普通信息" description="默认状态适合补充说明，不会打开系统弹窗。" />
        <Alert status="accent" title="突出重要信息" description="强调状态使用主题色，让用户更容易注意到这条提示。" />
      </ExampleSection>
      <ExampleSection title="成功、警告与错误">
        <Alert status="success" title="已保存更改" description="成功状态用于确认操作已完成。" />
        <Alert status="warning" title="请检查当前设置" description="警告状态提醒用户注意，但不阻止继续操作。" />
        <Alert status="danger" title="暂时无法连接" description="错误状态说明失败原因，并可配合重试操作。" />
      </ExampleSection>
      <ExampleSection title="附带操作">
        <Alert status="accent" title={refreshed ? "内容已刷新" : "有新内容"}
          description="操作按钮直接通过 action 传入。"
          action={<Button native={false} size="sm" title={refreshed ? "已刷新" : "刷新"} onPress={() => setRefreshed(true)} />} />
        <Alert status={retried ? "success" : "danger"} title={retried ? "重试成功" : "加载失败"}
          description="点按右侧按钮，观察状态和文案一起更新。"
          action={<Button native={false} size="sm" title="重试" onPress={() => setRetried(!retried)} />} />
        {visible ? (
          <Alert status="success" title="这条提示可以关闭" iconAlign="center"
            action={<Button native={false} size="sm" variant="ghost" title="关闭" onPress={() => setVisible(false)} />} />
        ) : <Button native={false} size="sm" variant="outline" title="重新显示提示" onPress={() => setVisible(true)} />}
      </ExampleSection>
      <ExampleSection title="自定义指示器">
        <Alert status="accent" title="正在处理" description="使用 indicator 传入加载指示器，保留标题与正文布局。"
          indicator={<Spinner size={18} />} />
      </ExampleSection>
    </ExampleStack>
  );
}
