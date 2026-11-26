import { cn } from "../utils/cn";
// Context comes from container text slots as utilities. Explicit Typography props
// must override those utilities as well as HeroUI's own component-layer defaults.
const types = {
    h1: "text-4xl font-semibold tracking-tight", h2: "text-3xl font-semibold tracking-tight",
    h3: "text-2xl font-semibold tracking-tight", h4: "text-xl font-semibold tracking-tight",
    h5: "text-lg font-semibold tracking-tight", h6: "text-base font-semibold tracking-tight",
    body: "text-base leading-7 font-normal", "body-sm": "text-sm leading-6 font-normal",
    "body-xs": "text-xs leading-5 font-normal", code: "text-sm font-mono",
};
const weights = { normal: "font-normal", medium: "font-medium", semibold: "font-semibold", bold: "font-bold" };
const aligns = { start: "text-start", center: "text-center", end: "text-end", justify: "text-justify" };
export function textClassName(props, inherited, isNative = false) {
    return cn(inherited, props.type && types[props.type], props.align && (isNative && props.align === "start" ? "text-left" : isNative && props.align === "end" ? "text-right" : aligns[props.align]), props.color === "muted" ? "text-muted" : props.color === "default" ? "text-foreground" : undefined, props.weight && weights[props.weight], props.className);
}
