import { expect, mock, test } from "bun:test";
import * as React from "react";
import { Window } from "happy-dom";

const win = new Window({ url: "http://localhost/" });
for (const key of ["window", "document", "navigator", "HTMLElement", "Element", "Node"]) globalThis[key] = key === "window" ? win : win[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");
const shared = initial => ({ value: initial, get() { return this.value; }, set(v) { this.value = v; }, modify(fn) { this.value = fn(this.value); } });
let reactions = [];
const gesture = () => {
  const g = {};
  for (const key of ["enabled", "onBegin", "onStart", "onChange", "onFinalize"]) g[key] = value => { g[key + "Value"] = value; return g; };
  return g;
};
const layoutAnimation = new Proxy(function () {}, { get: (_, key) => key === "then" ? undefined : () => layoutAnimation, apply: () => layoutAnimation, construct: () => layoutAnimation });
mock.module("react-native", () => ({ useWindowDimensions: () => ({ width: 390, height: 844 }) }));
mock.module("react-native-gesture-handler", () => ({ Gesture: { Pan: gesture } }));
mock.module("react-native-worklets", () => ({ isRNRuntime: () => false, scheduleOnRN: fn => fn() }));
mock.module("react-native-reanimated", () => ({
  Easing: { bezier: () => null }, Extrapolation: { CLAMP: "clamp" },
  FadeInDown: layoutAnimation, FadeInUp: layoutAnimation, Keyframe: layoutAnimation,
  interpolate: (v, [x0, x1], [y0, y1]) => y0 + (y1 - y0) * Math.max(0, Math.min(1, (v - x0) / (x1 - x0))),
  useSharedValue: v => React.useRef(shared(v)).current,
  useAnimatedReaction: (prepare, react) => { reactions.push({ prepare, react, prev: undefined }); },
  useAnimatedStyle: read => ({ read }),
  withSpring: (v, _, done) => { done?.(true); return v; },
  withTiming: v => v, withDecay: () => 0,
}));
for (const tree of ["src", "lib/module"]) {
  const ext = tree === "src" ? "ts" : "js";
  const base = new URL("../node_modules/heroui-native/" + tree + "/helpers/internal/", import.meta.url).pathname;
  mock.module(base + "hooks/index." + ext, () => ({ useCombinedAnimationDisabledState: () => false }));
  mock.module(base + "utils/index." + ext, () => ({
    getRootAnimationState: () => ({ animationConfig: {}, isAnimationDisabled: false }),
    getIsAnimationDisabledValue: () => false,
    getAnimationValueProperty: ({ defaultValue }) => defaultValue,
    getAnimationValueMergedConfig: ({ defaultValue }) => defaultValue,
  }));
}
// These execute the installed source AND ESM hook, not a copied implementation.
const source = await import("../node_modules/heroui-native/src/components/toast/toast.animation.ts");
const esm = await import("../node_modules/heroui-native/lib/module/components/toast/toast.animation.js");
function flush() {
  for (const r of reactions) {
    const current = r.prepare();
    if (JSON.stringify(current) !== JSON.stringify(r.prev)) { const prev = r.prev; r.prev = current; r.react(current, prev); }
  }
}
for (const [name, { useToastRootAnimation }] of [["source", source], ["esm", esm]]) {
  test(name + ": dragging reveals full natural height and both covers; cancel and promote restore correct stack", async () => {
    reactions = [];
    const stack = shared({ frontId: "front", total: 2, positions: { back: 0, front: 1 } });
    const heights = shared({ front: 64, back: 120 });
    const frontDrag = shared(0);
    let styles;
    function Probe() { styles = useToastRootAnimation({ id: "back", index: 0, total: shared(2), heights, stack, frontDrag, placement: "bottom" }); return null; }
    const mount = document.createElement("div"); document.body.append(mount); const root = createRoot(mount);
    try {
      await React.act(() => root.render(<Probe />)); flush();
      expect(styles.rRootStyle.read().height).toBe(64);
      expect(styles.rCoverStyle.read().opacity).toBe(1);
      expect(styles.rCoverEdgeStyle.read().opacity).toBe(1);
      frontDrag.set(1); flush();
      expect(styles.rRootStyle.read().height).toBe("auto");
      expect(styles.rCoverStyle.read().opacity).toBe(0);
      expect(styles.rCoverEdgeStyle.read().opacity).toBe(0);
      // A multiline/promise/custom toast may resize while it is exposed.
      styles.onLayout({ nativeEvent: { layout: { height: 160 } } }); flush();
      expect(heights.get().back).toBe(160);
      frontDrag.set(0); flush();
      expect(styles.rRootStyle.read().height).toBe(64);
      expect(styles.rCoverEdgeStyle.read().opacity).toBe(1);
      stack.set({ frontId: "back", total: 1, positions: { back: 0 } }); flush();
      expect(styles.rRootStyle.read().height).toBe("auto");
      expect(styles.rCoverStyle.read().opacity).toBe(0);
      expect(styles.rCoverEdgeStyle.read().opacity).toBe(0);
    } finally { await React.act(() => root.unmount()); }
  });
}
