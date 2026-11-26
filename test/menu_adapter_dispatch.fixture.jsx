import { expect, mock, test } from "bun:test";
const React = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const Platform = { OS: "web" };
mock.module("react-native", () => ({ Platform }));
const received = [];
const renderer = name => props => { received.push({ name, props }); return <div data-renderer={name} />; };
for (const [path, exported, name] of [
  ["context_menu/context_menu_native", "ContextMenuNative", "context-system"],
  ["context_menu/context_menu_heroui", "ContextMenuHeroUI", "context-heroui"],
  ["context_menu/context_menu_host", "ContextMenuHost", "context-host"],
  ["dropdown/dropdown_native", "DropdownNative", "dropdown-system"],
  ["dropdown/dropdown_heroui", "DropdownHeroUI", "dropdown-heroui"],
  ["dropdown/dropdown_host", "DropdownHost", "dropdown-host"],
]) mock.module("../src/core/components/ui/" + path, () => ({ [exported]: renderer(name) }));
const { ContextMenu } = await import("../src/core/components/ui/context_menu/context_menu");
const { Dropdown } = await import("../src/core/components/ui/dropdown/dropdown");
const { MenuProvider } = await import("../src/core/components/ui/context_menu/menu_provider");
const adapter = { open: () => ({}) };
function dispatch(Component, props = {}, config = {}) {
  renderToStaticMarkup(<MenuProvider value={config}><Component items={[]} trigger={<button>入口</button>} {...props} /></MenuProvider>);
  return received.at(-1);
}

test("Web adapter precedence and existing legacy fallback remain explicit", () => {
  Platform.OS = "web";
  for (const [Component, prefix] of [[ContextMenu, "context"], [Dropdown, "dropdown"]]) {
    expect(dispatch(Component).name).toBe(prefix + "-heroui");
    expect(dispatch(Component, { native: true }).name).toBe(prefix + "-heroui");
    expect(dispatch(Component, {}, { menuAdapter: adapter }).name).toBe(prefix + "-host");
    expect(dispatch(Component, { native: false }, { menuAdapter: adapter }).name).toBe(prefix + "-heroui");
    expect(dispatch(Component, { menuAdapter: false }, { menuAdapter: adapter }).name).toBe(prefix + "-heroui");
    expect(dispatch(Component, {}, { menuAdapter: adapter, native: false }).name).toBe(prefix + "-heroui");
    expect(dispatch(Component, { menuAdapter: adapter }, { native: false }).name).toBe(prefix + "-heroui");
    expect(dispatch(Component, { menuAdapter: adapter, native: true }, { native: false }).name).toBe(prefix + "-host");
    expect(dispatch(Component, { menuAdapter: adapter, native: false }).name).toBe(prefix + "-heroui");
  }
  const legacy = { native: true, showNativeMenu: async () => {} };
  expect(dispatch(ContextMenu, {}, legacy).name).toBe("context-host");
  expect(dispatch(ContextMenu, { menuAdapter: false }, legacy).name).toBe("context-heroui");
  expect(dispatch(ContextMenu, {}, { ...legacy, menuAdapter: false }).name).toBe("context-heroui");
  expect(dispatch(Dropdown, {}, legacy).name).toBe("dropdown-heroui");
});

for (const platform of ["ios", "android"]) test(platform + ": external adapters do not replace preserved system-native or HeroUI branches", () => {
  Platform.OS = platform;
  for (const [Component, prefix] of [[ContextMenu, "context"], [Dropdown, "dropdown"]]) {
    const base = dispatch(Component, { menuAdapter: adapter, menuAdapterOptions: { custom: true }, nativeTrigger: true }, { menuAdapter: adapter });
    expect(base.name).toBe(prefix + "-system");
    expect(base.props.menuAdapter).toBeUndefined(); expect(base.props.menuAdapterOptions).toBeUndefined();
    expect(base.props.nativeTrigger).toBe(true);
    expect(dispatch(Component, { native: false, menuAdapter: adapter }, { menuAdapter: adapter }).name).toBe(prefix + "-heroui");
  }
  // ContextMenu 原有 provider.native 仍有效；Dropdown 的移动端默认值不受旧配置影响。
  expect(dispatch(ContextMenu, {}, { native: false }).name).toBe("context-heroui");
  expect(dispatch(ContextMenu, { menuAdapter: adapter }, { native: false }).name).toBe("context-heroui");
  expect(dispatch(Dropdown, {}, { native: false }).name).toBe("dropdown-system");
});
