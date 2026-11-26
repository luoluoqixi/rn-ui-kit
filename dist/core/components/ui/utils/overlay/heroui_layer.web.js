import { jsx as _jsx } from "react/jsx-runtime";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
/** Join Radix's layer order so a TrueSheet below a HeroUI overlay cannot
 * consume Escape in document capture before React Aria sees the key.
 * Only suppress Radix dismissal; React Aria retains its own keyboard behavior,
 * including submenu focus restoration and protected AlertDialogs.
 */
export function HeroUIOverlayLayer({ children }) {
    return _jsx(DismissableLayer, { asChild: true, onEscapeKeyDown: event => event.preventDefault(), children: children });
}
