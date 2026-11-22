import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { ListBox } from "@heroui/react/list-box";
import { Label } from "@heroui/react/label";
import { Description } from "@heroui/react/description";
import { Header } from "react-aria-components/Header";
import { ChevronRight } from "lucide-react-native";
import { Icon } from "../icon";
import { useKeySelection } from "../utils/key_selection";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import type { ListGroupProps } from "./types";
export function ListGroupHeroUI(p: ListGroupProps) {
  const font = textWebStyle(useDefaultTextStyle());
  const sections = p.sections ?? [{ id: "default", items: p.items ?? [] }];
  const all = sections.flatMap(s => [...s.items]);
  const state = useKeySelection({ ...p, selectionMode: p.selectionMode ?? "none" }, all);
  return <ListBox {...p.herouiWebProps} aria-label={p.accessibilityLabel ?? "列表"}
    style={font} className={cn("rounded-3xl bg-surface p-1", p.className)} selectionMode={p.selectionMode ?? "none"}
    selectionBehavior="replace" selectedKeys={state.selected} onSelectionChange={state.change} disallowEmptySelection={p.disallowEmptySelection}
    disabledKeys={p.isDisabled ? all.map(i => i.id) : state.disabled} renderEmptyState={() => p.emptyContent ?? "暂无内容"}>
    {sections.map(section => <ListBox.Section key={section.id} aria-label={typeof section.title === "string" ? section.title : "列表分组"}>
      {section.title != null && <Header>{section.title}</Header>}
      {section.items.map((item, index) => {
        const ctx = { id: item.id, isSelected: state.selected.has(item.id), isDisabled: !!p.isDisabled || state.disabled.has(item.id) };
        return <ListBox.Item {...item.herouiWebProps} id={item.id} key={item.id}
          textValue={item.textValue ?? (typeof item.title === "string" ? item.title : item.id)} isDisabled={ctx.isDisabled}
          onAction={() => { if (!ctx.isDisabled) item.onPress?.(); }}
          className={cn("px-4 py-3", p.showSeparators && index < section.items.length - 1 && "border-b border-separator", item.className)}>
          {resolveRenderProp(item.startContent, ctx)}
          <span className="flex min-w-0 flex-1 flex-col"><Label>{resolveRenderProp(item.title, ctx)}</Label>
            {item.description != null && <Description>{resolveRenderProp(item.description, ctx)}</Description>}
          </span>
          {resolveRenderProp(item.endContent, ctx)}
          {p.selectionMode && p.selectionMode !== "none" ? <ListBox.ItemIndicator /> : p.showChevron && <Icon as={ChevronRight} size="sm" color="muted" />}
        </ListBox.Item>;
      })}
    </ListBox.Section>)}
  </ListBox>;
}
