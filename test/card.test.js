import { expect, test } from "bun:test";

for (const platform of ["web", "native"]) {
  test(`Card ${platform}: real HeroUI slots, variants, content and platform props`, async () => {
    const child = Bun.spawn([process.execPath, "test", "./test/card.fixture.jsx"], {
      cwd: new URL("../", import.meta.url).pathname,
      env: { ...process.env, CARD_TEST_PLATFORM: platform },
      stdout: "pipe", stderr: "pipe",
    });
    const [code, stdout, stderr] = await Promise.all([
      child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
    ]);
    expect({ code, output: code === 0 ? "passed" : stdout + stderr }).toEqual({ code: 0, output: "passed" });
  });
}
