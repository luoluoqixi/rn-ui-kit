import { expect, test } from "bun:test";

for (const platform of ["web", "android", "ios"]) {
  test("NativeList basic styles and press cancellation: " + platform, async () => {
    const child = Bun.spawn([process.execPath, "test", "./test/native_list_basic.fixture.jsx"], {
      cwd: new URL("../", import.meta.url).pathname,
      env: { ...process.env, BASIC_LIST_PLATFORM: platform },
      stdout: "pipe", stderr: "pipe",
    });
    const [code, stdout, stderr] = await Promise.all([
      child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
    ]);
    expect({ code, output: code === 0 ? "passed" : stdout + stderr }).toEqual({ code: 0, output: "passed" });
  }, 30000);
}
