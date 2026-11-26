import { cloneElement, useEffect, useRef } from "react";
import { dropdownTrigger } from "./dropdown_heroui_shared";
import { elementMenuRect, useHostMenu } from "../menu/use_host_menu.web";
import type { DropdownProps } from "./types";

export function DropdownHost(p: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const disabled = !!(p.disabled || p.triggerProps?.disabled || p.triggerProps?.isDisabled);
  const measure = () => elementMenuRect(ref.current?.firstElementChild);
  const model = useHostMenu(p, "dropdown", disabled, measure, () => ref.current?.ownerDocument ?? document);
  const latest = useRef({ model, disabled });
  latest.current = { model, disabled };
  useEffect(() => {
    if (!p.__menuRef) return;
    p.__menuRef.current = { presentMenu: () => model.present() };
    return () => { if (p.__menuRef) p.__menuRef.current = null; };
  }, [p.__menuRef, model.present]);
  return <div ref={ref} style={{ display: "contents" }}
    onClickCapture={event => {
      if (disabled || event.defaultPrevented) return;
      const nativeEvent = event.nativeEvent;
      const source = event.detail === 0 ? "keyboard" : "pointer";
      // RNW 的 Button/Pressable 会停止 click 冒泡。捕获后在同一轮事件末尾读取
      // 原生 defaultPrevented，既接住这些入口，也让调用方的 onPress 优先取消。
      queueMicrotask(() => {
        if (!nativeEvent.defaultPrevented && !latest.current.disabled && ref.current?.isConnected)
          latest.current.model.present({ rect: measure() }, source);
      });
    }}
    onClick={event => event.stopPropagation()}
    onKeyDown={event => {
      if (disabled || event.defaultPrevented || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
      event.preventDefault();
      event.stopPropagation();
      model.present({ rect: measure() }, "keyboard");
    }}>
    {cloneElement(dropdownTrigger({ ...p, triggerProps: { accessibilityRole: "button", tabIndex: 0, ...p.triggerProps } },
      { native: true, open: model.open }, disabled), { "aria-haspopup": "menu", "aria-expanded": model.open })}
  </div>;
}
