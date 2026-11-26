import { Button } from "react-aria-components/Button";
import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import type { PressableFeedbackProps } from "./types";
export function PressableFeedbackHeroUI(p: PressableFeedbackProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const sequence = useRef(0);
  useEffect(() => {
    if (!ripples.length) return;
    // Also clean up if the browser suppresses animationend (hidden tab, CSS
    // override, or a reduced-motion setting changed during the animation).
    const timer = setTimeout(() => setRipples([]), 700);
    return () => clearTimeout(timer);
  }, [ripples]);
  const style = p.herouiWebProps?.style;
  return <Button {...p.herouiWebProps} isDisabled={p.isDisabled} aria-label={p.accessibilityLabel}
    className={cn("group relative isolate block overflow-hidden border-0 bg-transparent p-0 text-left text-foreground outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-50", !p.isAnimationDisabled && "transition-transform duration-200 motion-reduce:transition-none motion-reduce:!scale-100", p.className)}
    style={state => ({ ...(typeof style === "function" ? style(state) : style),
      scale: !p.isAnimationDisabled && state.isPressed ? "0.985" : "1" })}
    onPressStart={event => {
      p.herouiWebProps?.onPressStart?.(event);
      if (p.isDisabled || p.feedback !== "ripple" || p.isAnimationDisabled
        || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      const { clientWidth: width, clientHeight: height } = event.target;
      const centered = event.pointerType === "keyboard" || event.pointerType === "virtual";
      const x = centered ? width / 2 : Math.max(0, Math.min(width, event.x));
      const y = centered ? height / 2 : Math.max(0, Math.min(height, event.y));
      const size = 2 * Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
      setRipples(previous => [...previous.slice(-7), { id: ++sequence.current, x, y, size }]);
    }}
    onPress={() => { if (!p.isDisabled) p.onPress?.(); }}>
    {p.feedback && p.feedback !== "none" && <span aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 group-data-[pressed=true]:opacity-10",
        !p.isAnimationDisabled && "transition-opacity duration-200 motion-reduce:transition-none",
        "bg-foreground")} />}
    {ripples.map(ripple => <span key={ripple.id} aria-hidden="true" className="ui-pressable-ripple"
      style={{ left: ripple.x - ripple.size / 2, top: ripple.y - ripple.size / 2, width: ripple.size, height: ripple.size }}
      onAnimationEnd={() => setRipples(previous => previous.filter(item => item.id !== ripple.id))} />)}
    {p.children}
  </Button>;
}
