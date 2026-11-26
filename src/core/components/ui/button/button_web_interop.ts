/**
 * RN Web 0.21.2 interoperability boundary. Keep the existing Pressable callbacks,
 * press lifecycle, layout and measurement refs on HeroUI's single DOM button.
 * These are the same hooks used by RNW Pressable/View; no fabricated RN events or
 * extra pressable DOM ancestor. Recheck this boundary when upgrading RN Web.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type AriaAttributes, type ComponentRef, type CSSProperties, type Ref, type RefCallback, type RefObject } from "react";
import type { GestureResponderEvent, Pressable, PressableProps, PressableStateCallbackType, ViewProps } from "react-native";
// RNW ships Flow sources rather than TypeScript declarations for these hooks.
// @ts-expect-error Untyped RNW 0.21.2 module; its contract is narrowed below.
import pressEvents from "react-native-web/dist/modules/usePressEvents";
// @ts-expect-error Untyped RNW 0.21.2 module.
import responderEvent from "react-native-web/dist/modules/useResponderEvents/createResponderEvent";
// @ts-expect-error Untyped RNW 0.21.2 module.
import { ResponderTouchHistoryStore } from "react-native-web/dist/modules/useResponderEvents/ResponderTouchHistoryStore";
// @ts-expect-error Untyped RNW 0.21.2 module.
import hover from "react-native-web/dist/modules/useHover";
// @ts-expect-error Untyped RNW 0.21.2 module.
import elementLayout from "react-native-web/dist/modules/useElementLayout";
// @ts-expect-error Untyped RNW 0.21.2 module.
import platformMethods from "react-native-web/dist/modules/usePlatformMethods";
// @ts-expect-error Untyped RNW 0.21.2 module.
import domProps from "react-native-web/dist/modules/createDOMProps";
// @ts-expect-error Untyped RNW 0.21.2 module.
import * as forwardedProps from "react-native-web/dist/modules/forwardedProps";

import type { ButtonHeroUIWebProps } from "./types";

type HostRef = RefObject<HTMLButtonElement | null>;
type PressConfig = {
  disabled?: boolean;
  delayLongPress?: number | null;
  onLongPress?: PressableProps["onLongPress"];
  onPress?: PressableProps["onPress"];
  onPressStart?: PressableProps["onPressIn"];
  onPressEnd?: PressableProps["onPressOut"];
  onPressChange: (pressed: boolean) => void;
};
type Handlers = Pick<ButtonHeroUIWebProps, "onClick" | "onContextMenu"> & Partial<ViewProps>;
const usePressEvents: (ref: HostRef, config: PressConfig) => Handlers = pressEvents;
type HistoryStore = { touchHistory: unknown; recordTouchTrack(type: string, nativeEvent: GestureResponderEvent["nativeEvent"]): void };
const newHistoryStore: new () => HistoryStore = ResponderTouchHistoryStore;
const createResponderEvent: (event: Event, history: HistoryStore) => GestureResponderEvent = responderEvent;

/** Aria stops mousedown bubbling. Feed RNW's real event normalizer and responder
 * from host listeners before React, rather than depending on RNW's document-bubble
 * registry. Temporary document listeners end/cancel even when the pointer leaves. */
