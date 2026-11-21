import { Button } from "react-aria-components/Button";
import { cn } from "../utils/cn";
import type { PressableFeedbackProps } from "./types";
export function PressableFeedbackHeroUI(p: PressableFeedbackProps) {
  const style = p.herouiWebProps?.style;
  return <Button {...p.herouiWebProps} isDisabled={p.isDisabled} aria-label={p.accessibilityLabel}
    className={cn("group relative isolate block overflow-hidden border-0 bg-transparent p-0 text-left text-foreground outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-50", !p.isAnimationDisabled && "transition-transform duration-200 motion-reduce:transition-none motion-reduce:!scale-100", p.className)}
    style={state => ({ ...(typeof style === "function" ? style(state) : style),
      scale: !p.isAnimationDisabled && state.isPressed ? "0.985" : "1" })}
    onPress={() => { if (!p.isDisabled) p.onPress?.(); }}>
    {p.feedback && p.feedback !== "none" && <span aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 group-data-[pressed=true]:opacity-10",
        !p.isAnimationDisabled && "transition-opacity duration-200 motion-reduce:transition-none",
        p.feedback === "highlight" ? "bg-foreground" : "bg-radial from-foreground to-transparent")} />}
    {p.children}
  </Button>;
}
