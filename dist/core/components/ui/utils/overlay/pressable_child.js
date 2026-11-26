import { cloneElement, forwardRef, useMemo } from "react";
function composeRefs(...refs) {
    return node => {
        const cleanups = refs.map(ref => {
            if (typeof ref === "function")
                return ref(node);
            if (ref)
                ref.current = node;
        });
        // React 19 callback refs may return cleanup instead of receiving null.
        return () => refs.forEach((ref, index) => {
            const cleanup = cleanups[index];
            if (typeof cleanup === "function")
                cleanup();
            else if (typeof ref === "function")
                ref(null);
            else if (ref)
                ref.current = null;
        });
    };
}
/** Single-child adapter for the window anchor; never adds a native layout node. */
export const PressableChild = forwardRef(function PressableChild({ children, ...props }, ref) {
    const child = children.props;
    const mergedRef = useMemo(() => composeRefs(ref, child.ref), [ref, child.ref]);
    const merged = { ...props, ...child };
    const childProps = { ...child };
    // Keep the child's handler first, followed by the anchor/HeroUI handler.
    for (const [key, handler] of Object.entries(props)) {
        const childHandler = childProps[key];
        if (/^on[A-Z]/.test(key) && typeof handler === "function") {
            merged[key] = typeof childHandler === "function"
                ? (...args) => { Reflect.apply(childHandler, undefined, args); Reflect.apply(handler, undefined, args); }
                : handler;
        }
    }
    if (props.style != null || child.style != null) {
        merged.style = typeof props.style === "function" || typeof child.style === "function"
            ? (state) => [
                typeof props.style === "function" ? props.style(state) : props.style,
                typeof child.style === "function" ? child.style(state) : child.style,
            ]
            : [props.style, child.style];
    }
    if (props.className || child.className) {
        merged.className = [props.className, child.className].filter(Boolean).join(" ");
    }
    return cloneElement(children, { ...merged, ref: mergedRef });
});
