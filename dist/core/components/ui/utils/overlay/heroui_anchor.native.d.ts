import { type ReactElement, type ReactNode, type Ref } from "react";
import { type PressableProps, type View } from "react-native";
/** Android Modal owns a separate native window. Mount HeroUI in the nearest
 * scoped host so TrueSheetOverlay can find that window's content container.
 * iOS keeps HeroUI's existing full-window host and presentation behavior. */
export declare function useHeroUIOverlayPortalHostName(): string | undefined;
/** Descendants of a HeroUI full-window portal already use window coordinates.
 * A new child sheet still needs its own offset, identified by its new host. */
export declare function HeroUIWindowOverlayScope({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
/** HeroUI portals fill the native window. Fabric stops measureInWindow() at
 * TrueSheet's RootNodeKind, omitting UIKit presentation transforms as well as
 * the sheet's origin. On iOS use the existing native window-measurement API.
 * Adapt only HeroUI's measurement handle; keep the actual trigger and its ref.
 */
export declare const HeroUIWindowAnchor: import("react").ForwardRefExoticComponent<Omit<PressableProps, "children"> & {
    isOpen: boolean;
    children: ReactElement<PressableProps & {
        ref?: Ref<View>;
    }>;
} & import("react").RefAttributes<View>>;
