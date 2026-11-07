import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

test("NativeTrigger 的 DOM 右键和点击行为", () => {
  const result = spawnSync(
    process.execPath,
    ["test", fileURLToPath(new URL("./native_trigger_context_menu.fixture.jsx", import.meta.url))],
    { encoding: "utf8" },
  );
  if (result.status !== 0) throw new Error(`${result.stdout}\n${result.stderr}`);
  expect(result.status).toBe(0);
}, 30000);
