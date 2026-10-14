import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const patchUrl = new URL("../patches/react-native-screens@4.24.0.patch", import.meta.url);
const patch = readFileSync(patchUrl, "utf8");

// 只检查补丁的最终侧，避免已删除的旧代码让链路检查误通过。
function finalSide(path) {
  const marker = `diff --git a/${path} b/${path}`;
  const block = patch.split(/(?=^diff --git )/m).find((part) => part.startsWith(marker + "\n"));
  expect(block, `缺少 ${path} 的补丁`).toBeDefined();
  return block
    .split("\n")
    .filter((line) => line.startsWith(" ") || (line.startsWith("+") && !line.startsWith("+++")))
    .map((line) => line.slice(1))
    .join("\n");
}

describe("react-native-screens 补丁链路完整性", () => {
  test("库与 example 使用相同补丁，每个文件只有一个完整 diff", () => {
    const example = readFileSync(new URL("../examples/app/patches/react-native-screens@4.24.0.patch", import.meta.url), "utf8");
    expect(example).toBe(patch);
    const paths = [...patch.matchAll(/^diff --git a\/(\S+) b\/\S+$/gm)].map((match) => match[1]);
    expect(new Set(paths).size).toBe(paths.length);
  });

  test("三种返回手势入口均保存几何修复状态，并保留 iOS 26 退出条件", () => {
    const stack = finalSide("ios/RNSScreenStack.mm");
    expect(stack.match(/prepareCancelledTransitionHeaderGeometryFixForNavigationBar:/g)).toHaveLength(3);
    expect(stack.match(/withConfig:topScreen\.findHeaderConfig/g)).toHaveLength(3);
    expect(stack.match(/withConfig:topScreen\.findHeaderConfig\];\s*\[self cancelTouchesInParent\];/g)).toHaveLength(3);
    const header = finalSide("ios/RNSScreenStackHeaderConfig.mm");
    expect(header).toMatch(/if \(@available\(iOS 26\.0, \*\)\) \{\s*return;/);
    expect(header).toContain("positionAnimation.fillMode = kCAFillModeForwards;");
    expect(header).toContain("positionAnimation.removedOnCompletion = NO;");
    expect(header).toContain("RNSHeaderClearGeometryFixState(navigationBar);");
  });

  for (const entry of ["src", "lib/module", "lib/commonjs"]) {
    test(`${entry} 保留三态转换、菜单标识和打开回调`, () => {
      const isSource = entry === "src";
      const config = finalSide(`${entry}/components/ScreenStackHeaderConfig.${isSource ? "tsx" : "js"}`);
      const helper = finalSide(`${entry}/components/helpers/prepareHeaderBarButtonItems.${isSource ? "ts" : "js"}`);
      const expression = isSource
        ? config.match(/cancelledTransitionHeaderGeometryFixMode=\{([\s\S]*?)\}/)?.[1]
        : config.match(/cancelledTransitionHeaderGeometryFixMode: ([^,]+),/)?.[1];
      expect(expression).toBeDefined();
      const mode = new Function("cancelledTransitionHeaderGeometryFixEnabled", `return (${expression});`);
      expect([undefined, null, true, false].map(mode)).toEqual([0, 0, 1, 2]);
      expect(config).toContain("item.menuOpenId === event.nativeEvent.buttonId");
      expect(config).toContain("pressedItem.onOpen?.();");
      expect(helper).toContain("const menuOpenId = item.onOpen ? `${index}-${side}` : undefined;");
      expect(helper.match(/^\s*menuOpenId,?$/gm)).toHaveLength(2);
    });
  }

  test("Native 菜单仍消费 menuOpenId，并回传打开事件", () => {
    const menu = finalSide("ios/RNSBarButtonItem.mm");
    expect(menu).toContain('NSString *menuOpenId = dict[@"menuOpenId"];');
    expect(menu).toContain("menuOpenAction(menuOpenId);");
    expect(finalSide("ios/RNSScreenStackHeaderConfig.mm")).toContain("menuOpenAction:^(NSString *buttonId)");
  });

  test("恢复 Android 阴影防裁剪，同时保留两平台 headerOpacity", () => {
    const subview = finalSide("android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderSubview.kt");
    expect(subview).toContain("clipChildren = false");
    expect(subview).toContain("clipToPadding = false");
    expect(finalSide("android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfig.kt")).toContain("toolbar.animate().alpha(headerOpacity)");
    expect(finalSide("ios/RNSScreenStackHeaderConfig.mm")).toContain("navctr.navigationBar.alpha = config.headerOpacity;");
  });
});
