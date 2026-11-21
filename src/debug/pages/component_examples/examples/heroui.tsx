import { useState } from "react";
import { Button } from "@heroui/react/button";
import { Modal } from "@heroui/react/modal";
import { NativeSheet, NativeSheetScrollContent } from "rn-ui-kit/core";

function DialogProbe({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>{label}</Button>
      <Modal isOpen={open} onOpenChange={setOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.Header><Modal.Heading>HeroUI Web 弹层验证</Modal.Heading></Modal.Header>
              <Modal.Body>
                <p className="text-muted">检查遮罩、焦点、Escape 和关闭后 Sheet 的交互。</p>
                <input aria-label="HeroUI 键盘验证" placeholder="输入后按 Escape 关闭" className="rounded-lg border border-border bg-field p-3 text-field-foreground" />
              </Modal.Body>
              <Modal.Footer><Button onPress={() => setOpen(false)}>关闭 HeroUI 弹层</Button></Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}

export function HeroUIExample() {
  const [count, setCount] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-surface p-4 text-foreground" data-testid="heroui-smoke-web">
      <p>当前底座：@heroui/react（Web）</p>
      <p>已接入统一主题：请切换明暗模式和主题色，检查按钮、说明文字、输入框与 Sheet 内弹层。</p>
      <div className="flex flex-wrap gap-3">
        <Button onPress={() => setCount(value => value + 1)}>HeroUI 计数：{count}</Button>
        <Button variant="secondary">次要按钮</Button>
        <Button isDisabled>禁用按钮</Button>
      </div>
      <DialogProbe label="打开 HeroUI 弹层" />
      <Button variant="secondary" onPress={() => setSheetOpen(true)}>打开 TrueSheet 内验证</Button>
      <NativeSheet open={sheetOpen} onOpenChange={setSheetOpen} detents={[0.6, 0.9]} handle>
        <NativeSheetScrollContent contentContainerStyle={{ padding: 20 }}>
          <div className="flex flex-col gap-4 rounded-xl bg-surface p-4 text-foreground">
            <p>保留现有 NativeSheet，实现与 HeroUI Web Modal 的组合验证。</p>
            <DialogProbe label="在 TrueSheet 内打开 HeroUI 弹层" />
            <Button variant="secondary" onPress={() => setSheetOpen(false)}>关闭验证 Sheet</Button>
          </div>
        </NativeSheetScrollContent>
      </NativeSheet>
    </div>
  );
}
