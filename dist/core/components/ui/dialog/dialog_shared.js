import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { isValidElement } from "react";
import { Button } from "../button";
import { Text } from "../text";
import { resolveRenderProp } from "../utils/render";
import { useOverlayState } from "../utils/overlay/overlay_state";
import { cn } from "../utils/cn";
export function useDialogModel(p) {
    const state = useOverlayState(p);
    const context = { open: state.open, close: state.close };
    const trigger = resolveRenderProp(p.trigger, context);
    return { ...state, context,
        title: resolveRenderProp(p.title, context), description: resolveRenderProp(p.description, context),
        content: resolveRenderProp(p.content, context) ?? p.children,
        trigger: trigger == null ? null : isValidElement(trigger) ? trigger :
            _jsx(Button, { ...p.triggerProps, className: cn(p.triggerClassName, p.triggerProps?.className), variant: p.triggerProps?.variant ?? "secondary", children: trigger }),
    };
}
export function DialogActions({ props: p, model: m }) {
    const actions = resolveRenderProp(p.actions, m.context);
    return _jsxs(_Fragment, { children: [typeof actions === "string" || typeof actions === "number" ? _jsx(Text, { children: actions }) : actions, ["cancel", "action", "destructive"].map(kind => {
                const label = resolveRenderProp(p[`${kind}Label`], m.context);
                if (label == null)
                    return null;
                const props = p[`${kind}Props`];
                return _jsx(Button, { ...props, title: undefined, accessibilityLabel: p[`${kind}AriaLabel`] ?? props?.accessibilityLabel, variant: props?.variant ?? (kind === "cancel" ? "tertiary" : kind === "destructive" ? "danger" : "primary"), className: cn(p[`${kind}ClassName`], props?.className), onPress: event => {
                        props?.onPress?.(event);
                        if (!event.defaultPrevented && (kind === "cancel" || (p.closeOnAction ?? p.isAlert)))
                            m.close();
                    }, children: label }, kind);
            })] });
}
