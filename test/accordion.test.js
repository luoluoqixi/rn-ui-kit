import { expect, test } from "bun:test";
import { validateAccordionItems } from "../src/core/components/ui/accordion/use_accordion_state";

for (const platform of ["web", "native"]) {
  test(`Accordion ${platform}: real HeroUI state, slots, refs and disabled behavior`, async () => {
    const child = Bun.spawn([process.execPath, "test", "./test/accordion.fixture.jsx"], {
      cwd: new URL("../", import.meta.url).pathname,
      env: { ...process.env, ACCORDION_TEST_PLATFORM: platform },
      stdout: "pipe", stderr: "pipe",
    });
    const [code, stdout, stderr] = await Promise.all([
      child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
    ]);
    expect({ code, output: code === 0 ? "passed" : stdout + stderr }).toEqual({ code: 0, output: "passed" });
  });
}

test("Accordion keys reserve the empty controlled value and reject duplicates", () => {
  expect(() => validateAccordionItems([])).not.toThrow();
  expect(() => validateAccordionItems([{ value: "a" }, { value: "b" }])).not.toThrow();
  expect(() => validateAccordionItems([{ value: "" }])).toThrow("nonempty, unique");
  expect(() => validateAccordionItems([{ value: "a" }, { value: "a" }])).toThrow("nonempty, unique");
});
