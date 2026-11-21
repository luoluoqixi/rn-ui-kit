import { expect, test } from "bun:test";
for (const platform of ["web", "ios", "android"]) {
  test("collection, action and search HeroUI adapters: " + platform, async () => {
    const child = Bun.spawn([process.execPath, "test", "./test/collection_controls.fixture.jsx"], {
      cwd: new URL("../", import.meta.url).pathname,
      env: { ...process.env, BATCH_TEST_PLATFORM: platform }, stdout: "pipe", stderr: "pipe",
    });
    const [code, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
    expect({ code, output: code === 0 ? "passed" : stdout + stderr }).toEqual({ code: 0, output: "passed" });
  }, 30000);
}
