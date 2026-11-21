import { expect, test } from "bun:test";
import { otpGroups } from "../src/core/components/ui/input_otp/input_otp_state";
for (const platform of ["web", "native"]) {
  test(
    "form HeroUI components " +
      platform +
      ": real component structure and interactions",
    async () => {
      const child = Bun.spawn(
        [process.execPath, "test", "./test/form_components.fixture.jsx"],
        {
          cwd: new URL("../", import.meta.url).pathname,
          env: { ...process.env, FORM_TEST_PLATFORM: platform },
          stdout: "pipe",
          stderr: "pipe",
        },
      );
      const [code, stdout, stderr] = await Promise.all([
        child.exited,
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
      ]);
      expect({ code, output: code === 0 ? "passed" : stdout + stderr }).toEqual(
        { code: 0, output: "passed" },
      );
    },
  );
}
test("OTP groups normalize finite lengths and group sizes without duplicate/missing slot indices", () => {
  expect(otpGroups()).toEqual([[0, 1, 2, 3, 4, 5]]);
  expect(otpGroups(6, 3)).toEqual([
    [0, 1, 2],
    [3, 4, 5],
  ]);
  expect(otpGroups(5, 2)).toEqual([[0, 1], [2, 3], [4]]);
  for (const size of [0, -1, NaN, Infinity])
    expect(otpGroups(4, size)).toEqual([[0, 1, 2, 3]]);
  expect(otpGroups(0)).toEqual([[0]]);
  expect(otpGroups(NaN).flat()).toHaveLength(6);
  expect(otpGroups(Infinity).flat()).toHaveLength(6);
  expect(otpGroups(1000).flat()).toHaveLength(32);
});
