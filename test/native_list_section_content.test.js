import { describe, expect, test } from "bun:test";

import { renderNativeListSectionContent } from "../src/core/components/ui/native_list/section_content";

describe("renderNativeListSectionContent", () => {
  test("普通 ReactNode 保持不变", () => {
    expect(renderNativeListSectionContent("分组标题")).toBe("分组标题");
  });

  test("函数组件会转换成元素而不是被直接调用", () => {
    let invoked = false;
    function SectionTitle() {
      invoked = true;
      return "函数标题";
    }

    const element = renderNativeListSectionContent(SectionTitle);

    expect(invoked).toBe(false);
    expect(element.type).toBe(SectionTitle);
  });
});
