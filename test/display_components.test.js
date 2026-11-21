import { expect, test } from "bun:test";

for (const platform of ["web", "native"]) {
  test(`Alert, Avatar, Chip and Badge ${platform}: real HeroUI behavior and platform props`, async () => {
    const child = Bun.spawn([process.execPath, "test", "./test/display_components.fixture.jsx"], {
      cwd: new URL("../", import.meta.url).pathname,
      env: { ...process.env, DISPLAY_TEST_PLATFORM: platform },
      stdout: "pipe", stderr: "pipe",
    });
    const [code, stdout, stderr] = await Promise.all([
      child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
    ]);
    expect({ code, output: code === 0 ? "passed" : stdout + stderr }).toEqual({ code: 0, output: "passed" });
  });
}
