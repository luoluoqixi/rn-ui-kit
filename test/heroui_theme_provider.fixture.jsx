import { expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
import * as React from "react";

const win = new Window({ url: "http://localhost/" });
for (const key of ["window", "document", "navigator", "HTMLElement", "Element", "Node"]) {
  globalThis[key] = key === "window" ? win : win[key];
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const calls = [];
const variablesByScheme = {};
mock.module("uniwind", () => ({
  ScopedVariables: ({ children }) => children,
  Uniwind: {
    setTheme: theme => calls.push(theme),
    updateCSSVariables: (scheme, variables) => { variablesByScheme[scheme] = variables; },
  },
}));
const { createRoot } = await import("react-dom/client");
const { UiThemeProvider, useUiTheme, useUiColorScheme } = await import("../src/core/components/ui/utils/theme/ui_theme");

function Probe() {
  const theme = useUiTheme();
  return <p>{useUiColorScheme()}:{theme.accent}:{theme.muted}</p>;
}

test("theme provider preserves Native adaptive mode, syncs both palettes and updates concrete consumers", async () => {
  const mount = document.createElement("div");
  document.body.append(mount);
  const root = createRoot(mount);
  try {
    await React.act(() => root.render(
      <UiThemeProvider accentThemeName="ocean" colorScheme="light" followsSystem><Probe /></UiThemeProvider>,
    ));
    // Fixed light/dark would pin Native Appearance and stop future OS changes.
    expect(calls.at(-1)).toBe("system");
    expect(variablesByScheme.light["--muted"]).toBe("#62626c");
    expect(variablesByScheme.dark["--muted"]).toBe("#a1a1aa");
    expect(mount.textContent).toBe("light:" + variablesByScheme.light["--accent"] + ":#62626c");

    await React.act(() => root.render(
      <UiThemeProvider accentThemeName="#00d5e8" colorScheme="dark" followsSystem><Probe /></UiThemeProvider>,
    ));
    expect(calls.at(-1)).toBe("system");
    expect(variablesByScheme.light["--accent"]).toBe("#00d5e8");
    expect(mount.textContent).toBe("dark:" + variablesByScheme.dark["--accent"] + ":#a1a1aa");

    await React.act(() => root.render(
      <UiThemeProvider accentThemeName="ocean" colorScheme="dark" followsSystem={false}><Probe /></UiThemeProvider>,
    ));
    expect(calls.at(-1)).toBe("dark");
    expect(Object.keys(variablesByScheme.dark).some(key => key.startsWith("--color-"))).toBe(false);
  } finally {
    await React.act(() => root.unmount());
    win.close();
  }
});
