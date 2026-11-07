import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

function source(file) {
  return ts.createSourceFile(file, readFileSync(new URL(`../src/core/components/ui/${file}`, import.meta.url), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}
const indirectText = {
  "dialog/dialog.tsx": ["DialogPrimitive.Title", "DialogPrimitive.Description"],
  "alert_dialog/alert_dialog.tsx": ["AlertDialogPrimitive.Title", "AlertDialogPrimitive.Description"],
  "label/label.tsx": ["LabelPrimitive.Text"],
  "select/select_basic.tsx": ["SelectPrimitive.Value", "SelectPrimitive.Label", "SelectPrimitive.ItemText"],
  "context_menu/context_menu.tsx": ["ContextMenuPrimitive.Label"],
  "dropdown/dropdown.tsx": ["DropdownPrimitive.Label"],
  "menubar/menubar.tsx": ["MenubarPrimitive.Label"],
};

test("所有间接 RN 文字边界注入字体，显式 style 保持优先", () => {
  for (const [file, tags] of Object.entries(indirectText)) {
    const tree = source(file);
    const seen = new Set();
    function visit(node) {
      if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && tags.includes(node.tagName.getText(tree))) {
        seen.add(node.tagName.getText(tree));
        const style = node.attributes.properties.find(prop => ts.isJsxAttribute(prop) && prop.name.getText(tree) === "style");
        expect(style?.initializer?.getText(tree)).toContain("useDefaultTextStyle(props.style, className)");
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
    expect([...seen].sort()).toEqual([...tags].sort());
  }
});

test("SwiftUI 列表的显式 font 配置必须传入 family，恢复默认可清除", () => {
  for (const file of ["native_list/native_list_native.ios.tsx", "native_list/native_list_native/native_list_select_item.ios.tsx"]) {
    const tree = source(file);
    let count = 0;
    function visit(node) {
      if (ts.isCallExpression(node) && node.expression.getText(tree) === "font") {
        count++;
        const options = node.arguments[0];
        expect(ts.isObjectLiteralExpression(options)).toBe(true);
        expect(options.properties.some(prop => prop.name?.getText(tree) === "family")).toBe(true);
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
    expect(count).toBeGreaterThan(0);
  }
});
