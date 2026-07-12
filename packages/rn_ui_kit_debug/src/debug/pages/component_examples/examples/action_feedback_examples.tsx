import { useState } from "react";
import {
  Button,
  Checkbox,
  Progress,
  Slider,
  Spinner,
  Switch,
  Text,
  ToggleGroup,
  confirmNative,
  useToast,
} from "rn_ui_kit";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
import type { ComponentExampleDefinition } from "../types";

function ButtonExample() {
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
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}

function CheckboxExample() {
  const [permissions, setPermissions] = useState({ analytics: true, updates: false, weekly: true });
  const selectedCount = Object.values(permissions).filter(Boolean).length;

  return (
    <ExampleStack>
      <ExampleBlock description={`已启用 ${selectedCount}/3 项通知`} title="通知偏好">
        <Checkbox
          checked={permissions.updates}
          label="产品更新"
          onCheckedChange={(updates) => setPermissions((current) => ({ ...current, updates: updates === true }))}
        />
        <Checkbox
          checked={permissions.weekly}
          label="每周摘要"
          onCheckedChange={(weekly) => setPermissions((current) => ({ ...current, weekly: weekly === true }))}
        />
        <Checkbox
          checked={permissions.analytics}
          label="匿名使用分析"
          onCheckedChange={(analytics) => setPermissions((current) => ({ ...current, analytics: analytics === true }))}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}

function SwitchExample() {
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(false);

  return (
    <ExampleStack>
      <ExampleBlock description="开关适合即时生效的独立偏好。" title="同步设置">
        <Switch
          checked={syncEnabled}
          label="自动同步"
          labelPosition="end"
          native={false}
          onCheckedChange={setSyncEnabled}
        />
        <Switch
          checked={wifiOnly}
          disabled={!syncEnabled}
          label="仅 Wi-Fi 同步"
          labelPosition="end"
          native={false}
          onCheckedChange={setWifiOnly}
        />
        <Text opacity={0.6}>{syncEnabled ? (wifiOnly ? "将在 Wi-Fi 下自动同步" : "允许所有网络同步") : "同步已暂停"}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function ToggleGroupExample() {
  const [mode, setMode] = useState("preview");
  const [format, setFormat] = useState<string[]>(["bold"]);

  return (
    <ExampleStack>
      <ExampleBlock description={`当前视图：${mode}`} title="单选模式">
        <ToggleGroup
          items={[
            { label: "编辑", value: "edit" },
            { label: "预览", value: "preview" },
            { label: "源码", value: "source" },
          ]}
          onValueChange={setMode}
          type="single"
          value={mode}
        />
      </ExampleBlock>
      <ExampleBlock description={`已启用：${format.join("、") || "无"}`} title="多选格式">
        <ToggleGroup
          items={[
            { label: "粗体", value: "bold" },
            { label: "斜体", value: "italic" },
            { label: "删除线", value: "strike" },
          ]}
          onValueChange={setFormat}
          type="multiple"
          value={format}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}

function SliderExample() {
  const [value, setValue] = useState(42);

  return (
    <ExampleStack>
      <ExampleBlock description={`字号：${value}px`} title="可拖拽数值">
        <Slider max={72} min={12} onValueChange={(next) => setValue(next[0] ?? 12)} step={1} value={[value]} />
        <ExampleRow>
          <Button onPress={() => setValue(12)} size="$3" variant="outlined">最小</Button>
          <Button onPress={() => setValue(42)} size="$3" variant="outlined">默认</Button>
          <Button onPress={() => setValue(72)} size="$3" variant="outlined">最大</Button>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}

function SpinnerExample() {
  const [visible, setVisible] = useState(true);

  return (
    <ExampleStack>
      <ExampleBlock description="可在加载占位和操作按钮之间切换。" title="加载中状态">
        <ExampleRow>
          {visible ? <Spinner size="large" /> : <Text>加载已暂停</Text>}
          <Button onPress={() => setVisible((current) => !current)} variant="outlined">
            {visible ? "停止加载" : "开始加载"}
          </Button>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}

function ProgressExample() {
  const [value, setValue] = useState(35);

  return (
    <ExampleStack>
      <ExampleBlock description={`文件上传：${value}%`} title="受控进度">
        <Progress max={100} value={value} width="100%" />
        <ExampleRow>
          <Button onPress={() => setValue((current) => Math.max(0, current - 10))} size="$3" variant="outlined">-10</Button>
          <Button onPress={() => setValue((current) => Math.min(100, current + 10))} size="$3" variant="outlined">+10</Button>
          <Button onPress={() => setValue(100)} size="$3" theme="green">完成</Button>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}

function ToastExample() {
  const { toast } = useToast();

  return (
    <ExampleStack>
      <ExampleBlock description="涵盖普通结果、持续加载与异步任务状态。" title="全局反馈">
        <ExampleRow>
          <Button onPress={() => toast.success("保存成功", { description: "工作区配置已写入本地。" })} theme="green">成功</Button>
          <Button onPress={() => toast.warning("空间不足", { description: "建议先清理附件缓存。" })} variant="outlined">警告</Button>
          <Button onPress={() => toast.error("同步失败", { description: "请检查网络连接。" })} theme="red">失败</Button>
        </ExampleRow>
        <ExampleRow>
          <Button
            onPress={() => {
              const id = toast.loading("正在刷新索引", { duration: Number.POSITIVE_INFINITY });
              setTimeout(() => {
                toast.close(id);
                toast.success("索引已刷新");
              }, 900);
            }}
            variant="outlined"
          >
            加载后完成
          </Button>
          <Button onPress={() => toast.closeAll()} variant="outlined">关闭全部</Button>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}

function NativeDialogExample() {
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

export const actionFeedbackExamples = [
  { Component: ButtonExample, description: "保存流程、操作层级与禁用联动。", group: "动作与反馈", key: "button", label: "Button" },
  { Component: CheckboxExample, description: "多项偏好设置与汇总状态。", group: "动作与反馈", key: "checkbox", label: "Checkbox" },
  { Component: SwitchExample, description: "带依赖条件的即时设置。", group: "动作与反馈", key: "switch", label: "Switch" },
  { Component: ToggleGroupExample, description: "单选视图与多选格式工具栏。", group: "动作与反馈", key: "toggle-group", label: "ToggleGroup" },
  { Component: SliderExample, description: "范围、步长、快捷值与受控状态。", group: "动作与反馈", key: "slider", label: "Slider" },
  { Component: SpinnerExample, description: "加载占位与运行状态切换。", group: "动作与反馈", key: "spinner", label: "Spinner" },
  { Component: ProgressExample, description: "上传进度的受控更新。", group: "动作与反馈", key: "progress", label: "Progress" },
  { Component: ToastExample, description: "结果、加载和全局关闭操作。", group: "动作与反馈", key: "toast", label: "Toast" },
  { Component: NativeDialogExample, description: "多按钮的原生确认操作。", group: "动作与反馈", key: "native-dialog", label: "Native Dialog" },
] satisfies ComponentExampleDefinition[];
