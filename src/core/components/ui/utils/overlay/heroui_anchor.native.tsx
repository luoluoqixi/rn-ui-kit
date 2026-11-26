import { createContext, forwardRef, useContext, useImperativeHandle, useLayoutEffect, useRef, type ReactElement, type ReactNode, type Ref } from "react";
import { PressableChild } from "./pressable_child";
import { findNodeHandle, Platform, type PressableProps, type View } from "react-native";
import { KeyboardControllerNative } from "react-native-keyboard-controller";
import { useTrueSheetOverlaySheetTopPosition } from "../../sheet/native_sheet/true_sheet/overlay_layout_context";
import { isTrueSheetOverlayPortalHostName } from "../../sheet/native_sheet/true_sheet/overlay_host_name";
import { useScopedOverlayPortalHostName } from "./screen_overlay_portal";

const WindowOverlayHostContext = createContext<string | undefined>(undefined);

/** Android Modal owns a separate native window. Mount HeroUI in the nearest
 * scoped host so TrueSheetOverlay can find that window's content container.
 * iOS keeps HeroUI's existing full-window host and presentation behavior. */
export function useHeroUIOverlayPortalHostName() {
  const hostName = useScopedOverlayPortalHostName();
  return Platform.OS === "android" ? hostName : undefined;
}

/** Descendants of a HeroUI full-window portal already use window coordinates.
 * A new child sheet still needs its own offset, identified by its new host. */
export function HeroUIWindowOverlayScope({ children }: { children: ReactNode }) {
  const hostName = useScopedOverlayPortalHostName();
  return <WindowOverlayHostContext.Provider value={hostName}>{children}</WindowOverlayHostContext.Provider>;
}

/** HeroUI portals fill the native window. Fabric stops measureInWindow() at
 * TrueSheet's RootNodeKind, omitting UIKit presentation transforms as well as
 * the sheet's origin. On iOS use the existing native window-measurement API.
 * Adapt only HeroUI's measurement handle; keep the actual trigger and its ref.
 */
export const HeroUIWindowAnchor = forwardRef<View, Omit<PressableProps, "children"> & {
  isOpen: boolean;
  children: ReactElement<PressableProps & { ref?: Ref<View> }>;
}>(function HeroUIWindowAnchor({ children, isOpen, ...props }, ref) {
  const nativeRef = useRef<View | null>(null);
  const hostName = useScopedOverlayPortalHostName();
  const sheetTop = useTrueSheetOverlaySheetTopPosition();
  const windowHostName = useContext(WindowOverlayHostContext);
  // A Modal opened inside a sheet inherits its layout context but replaces
  // the scoped host. Only the nearest sheet contributes its absolute offset.
  const isSheetAnchor = !!hostName && hostName !== windowHostName && isTrueSheetOverlayPortalHostName(hostName);
  const offsetY = isSheetAnchor ? sheetTop ?? 0 : 0;
  const measurementRef = useRef({ offsetY, isSheetAnchor });
  measurementRef.current = { offsetY, isSheetAnchor };
  const remeasureRef = useRef<(() => void) | null>(null);
  const measurementId = useRef(0);

  useImperativeHandle(ref, () => new Proxy({} as View, {
    get(_target, key) {
      const node = nativeRef.current;
      if (key === "measure") {
        return (callback: Parameters<View["measure"]>[0]) => {
          const measure = () => {
            const node = nativeRef.current;
            if (!node) return;
            const id = ++measurementId.current;
            const { offsetY: sheetOffset, isSheetAnchor: inSheet } = measurementRef.current;
            const isCurrent = () => id === measurementId.current && nativeRef.current === node;
            const fallback = () => {
              if (!isCurrent()) return;
              // In the app window, Android measureInWindow subtracts the
              // viewport/system-bar origin. TrueSheetOverlay fills the native
              // content root, which uses measure()'s root coordinates instead.
              // A sheet has a separate Fabric root: retain its local measurement
              // plus the native sheet position, without adding status-bar guesses.
              if (Platform.OS === "android" && !inSheet) {
                node.measure((...args) => { if (isCurrent()) callback(...args); });
                return;
              }
              node.measureInWindow((x, y, width, height) => {
                if (isCurrent()) callback(0, 0, width, height, x, y + sheetOffset);
              });
            };
            // iOS convertRect includes the floating sheet's outer scale/inset.
            // Android keeps its sheet-local measurement path below.
            if (Platform.OS === "ios" && inSheet) {
              try {
                const tag = findNodeHandle(node);
                if (tag !== null) {
                  void KeyboardControllerNative.viewPositionInWindow(tag).then((rect) => {
                    if (!isCurrent()) return;
                    if ([rect?.x, rect?.y, rect?.width, rect?.height].every(Number.isFinite) && rect.width > 0 && rect.height > 0) {
                      callback(0, 0, rect.width, rect.height, rect.x, rect.y);
                    } else {
                      fallback();
                    }
                  }).catch(fallback);
                  return;
                }
              } catch {
                // A detached native view or unavailable command can still use
                // the existing Fabric + native sheet-position fallback.
              }
            }
            fallback();
          };
          remeasureRef.current = measure;
          measure();
        };
      }
      if (!node) return undefined;
      const value = Reflect.get(node, key, node);
      return typeof value === "function" ? value.bind(node) : value;
    },
  }), []);

  // Native sheet motion changes the window origin without a Yoga onLayout.
  // Replay the real measurement rather than synthesizing a public layout event.
  useLayoutEffect(() => {
    ++measurementId.current;
    if (isOpen) remeasureRef.current?.();
    // Ignore late native results after close, unmount or a newer measurement.
    return () => { ++measurementId.current; };
  }, [isOpen, offsetY, hostName, windowHostName]);

  return <PressableChild {...props} ref={nativeRef}>{children}</PressableChild>;
});
