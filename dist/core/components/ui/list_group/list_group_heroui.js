import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export function ListGroupHeroUI(p) {
    const font = textWebStyle(useDefaultTextStyle());
    const style = p.herouiWebProps?.style;
    const sections = p.sections ?? [{ id: "default", items: p.items ?? [] }];
    const all = sections.flatMap(s => [...s.items]);
    const state = useKeySelection({ ...p, selectionMode: p.selectionMode ?? "none" }, all);
    return _jsx(ListBox, { ...p.herouiWebProps, "aria-label": p.accessibilityLabel ?? "列表", style: typeof style === "function" ? state => ({ ...font, ...style(state) }) : { ...font, ...style }, className: cn("rounded-3xl bg-surface p-1", p.className), selectionMode: p.selectionMode ?? "none", selectionBehavior: "replace", selectedKeys: state.selected, onSelectionChange: state.change, disallowEmptySelection: p.disallowEmptySelection, disabledKeys: p.isDisabled ? all.map(i => i.id) : state.disabled, renderEmptyState: () => p.emptyContent ?? "暂无内容", children: sections.map(section => _jsxs(ListBox.Section, { "aria-label": typeof section.title === "string" ? section.title : "列表分组", children: [section.title != null && _jsx(Header, { children: section.title }), section.items.map((item, index) => {
                    const ctx = { id: item.id, isSelected: state.selected.has(item.id), isDisabled: !!p.isDisabled || state.disabled.has(item.id) };
                    return _createElement(ListBox.Item, { ...item.herouiWebProps, id: item.id, key: item.id, textValue: item.textValue ?? (typeof item.title === "string" ? item.title : item.id), isDisabled: ctx.isDisabled, onAction: () => { if (!ctx.isDisabled)
                            item.onPress?.(); }, className: cn("px-4 py-3", p.showSeparators && index < section.items.length - 1 && "border-b border-separator", item.className) },
                        resolveRenderProp(item.startContent, ctx),
                        _jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [_jsx(Label, { children: resolveRenderProp(item.title, ctx) }), item.description != null && _jsx(Description, { children: resolveRenderProp(item.description, ctx) })] }),
                        resolveRenderProp(item.endContent, ctx),
                        p.selectionMode && p.selectionMode !== "none" ? _jsx(ListBox.ItemIndicator, {}) : p.showChevron && _jsx(Icon, { as: ChevronRight, size: "sm", color: "muted" }));
                })] }, section.id)) });
}
