import type { ReactElement } from "react";
/** Join Radix's layer order so a TrueSheet below a HeroUI overlay cannot
 * consume Escape in document capture before React Aria sees the key.
 * Only suppress Radix dismissal; React Aria retains its own keyboard behavior,
 * including submenu focus restoration and protected AlertDialogs.
 */
export declare function HeroUIOverlayLayer({ children }: {
    children: ReactElement;
}): import("react").JSX.Element;
