import { expect, test } from "bun:test";
import { resolveProgress } from "../src/core/components/ui/progress/progress_state";

for (const platform of ["web", "native"]) {
  test("basic HeroUI components " + platform + ": real component structure and behavior", async () => {
    const child = Bun.spawn([process.execPath, "test", "./test/basic_components.fixture.jsx"], {
      cwd: new URL("../", import.meta.url).pathname,
      env: { ...process.env, BASIC_TEST_PLATFORM: platform }, stdout: "pipe", stderr: "pipe",
    });
    const [code, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
    expect({ code, output: code === 0 ? "passed" : stdout + stderr }).toEqual({ code: 0, output: "passed" });
  });
}
test("Progress normalizes zero, ranges, invalid values, clamping and labels", () => {
  expect(resolveProgress({ value: 0 }).fraction).toBe(0);
  expect(resolveProgress({ value: 15, minValue: 10, maxValue: 20 })).toMatchObject({ current: 15, fraction: 0.5, valueText: "50%" });
  expect(resolveProgress({ value: -10 }).current).toBe(0);
  expect(resolveProgress({ value: 120 }).current).toBe(100);
  for (const value of [NaN, Infinity, -Infinity]) expect(resolveProgress({ value }).fraction).toBe(0);
  expect(resolveProgress({ minValue: 10, maxValue: 10 }).fraction).toBe(0);
  expect(resolveProgress({ isIndeterminate: true }).valueText).toBeUndefined();
  expect(resolveProgress({ isIndeterminate: true, valueLabel: "Connecting" }).valueText).toBe("Connecting");
  expect(resolveProgress({ value: 6, maxValue: 8, formatOptions: { style: "decimal" } }).valueText).toBe("6");
});
