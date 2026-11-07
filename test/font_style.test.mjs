import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultFontStyle } from "../src/core/components/ui/provider/font_style";

test("字体上下文只提供默认值，代码和未选择字体不注入 family", () => {
  assert.equal(defaultFontStyle(undefined), undefined);
  assert.deepEqual(defaultFontStyle("Example"), { fontFamily: "Example" });
  assert.equal(defaultFontStyle("Example", "text-sm font-mono"), undefined);
  assert.equal(defaultFontStyle("Example", "md:font-mono"), undefined);
});
