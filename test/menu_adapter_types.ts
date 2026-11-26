// 通过公开类型入口检查宿主契约；由 library typecheck 覆盖，不引入平台运行时。
import type { ContextMenuProps, DropdownProps, MenuAdapter, MenuAdapterItem, MenuAdapterRequest, MenuAdapterSession, MenuConfig, NativeMenuRequest } from "../src/core";

const legacyRequest: NativeMenuRequest = { x: 1, y: 2, items: [{ text: "legacy" }] };
const session: MenuAdapterSession = { closed: Promise.resolve(), close() {}, dispose() {} };
const adapter: MenuAdapter = { open: (request: MenuAdapterRequest) => {
  const item: MenuAdapterItem | undefined = request.items[0];
  if (item?.id) void request.select(item.id);
  return session;
} };
const config: MenuConfig = { menuAdapter: adapter, showNativeMenu: async (_request: NativeMenuRequest) => {} };
const contextProps: ContextMenuProps = { menuAdapter: adapter, menuAdapterOptions: { theme: "host" }, items: [{ value: "copy", hostData: { icon: "copy" } }] };
const dropdownProps: DropdownProps = { menuAdapter: false, items: [{ value: "copy", hostData: { custom: true } }] };
void [legacyRequest, config, contextProps, dropdownProps];
