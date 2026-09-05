import { describe, expect, test } from "bun:test";

import { createTrueSheetStackNativeHeaderButton } from "../src/core/components/ui/sheet/native_sheet/true_sheet/stack_header_button";

describe("createTrueSheetStackNativeHeaderButton", () => {
  test("公共配置覆盖 iOS 扩展字段，并保留其余原生 item 属性", () => {
    const calls = [];
    const item = createTrueSheetStackNativeHeaderButton({
      buttonProps: {
        accessibilityLabel: "公共关闭",
        disabled: false,
        iosButtonProps: {
          accessibilityLabel: "iOS 关闭",
          disabled: true,
          label: "iOS 标签",
          onPress: () => calls.push("ios"),
          tintColor: "red",
          variant: "done",
          width: 52,
        },
        label: "关闭",
        onPress: () => calls.push("common"),
        tintColor: "blue",
      },
      defaultCloseSheetOnPress: true,
      defaultLabel: "默认关闭",
      headerTintColor: "green",
      onRequestClose: () => calls.push("close"),
    });

    expect(item).toMatchObject({
      accessibilityLabel: "公共关闭",
      disabled: false,
      label: "关闭",
      tintColor: "blue",
      type: "button",
      variant: "done",
      width: 52,
    });

    item.onPress();
    expect(calls).toEqual(["ios", "common", "close"]);
  });

  test("允许把右侧按钮改为不关闭 Sheet 的普通操作", () => {
    let closed = false;
    const item = createTrueSheetStackNativeHeaderButton({
      buttonProps: { closeSheetOnPress: false, label: "保存" },
      defaultCloseSheetOnPress: true,
      defaultLabel: "关闭",
      onRequestClose: () => {
        closed = true;
      },
    });

    expect(item.variant).toBe("plain");
    item.onPress();
    expect(closed).toBe(false);
  });
});
