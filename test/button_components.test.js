import { expect, test } from "bun:test";
for (const platform of ["web", "ios", "android"]) {
  test("Button HeroUI and preserved system API: " + platform, async () => {
    const child = Bun.spawn([process.execPath, "test", "./test/button_components.fixture.jsx"], {
      cwd: new URL("../", import.meta.url).pathname, env: { ...process.env, BUTTON_TEST_PLATFORM: platform }, stdout: "pipe", stderr: "pipe",
    });
    const [code, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
    expect({ code, output: code === 0 ? "passed" : stdout + stderr }).toEqual({ code: 0, output: "passed" });
  }, 20000);
}
