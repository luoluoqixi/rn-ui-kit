import { useEffect, useRef, useState, useSyncExternalStore, type ReactElement, type ReactNode, isValidElement } from "react";
import { AppState, Pressable, View } from "react-native";
import { Toast, ToastProvider, useToast as useHeroToast, type ToastComponentProps } from "heroui-native/toast";
import { CheckCircle2, CircleX, Info, TriangleAlert } from "lucide-react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { Icon } from "../icon";
import { Spinner } from "../spinner";
import { triggerNativeHaptics } from "../utils/haptics";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import { configureBasicToastRuntime, getBasicToastRuntimeConfig, getToastMessage, resolveToastContent, type BasicToastKind } from "./toast_basic_shared";
import { toastBridge, toastDuration, toastVariant, type ToastRecord } from "./toast_bridge";
import type { TitleToast, ToastShowOptions, ToastNativeToasterProps } from "./types";

export function showBasicToast(title: TitleToast, kind: BasicToastKind, options: ToastShowOptions = {}) {
  const id = toastBridge.show({ title: resolveToastContent(title), description: getToastMessage(options), kind, options });
  if (["success", "warning", "error"].includes(kind)) triggerNativeHaptics(options.haptics ?? options.basicHaptics ?? getBasicToastRuntimeConfig().haptics);
  return id;
}
export function showBasicCustom(custom: (id: string | number) => ReactElement, options: ToastShowOptions = {}) {
  return toastBridge.show({ custom, kind: "default", options });
}
export const dismissBasicToast = (id?: string | number) => toastBridge.close(id);
export const dismissAllBasicToasts = () => toastBridge.closeAll();
type LegacyAction = { label: string; onClick: () => void };
function isAction(value: ReactNode | LegacyAction): value is LegacyAction {
  return value != null && typeof value === "object" && "label" in value && "onClick" in value;
}
function NativeToast({ initial, config: p, componentProps }: { initial: ToastRecord; config: ToastNativeToasterProps; componentProps: ToastComponentProps }) {
  const font = useDefaultTextStyle();
  const current = useSyncExternalStore(toastBridge.subscribe, () => toastBridge.get(initial.id), () => initial);
  const last = useRef(initial);
  if (current?.token === initial.token) last.current = current;
  const r = last.current;
  const { title, description, kind, options: o } = r.payload;
  const legacy = o.sonnerNativeOptions;
  const defaults = p.sonnerNativeProps?.toastOptions;
  const [touching, setTouching] = useState(false);
  const [backgrounded, setBackgrounded] = useState(AppState.currentState !== "active");
  useEffect(() => {
    const listener = AppState.addEventListener("change", state => setBackgrounded(state !== "active"));
    return () => listener.remove();
  }, []);
  const remaining = useRef(0);
  useEffect(() => { remaining.current = toastDuration(r, p.sonnerNativeProps?.duration, "native"); }, [r, p.sonnerNativeProps?.duration]);
  const paused = touching || (backgrounded && !!p.sonnerNativeProps?.pauseWhenPageIsHidden);
  useEffect(() => {
    if (paused || !Number.isFinite(remaining.current)) return;
    const start = Date.now();
    const timer = setTimeout(() => toastBridge.close(r.id, "auto"), Math.max(0, remaining.current));
    return () => { clearTimeout(timer); remaining.current = Math.max(0, remaining.current - (Date.now() - start)); };
  }, [r, paused, p.sonnerNativeProps?.duration]);
  const custom = r.payload.custom?.(r.id) ?? resolveRenderProp(o.jsx, undefined) ?? legacy?.jsx;
  const icon = typeof o.icon === "function" ? o.icon(undefined) : isValidElement(o.icon) ? o.icon : legacy?.icon ?? p.sonnerNativeProps?.icons?.[kind === "default" ? "info" : kind];
  const StatusIcon = kind === "success" ? CheckCircle2 : kind === "error" ? CircleX : kind === "warning" ? TriangleAlert : Info;
  const dismissible = o.dismissible ?? legacy?.dismissible ?? kind !== "loading";
  const viewProps = o.customToastViewProps ?? p.customToastViewProps ?? getBasicToastRuntimeConfig().customToastViewProps;
  const action = resolveRenderProp(o.action, undefined) ?? legacy?.action;
  const cancel = resolveRenderProp(o.cancel, undefined) ?? legacy?.cancel;
  const renderAction = (value: typeof action, cancel: boolean) => isAction(value) ? <Toast.Action variant={cancel ? "tertiary" : "primary"} size="sm"
    style={cancel ? legacy?.cancelButtonStyle ?? defaults?.cancelButtonStyle : legacy?.actionButtonStyle ?? defaults?.actionButtonStyle}
    onPress={() => { value.onClick(); toastBridge.close(r.id); }}>{value.label}</Toast.Action> : value;
  const contents = custom != null ? <View {...viewProps} style={[{ flex: 1 }, viewProps?.style]}>{custom}</View> : <>
    {(kind !== "default" || icon != null) && (icon ?? (kind === "loading" ? p.sonnerNativeProps?.loadingIcon ?? <Spinner size="sm" /> : <Icon as={StatusIcon} size={p.iconSize ?? "lg"} color={kind === "error" ? "danger" : kind === "success" || kind === "warning" ? kind : "accent"} />))}
    <View className="flex-1 gap-1" style={[defaults?.textContainerStyle, legacy?.styles?.textContainer]}>
      <Toast.Title allowFontScaling={legacy?.allowFontScaling ?? p.sonnerNativeProps?.allowFontScaling} maxFontSizeMultiplier={legacy?.maxFontSizeMultiplier ?? p.sonnerNativeProps?.maxFontSizeMultiplier}
        style={[font, defaults?.titleStyle, legacy?.styles?.title]}>{title}</Toast.Title>
      {description != null && <Toast.Description style={[font, defaults?.descriptionStyle, legacy?.styles?.description]}>{description}</Toast.Description>}
      {(action != null || cancel != null) && <View className="flex-row gap-2" style={[defaults?.buttonsStyle, legacy?.styles?.buttons]}>{renderAction(action, false)}{renderAction(cancel, true)}</View>}
    </View>
  </>;
  return <Toast {...componentProps} {...o.herouiNativeProps} variant={o.herouiNativeProps?.variant ?? toastVariant(kind)}
    className={cn("flex-row items-center gap-3", o.herouiNativeProps?.className)}
    placement={o.herouiNativeProps?.placement ?? o.from ?? (legacy?.position?.startsWith("top") || p.sonnerNativeProps?.position?.startsWith("top") ? "top" : p.herouiNativeProps?.defaultProps?.placement ?? "bottom")}
    background={o.herouiNativeProps?.background ?? legacy?.backgroundComponent ?? defaults?.backgroundComponent}
    style={[defaults?.style, legacy?.style, legacy?.styles?.toast, o.herouiNativeProps?.style]}
    isSwipeable={dismissible && (o.herouiNativeProps?.isSwipeable ?? o.shouldDismissByDrag ?? true)}
    onTouchStart={event => { setTouching(true); o.herouiNativeProps?.onTouchStart?.(event); }}
    onTouchEnd={event => { setTouching(false); o.herouiNativeProps?.onTouchEnd?.(event); }}
    onTouchCancel={event => { setTouching(false); o.herouiNativeProps?.onTouchCancel?.(event); }}>
    {legacy?.onPress || o.shouldDismissByTap ? <Pressable accessibilityRole="button" style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}
      onPress={() => { legacy?.onPress?.(); if (dismissible && o.shouldDismissByTap) toastBridge.close(r.id); }}>{contents}</Pressable> : contents}
    {(o.closeButton ?? legacy?.closeButton ?? p.closeButton ?? p.sonnerNativeProps?.closeButton ?? false) && dismissible &&
      <Toast.Close className={p.closeButtonClassName} style={[defaults?.closeButtonStyle, legacy?.styles?.closeButton]} onPress={() => toastBridge.close(r.id)}>{p.closeButtonIcon ?? legacy?.close}</Toast.Close>}
  </Toast>;
}
function Bridge({ config: p }: { config: ToastNativeToasterProps }) {
  const { toast } = useHeroToast();
  const config = useRef(p); config.current = p;
  useEffect(() => toastBridge.register(p.viewportName, {
    platform: "native",
    show: (r, onHide) => toast.show({ id: r.token, duration: "persistent", onHide: () => onHide("dismiss"),
      component: props => <NativeToast initial={r} config={config.current} componentProps={props} /> }),
    update: () => {}, // Subscribe to updates without replaying HeroUI's entry animation.
    close: id => toast.hide(id),
  }), [toast, p.viewportName]);
  return null;
}
export function BasicToaster(p: ToastNativeToasterProps) {
  useEffect(() => configureBasicToastRuntime({
    haptics: p.haptics ?? p.basicHaptics ?? true, basicHaptics: p.haptics ?? p.basicHaptics ?? true,
    ...(p.customToastViewProps ? { customToastViewProps: p.customToastViewProps } : {}),
  }), [p.haptics, p.basicHaptics, p.customToastViewProps]);
  return <ToastProvider {...p.herouiNativeProps} maxVisibleToasts={p.herouiNativeProps?.maxVisibleToasts ?? p.sonnerNativeProps?.visibleToasts ?? 4}
    insets={{ top: p.offset ?? p.sonnerNativeProps?.offset ?? 40, bottom: p.offset ?? p.sonnerNativeProps?.offset ?? 40, ...p.herouiNativeProps?.insets }}>
    <Bridge config={p} />
  </ToastProvider>;
}
