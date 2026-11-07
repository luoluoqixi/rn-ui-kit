import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";

test("隔离验证字体 Provider、显式字体覆盖及输入框", () => {
  const result = spawnSync(process.execPath, ["test", "./test/font_provider.fixture.jsx"], { cwd: process.cwd(), encoding: "utf8" });
  if (result.status !== 0) throw new Error(`${result.stdout}\n${result.stderr}`);
  expect(result.status).toBe(0);
});