function useHostPressLifecycle(hostRef: HostRef, handlers: Handlers, disabled: boolean) {
  useEffect(() => {
    const host = hostRef.current;
    if (!host || disabled) return;
    const history = new newHistoryStore();
    let active = false, ignoreMouseUntil = 0;
    let activeKey: string | undefined;
    let lastEvent: Event | undefined;
    const doc = host.ownerDocument;
    const win = doc.defaultView;
    const normalize = (event: Event) => {
      lastEvent = event;
      const normalized = createResponderEvent(event, history);
      // RNW's responder system likewise assigns currentTarget before dispatch.
      Object.defineProperty(normalized, "currentTarget", { value: host, configurable: true });
      if (/^(mouse|touch)(down|start|move|up|end|cancel)$/.test(event.type))
        history.recordTouchTrack(event.type, normalized.nativeEvent);
      return normalized;
    };
    const move = (event: Event) => { if (active) handlers.onResponderMove?.(normalize(event)); };
    const unlisten = () => {
      for (const type of ["mousemove", "touchmove"]) doc.removeEventListener(type, move, true);
      for (const type of ["mouseup", "touchend"]) doc.removeEventListener(type, end, true);
      doc.removeEventListener("keyup", keyup, true);
      for (const type of ["touchcancel", "dragstart", "scroll", "contextmenu", "selectionchange", "blur"]) doc.removeEventListener(type, cancel, true);
      win?.removeEventListener("blur", cancel);
    };
    const end = (event: Event) => {
      if (!active) return;
      const remaining = "touches" in event ? event.touches as TouchList : undefined;
      if (remaining && Array.from(remaining).some((touch) => touch.target instanceof Node && host.contains(touch.target))) return;
      active = false; activeKey = undefined; handlers.onResponderRelease?.(normalize(event)); unlisten();
    };
    const cancel = (event: Event) => {
      if (!active) return;
      if (event.type === "scroll" && event.target instanceof Node && !event.target.contains(host)) return;
      if (event.type === "blur" && event.target !== win && event.target instanceof Node && !event.target.contains(host)) return;
      if (event.type === "selectionchange" && !doc.getSelection()?.toString()) return;
      const normalized = normalize(event);
      if (handlers.onResponderTerminationRequest?.(normalized) === false) return;
      active = false; activeKey = undefined; handlers.onResponderTerminate?.(normalized); unlisten();
    };
    const keyup = (event: KeyboardEvent) => { if (event.key === activeKey) end(event); };
    const keydown = (event: KeyboardEvent) => {
      if (active || event.repeat || event.isComposing || event.defaultPrevented || !["Enter", " ", "Spacebar"].includes(event.key)) return;
      // Aria's useKeyboard callbacks intentionally omit SyntheticEvent.persist.
      // Normalize the real DOM event through RNW, just like pointer responders;
      // Aria/browser retain keyboard activation, while RN callbacks get RN events.
      activeKey = event.key;
      start(event);
    };
    const start = (event: Event) => {
      if (active) return;
      if (event.type === "mousedown" && ((event as MouseEvent).button !== 0 || Date.now() < ignoreMouseUntil)) return;
      if (event.type === "touchstart") ignoreMouseUntil = Date.now() + 800;
      const normalized = normalize(event);
      if (!handlers.onStartShouldSetResponder?.(normalized)) return;
      active = true; handlers.onResponderGrant?.(normalized);
      if (activeKey) doc.addEventListener("keyup", keyup, true);
      else {
        for (const type of ["mousemove", "touchmove"]) doc.addEventListener(type, move, true);
        for (const type of ["mouseup", "touchend"]) doc.addEventListener(type, end, true);
      }
      for (const type of ["touchcancel", "dragstart", "scroll", "contextmenu", "selectionchange", "blur"]) doc.addEventListener(type, cancel, true);
      win?.addEventListener("blur", cancel);
    };
    host.addEventListener("mousedown", start);
    host.addEventListener("touchstart", start, { passive: true });
    host.addEventListener("keydown", keydown);
    return () => { if (active && lastEvent) handlers.onResponderTerminate?.(normalize(lastEvent)); unlisten(); host.removeEventListener("mousedown", start); host.removeEventListener("touchstart", start); host.removeEventListener("keydown", keydown); };
  }, [hostRef, handlers, disabled]);
}
const useHover: (ref: HostRef, config: {
  contain: boolean; disabled: boolean; onHoverChange: (hovered: boolean) => void;
  onHoverStart?: PressableProps["onHoverIn"]; onHoverEnd?: PressableProps["onHoverOut"];
}) => void = hover;
const useElementLayout: (ref: HostRef, onLayout: ViewProps["onLayout"]) => void = elementLayout;
const usePlatformMethods: (props: object) => RefCallback<HTMLButtonElement> = platformMethods;
type ConvertedDOMProps = Omit<ButtonHeroUIWebProps, "style"> & { className?: string; style?: CSSProperties; "aria-busy"?: AriaAttributes["aria-busy"] };
const createDOMProps: (tag: "button", props: object) => ConvertedDOMProps = domProps;
const allowed: Record<string, boolean> = Object.assign({}, forwardedProps.defaultProps,
  forwardedProps.accessibilityProps, forwardedProps.clickProps, forwardedProps.focusProps,
  forwardedProps.keyboardProps, forwardedProps.mouseProps, forwardedProps.touchProps,
  forwardedProps.styleProps, { lang: true, onScroll: true, onWheel: true });

type InteropResult = { state: PressableStateCallbackType; ref: RefCallback<HTMLButtonElement>; domProps: ConvertedDOMProps };

export function useButtonWebInterop(props: PressableProps, publicRef: Ref<ComponentRef<typeof Pressable>> | undefined, webRef: Ref<HTMLButtonElement> | undefined): InteropResult {
  const hostRef = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const disabled = !!props.disabled;
  const config = useMemo(() => ({
    disabled, delayLongPress: props.delayLongPress, onLongPress: props.onLongPress,
    onPress: props.onPress, onPressStart: props.onPressIn, onPressEnd: props.onPressOut,
    onPressChange: setPressed,
  }), [disabled, props.delayLongPress, props.onLongPress, props.onPress, props.onPressIn, props.onPressOut]);
  const handlers = usePressEvents(hostRef, config);
  useHostPressLifecycle(hostRef, handlers, disabled);
  useHover(hostRef, { contain: true, disabled, onHoverChange: setHovered, onHoverStart: props.onHoverIn, onHoverEnd: props.onHoverOut });
  useElementLayout(hostRef, props.onLayout);
  const attachPlatformMethods = usePlatformMethods(props);
  const ref = useCallback((node: HTMLButtonElement | null) => {
    hostRef.current = node;
    attachPlatformMethods(node);
    // This is the augmented DOM ref RNW Pressable exposed before migration.
    // It is not a DOM/RN event conversion. The same measurement methods are installed above.
    const rnNode = node as unknown as ComponentRef<typeof Pressable> | null;
    if (typeof publicRef === "function") publicRef(rnNode); else if (publicRef) publicRef.current = rnNode;
    if (typeof webRef === "function") webRef(node); else if (webRef) webRef.current = node;
  }, [attachPlatformMethods, publicRef, webRef]);
  const state = { hovered: !disabled && hovered, pressed: !disabled && (pressed || props.testOnly_pressed === true) };
  const supported = Object.fromEntries(Object.entries(props).filter(([key]) => allowed[key]));
  const converted = createDOMProps("button", {
    ...supported, style: [typeof props.style === "function" ? props.style(state) : props.style,
      props.pointerEvents == null ? undefined : { pointerEvents: props.pointerEvents }],
  });
  return {
    state, ref,
    domProps: { ...converted, onClick: handlers.onClick, onContextMenu: handlers.onContextMenu },
  };
}
