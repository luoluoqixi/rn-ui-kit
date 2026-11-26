import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useEffect, useId, useLayoutEffect, useRef } from "react";
import { Dropdown as Menu } from "@heroui/react/dropdown";
import { Pressable } from "react-aria-components/Pressable";
import { RootMenuTriggerStateContext } from "react-aria-components/Menu";
import { useLocale } from "react-aria-components/I18nProvider";
import { Button } from "../button";
import { MenuSurface } from "../menu/menu_heroui";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import { textWebStyle } from "../text/text_style_web";
import { useMenubarModel } from "./menubar_heroui_shared";
function TopMenu({ item, p, m, navigation: nav }) {
    const state = useContext(RootMenuTriggerStateContext);
    const open = m.value === item.value;
    const disabled = !m.enabled.includes(item);
    const platform = item.triggerProps?.herouiWebProps;
    const closeOnPress = useRef(false);
    useLayoutEffect(() => {
        nav.openers.set(item.value, () => state?.open("first"));
        return () => { nav.openers.delete(item.value); };
    }, [item.value, state, nav.openers]);
    function key(event) {
        closeOnPress.current = false;
        if (event.defaultPrevented || disabled)
            return;
        const forward = nav.direction() === "rtl" ? "ArrowLeft" : "ArrowRight";
        if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Home" || event.key === "End") {
            event.preventDefault();
            event.stopPropagation();
            nav.move(item.value, event.key === "Home" ? "first" : event.key === "End" ? "last" : event.key === forward ? 1 : -1, open);
        }
        else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();
            state?.open(event.key === "ArrowUp" ? "last" : "first");
        }
        else if (event.key === "Escape" && open) {
            event.preventDefault();
            event.stopPropagation();
            m.select(undefined);
        }
        else if (event.key === "Tab" && open)
            nav.tab(event, item.value);
    }
    function menuKey(event) {
        const target = event.target;
        if (event.key === "Tab") {
            nav.tab(event, item.value);
            return;
        }
        // Submenus keep React Aria's own directional navigation and focus return.
        if (target.closest("[data-ui-submenu]"))
            return;
        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            m.select(undefined);
            return;
        }
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
            return;
        const forward = nav.direction() === "rtl" ? "ArrowLeft" : "ArrowRight";
        if (event.key === forward && target.closest('[role="menuitem"][aria-haspopup="menu"]'))
            return;
        event.preventDefault();
        event.stopPropagation();
        nav.move(item.value, event.key === forward ? 1 : -1, true);
    }
    return _jsxs(_Fragment, { children: [_jsx("div", { role: "presentation", className: "contents", onKeyDownCapture: key, onPointerDownCapture: () => { closeOnPress.current = open; }, onPointerEnter: event => {
                    if (event.pointerType !== "mouse" || disabled || m.value === undefined || open)
                        return;
                    nav.refs.get(item.value)?.focus({ preventScroll: true });
                    nav.openers.get(item.value)?.();
                }, children: _jsx(Pressable, { isDisabled: disabled, children: _jsx(Button, { ...item.triggerProps, native: false, nativeHaptics: false, size: item.triggerProps?.size ?? p.size ?? "sm", variant: item.triggerProps?.variant ?? "ghost", className: cn(item.triggerProps?.variant == null && open && "bg-segment", item.triggerProps?.className), textClassName: cn(item.triggerProps?.variant == null && open && "text-segment-foreground", item.triggerProps?.textClassName), isDisabled: disabled, role: "menuitem", tabIndex: disabled || m.tabStop !== item.value ? -1 : 0, herouiWebProps: { ...platform,
                            render: (dom, state) => {
                                const props = { ...dom, role: "menuitem", tabIndex: disabled || m.tabStop !== item.value ? -1 : 0 };
                                return platform?.render ? platform.render(props, state) : _jsx("button", { ...props });
                            },
                            ref: node => {
                                if (node)
                                    nav.refs.set(item.value, node);
                                else
                                    nav.refs.delete(item.value);
                                if (typeof platform?.ref === "function")
                                    platform.ref(node);
                                else if (platform?.ref)
                                    platform.ref.current = node;
                            },
                            onFocus: event => { m.setActive(item.value); platform?.onFocus?.(event); },
                            onPress: event => {
                                // RAC's mouse trigger opens on down; unlike touch/keyboard, it
                                // doesn't toggle an already open non-modal menu. Close on release.
                                if (closeOnPress.current) {
                                    closeOnPress.current = false;
                                    m.select(undefined);
                                }
                                platform?.onPress?.(event);
                            }, }, children: resolveRenderProp(item.title, { value: item.value, open, disabled }) }) }) }), _jsx(MenuSurface, { items: m.entries(item), contentProps: { align: "start", ...p.contentProps, ...item.contentProps }, accessibilityLabel: typeof item.title === "string" ? item.title : item.value, isNonModal: true, menubarOwner: nav.owner, onKeyDownCapture: menuKey })] });
}
export function MenubarHeroUI(p) {
    const m = useMenubarModel(p);
    const { direction } = useLocale();
    const bar = useRef(null);
    const owner = useId();
    useEffect(() => {
        if (m.value === undefined)
            return;
        const dismissOutside = (event) => {
            const target = event.target;
            if (!(target instanceof Element) || bar.current?.contains(target)
                || target.closest("[data-ui-menubar-owner]")?.getAttribute("data-ui-menubar-owner") === owner)
                return;
            m.select(undefined);
        };
        document.addEventListener("pointerdown", dismissOutside, true);
        return () => document.removeEventListener("pointerdown", dismissOutside, true);
    }, [m.value, m.select, owner]);
    const refs = useRef(new Map()).current;
    const openers = useRef(new Map()).current;
    const nav = {
        refs, openers, owner,
        direction: () => direction,
        move(value, delta, open) {
            const length = m.enabled.length;
            if (!length)
                return;
            const index = m.enabled.findIndex(item => item.value === value);
            const next = m.enabled[delta === "first" ? 0 : delta === "last" ? length - 1 : (index + delta + length) % length];
            m.setActive(next.value);
            refs.get(next.value)?.focus({ preventScroll: true });
            if (open)
                openers.get(next.value)?.();
        },
        tab(event, value) {
            event.preventDefault();
            event.stopPropagation();
            const stops = Array.from(document.querySelectorAll('button,a[href],input,select,textarea,[tabindex]'))
                .filter(node => node.tabIndex >= 0 && !node.matches(':disabled,[aria-disabled="true"]')
                && !node.closest('[role="menu"],[hidden],[inert],[aria-hidden="true"]'));
            const trigger = refs.get(value);
            const index = trigger ? stops.indexOf(trigger) : -1;
            const step = event.shiftKey ? -1 : 1;
            let next = index + step;
            while (next >= 0 && next < stops.length && bar.current?.contains(stops[next]))
                next += step;
            const destination = stops[next];
            m.select(undefined);
            // Run after the outgoing FocusScope has restored its trigger.
            requestAnimationFrame(() => destination?.isConnected && destination.focus({ preventScroll: true }));
        },
    };
    return _jsx("div", { ref: bar, role: "menubar", "aria-label": p.accessibilityLabel ?? "菜单栏", "aria-orientation": "horizontal", dir: direction, className: cn("flex w-fit items-center gap-1 rounded-4xl bg-default p-1", p.className), style: textWebStyle(p.style), "data-testid": p.testID, children: p.items.map(item => _jsx(Menu, { isOpen: m.value === item.value, onOpenChange: next => m.change(item, next), children: _jsx(TopMenu, { item: item, p: p, m: m, navigation: nav }) }, item.value)) });
}
