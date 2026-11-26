import { expect, test } from "bun:test";

test("NativeList basic menu adapter inheritance and whole-row triggering", async () => {
  const child = Bun.spawn([process.execPath, "test", "./test/native_list_host_menu.fixture.jsx"], {
    cwd: new URL("../", import.meta.url).pathname, stdout: "pipe", stderr: "pipe",
  });
  const [code, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
  expect({ code, output: code === 0 ? "passed" : stdout + stderr }).toEqual({ code: 0, output: "passed" });
});
