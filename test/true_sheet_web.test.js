import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
test("isolated actual TrueSheet v4 Web methods and lifecycle", () => {
  const result = spawnSync(process.execPath, ["test", "./test/true_sheet_web.fixture.jsx"], { cwd: process.cwd(), encoding: "utf8", timeout: 20000 });
  if (result.status !== 0) throw new Error(result.stdout + '\n' + result.stderr);
  expect(result.status).toBe(0);
});
test("isolated TrueSheet focused scrollable binding and auto stack measurement", () => {
  const result = spawnSync(process.execPath, ["test", "./test/true_sheet_binding.fixture.jsx"], { cwd: process.cwd(), encoding: "utf8", timeout: 20000 });
  if (result.status !== 0) throw new Error(result.stdout + '\n' + result.stderr);
  expect(result.status).toBe(0);
});
