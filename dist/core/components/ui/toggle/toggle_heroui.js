import { jsx as _jsx } from "react/jsx-runtime";
import { ToggleButton } from "@heroui/react/toggle-button";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { TextClassContext } from "../text";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import { toggleWebScaleClassName } from "./toggle_feedback_web";
export function ToggleHeroUI(p) {
    const font = textWebStyle(useDefaultTextStyle(undefined, p.labelClassName));
    const style = p.herouiWebProps?.style;
    const content = resolveRenderProp(p.title, { isSelected: !!p.isSelected, isDisabled: !!p.isDisabled }) ?? p.children;
    return _jsx(TextClassContext.Provider, { value: p.isSelected ? "text-accent-soft-foreground" : "text-foreground", children: _jsx(ToggleButton, { ...p.herouiWebProps, size: p.size, variant: p.variant, isIconOnly: p.isIconOnly, isDisabled: p.isDisabled, isSelected: p.isSelected, "aria-label": p.accessibilityLabel, className: cn(toggleWebScaleClassName(p.isScaleDisabled, p.size), p.className), onChange: p.onSelectedChange, style: typeof style === "function" ? s => ({ ...font, ...style(s) }) : { ...font, ...style }, children: _jsx("span", { className: cn("inline-flex items-center justify-center gap-2", p.labelClassName), children: content }) }) });
}
