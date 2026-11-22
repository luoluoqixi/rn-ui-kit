import { expect, test } from "bun:test";
const cases = [
  ["web", "overlay_controls.fixture.jsx"],
  ["ios", "overlay_native.fixture.jsx"],
  ["android", "overlay_native.fixture.jsx"],
  ["web-portal", "toast_portal.fixture.jsx"],
  ["native-provider", "overlay_provider.fixture.jsx"],
  ["native-toast-stack", "toast_stack_animation.fixture.jsx"],
  ["native-window-anchor", "heroui_anchor.fixture.jsx"],
  ["native-window-anchor-android", "heroui_anchor.fixture.jsx", "android"],
];
for (const [platform, fixture, runtimePlatform = platform] of cases) {
  test("HeroUI overlay adapters and portal integration: " + platform, async () => {
    const child = Bun.spawn([process.execPath, "test", "./test/" + fixture], {
      cwd: new URL("../", import.meta.url).pathname,
      env: { ...process.env, OVERLAY_PLATFORM: runtimePlatform }, stdout: "pipe", stderr: "pipe",
    });
    const [code, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
    expect({ code, output: code === 0 ? "passed" : stdout + stderr }).toEqual({ code: 0, output: "passed" });
  }, 30000);
}
