import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ToggleButtonGroup } from "@heroui/react/toggle-button-group";
import { ToggleButton } from "@heroui/react/toggle-button";
import { useKeySelection } from "../utils/key_selection";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { resolveRenderProp } from "../utils/render";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { toggleWebScaleClassName } from "../toggle/toggle_feedback_web";
import { resolveToggleGroupLayout } from "./toggle_group_layout";
function Item({ item, p, selected, disabled, index }) {
    const font = textWebStyle(useDefaultTextStyle(undefined, item.labelClassName));
    const style = item.herouiWebProps?.style;
    const layout = resolveToggleGroupLayout(p);
    const vertical = p.orientation === "vertical";
    return _jsxs("div", { className: cn("relative inline-flex", !vertical && p.fullWidth && "min-w-0 flex-1", vertical && "self-stretch", selected ? "text-accent-soft-foreground" : "text-foreground"), children: [!layout.isDetached && index > 0 && _jsx(ToggleButtonGroup.Separator, {}), _jsx(ToggleButton, { ...item.herouiWebProps, id: item.id, size: p.size, variant: p.variant, isDisabled: disabled, isIconOnly: item.isIconOnly, "aria-label": item.accessibilityLabel, className: cn(toggleWebScaleClassName(item.isScaleDisabled ?? layout.isScaleDisabled, p.size), (p.fullWidth || vertical) && "w-full", !layout.isDetached && index > 0 && (vertical ? "rounded-t-none!" : "rounded-s-none!"), !layout.isDetached && index < p.items.length - 1 && (vertical ? "rounded-b-none!" : "rounded-e-none!"), item.className), style: typeof style === "function" ? s => ({ ...font, ...style(s) }) : { ...font, ...style }, children: _jsx(TextClassContext.Provider, { value: selected ? "text-accent-soft-foreground" : "text-foreground", children: _jsx("span", { className: cn("inline-flex items-center justify-center gap-2", item.labelClassName), children: resolveRenderProp(item.title, { isSelected: selected, isDisabled: disabled }) ?? item.children }) }) })] });
}
export function ToggleGroupHeroUI(p) {
    const state = useKeySelection({ ...p, selectionMode: p.selectionMode ?? "single" }, p.items);
    const layout = resolveToggleGroupLayout(p);
    const style = p.herouiWebProps?.style;
    return _jsx(ToggleButtonGroup, { ...p.herouiWebProps, className: p.className, style: s => ({ ...(typeof style === "function" ? style(s) : style), gap: layout.gap }), selectionMode: p.selectionMode ?? "single", selectedKeys: state.selected, onSelectionChange: state.change, disallowEmptySelection: p.disallowEmptySelection, isDisabled: p.isDisabled, orientation: p.orientation, size: p.size, isDetached: layout.isDetached, fullWidth: p.fullWidth, "aria-label": p.accessibilityLabel, children: p.items.map((item, index) => _jsx(Item, { item: item, p: p, index: index, selected: state.selected.has(item.id), disabled: !!p.isDisabled || state.disabled.has(item.id) }, item.id)) });
}
