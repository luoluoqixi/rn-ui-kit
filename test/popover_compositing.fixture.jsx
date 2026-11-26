import { expect, mock, test } from "bun:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

globalThis.__DEV__ = false;
const Platform = { OS: "android" };
const enteringStyle = { opacity: 0.5 };
const exiting = { animation: "exit-keyframe" };
let wrappers = [];
let contents = [];
let customEntering = false;
const passthrough = ({ children }) => children;
const AnimatedView = ({ children, ...props }) => { wrappers.push(props); return <div>{children}</div>; };
const Content = ({ children, ...props }) => { contents.push(props); return <section>{children}</section>; };
mock.module("react-native", () => ({ Platform, View: passthrough, StyleSheet: { create: styles => styles }, useWindowDimensions: () => ({ width: 390, height: 844 }) }));
mock.module("react-native-reanimated", () => ({ default: { View: AnimatedView, createAnimatedComponent: component => component } }));
mock.module("react-native-safe-area-context", () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));
for (const tree of ["src", "lib/module"]) {
  const ext = tree === "src" ? "ts" : "js";
  const base = new URL("../node_modules/heroui-native/" + tree + "/", import.meta.url).pathname;
  mock.module(base + "helpers/external/hooks/index." + ext, () => ({ useThemeColor: () => "#fff" }));
  mock.module(base + "helpers/external/utils/index." + ext, () => ({ cn: (...values) => values.filter(Boolean).join(" ") }));
  mock.module(base + "helpers/external/utils/cn." + ext, () => ({ tv: ({ base }) => ({ className } = {}) => [base, className].filter(Boolean).join(" ") }));
  mock.module(base + "helpers/internal/utils/index." + ext, () => ({ combineStyles: styles => styles }));
  mock.module(base + "helpers/internal/components/index." + ext, () => ({ FullWindowOverlay: passthrough, HeroText: passthrough, ThemeBackground: passthrough }));
  mock.module(base + "helpers/internal/components/popup-sheet-content." + (tree === "src" ? "tsx" : "js"), () => ({ PopupSheetContent: passthrough }));
  mock.module(base + "helpers/internal/contexts/index." + ext, () => ({ AnimationSettingsProvider: passthrough, useAnimationSettings: () => ({ isAllAnimationsDisabled: false }) }));
  mock.module(base + "helpers/internal/hooks/index." + ext, () => ({
    usePopupRootAnimation: () => ({}), usePopupOverlayAnimation: () => ({}),
    usePopupPopoverContentAnimation: () => ({ isDrivenEntering: !customEntering, rEnteringStyle: enteringStyle, entering: customEntering ? { animation: "custom-enter" } : undefined, exiting }),
  }));
  mock.module(base + "primitives/popover/index." + ext, () => ({ Root: passthrough, Trigger: passthrough, Portal: passthrough, Overlay: passthrough, Content, Close: passthrough, useRootContext: () => ({ contentLayout: { y: 100 } }) }));
  mock.module(base + "components/close-button/index." + ext, () => ({ CloseButton: passthrough }));
  mock.module(base + "components/popover/arrow-svg." + (tree === "src" ? "tsx" : "js"), () => ({ ArrowSvg: () => null }));
  mock.module(base + "components/popover/popover.animation." + ext, () => ({ PopoverAnimationProvider: passthrough, usePopoverAnimation: () => ({}) }));
}
// Exercise both installed entry points so patch installation and platform gating
// are checked in addition to the library wrapper's prop-forwarding tests.
const source = await import("../node_modules/heroui-native/src/components/popover/popover.tsx");
const esm = await import("../node_modules/heroui-native/lib/module/components/popover/popover.js");
for (const [name, { default: Popover }] of [["source", source], ["esm", esm]]) {
  for (const platform of ["android", "ios"]) {
    test(name + ": " + platform + " composites the actual exit wrapper without caching the surface shadow", () => {
      Platform.OS = platform; wrappers = []; contents = []; customEntering = false;
      const html = renderToStaticMarkup(<Popover.Content presentation="popover" background={null} needsOffscreenAlphaCompositing={platform === "android"}><input defaultValue="content" /></Popover.Content>);
      expect(html).toContain("content");
      expect(wrappers).toHaveLength(1);
      expect(wrappers[0].exiting).toBe(exiting);
      expect(wrappers[0].needsOffscreenAlphaCompositing).toBe(platform === "android");
      expect(wrappers[0].renderToHardwareTextureAndroid).toBeUndefined();
      expect(wrappers[0].pointerEvents).toBe("box-none");
      expect(wrappers[0].style).toMatchObject({ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 });
      expect(contents).toHaveLength(1);
      expect(contents[0].style).toContain(enteringStyle);
      expect(contents[0].needsOffscreenAlphaCompositing).toBe(platform === "android");
      expect(contents[0].renderToHardwareTextureAndroid).toBeUndefined();
    });
  }
  test(name + ": custom entering keeps the visible content's own exit and hidden measurement probe", () => {
    Platform.OS = "android"; wrappers = []; contents = []; customEntering = true;
    renderToStaticMarkup(<Popover.Content presentation="popover" background={null} needsOffscreenAlphaCompositing><span>custom</span></Popover.Content>);
    expect(wrappers).toHaveLength(0);
    expect(contents).toHaveLength(2);
    expect(contents[0].exiting).toBe(exiting);
    expect(contents[0].needsOffscreenAlphaCompositing).toBe(true);
    expect(contents[1].pointerEvents).toBe("none");
    expect(contents[1].className).toContain("opacity-0");
  });
}
