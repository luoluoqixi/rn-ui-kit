import type { MenuAdapter, MenuAdapterItem, MenuAdapterRequest, MenuAdapterSession } from "./menu_adapter_types";

type Control = { owner: object; feedbackReleased: boolean; cancel(notify?: boolean): void };
// 一个视口同时只有一份外部菜单请求有效，不将不同窗口/SSR 请求混在一起。
const activeSessions = new WeakMap<object, Control>();

export function startMenuAdapterSession({
  scope, owner, adapter, request, createItems, onRelease, onError, restoreFocus,
}: {
  scope: object;
  owner: object;
  adapter: MenuAdapter;
  request: Omit<MenuAdapterRequest, "items" | "signal" | "isCurrent" | "select">;
  createItems(isCurrent: () => boolean): MenuAdapterItem[];
  onRelease(): void;
  onError(error: unknown): void;
  restoreFocus(): void;
}) {
  const previous = activeSessions.get(scope);
  previous?.cancel(previous.owner !== owner);
  const abort = new AbortController();
  let session: MenuAdapterSession | undefined;
  let cleaned = false;
  const isCurrent = () => !abort.signal.aborted && activeSessions.get(scope) === control;
  const report = (error: unknown) => { if (isCurrent()) onError(error); };
  const cleanup = (close: boolean) => {
    if (!session || cleaned) return;
    cleaned = true;
    const resource = session;
    // 等 close 完成后再释放底层资源；取消与迟到的 open 结果共用此路径。
    void (async () => {
      try { if (close) await resource.close?.(); }
      catch (error) { report(error); }
      finally {
        try { await resource.dispose?.(); } catch (error) { report(error); }
      }
    })();
  };
  const release = () => {
    if (control.feedbackReleased) return;
    control.feedbackReleased = true;
    onRelease();
  };
  const control: Control = {
    owner, feedbackReleased: false,
    cancel(notify = true) {
      if (abort.signal.aborted) return;
      abort.abort();
      if (activeSessions.get(scope) === control) activeSessions.delete(scope);
      cleanup(true);
      if (notify) release();
    },
  };
  activeSessions.set(scope, control);
  void (async () => {
    try {
      const items = createItems(isCurrent);
      const actions = new Map<string, MenuAdapterItem["onSelect"]>();
      const collect = (entries: MenuAdapterItem[]) => {
        for (const item of entries) {
          actions.set(item.id, item.onSelect);
          if (item.subMenu) collect(item.subMenu);
        }
      };
      collect(items);
      session = await adapter.open({ ...request, items, signal: abort.signal, isCurrent,
        select: async id => { if (isCurrent()) await actions.get(id)?.(); },
      });
      // 即使 open 结果迟到，也观察 closed 的拒绝，避免无主的 Promise rejection。
      const closed = session.closed?.then(() => ({ ok: true } as const), error => ({ ok: false, error } as const));
      if (!isCurrent()) { cleanup(true); return; }
      if (!closed) {
        // 宿主无法观察关闭：结束 trigger 的打开反馈，但保留动作和资源的有效期。
        // 下次请求、禁用或卸载时再失效，不猜测焦点/超时，也不抢回焦点。
        release();
        return;
      }
      const result = await closed;
      if (!isCurrent()) return;
      if (!result.ok) throw result.error;
      release();
      restoreFocus();
      cleanup(false);
      control.cancel(false);
    } catch (error) {
      if (!isCurrent()) return;
      onError(error);
      release();
      control.cancel(false);
    }
  })();
  return control;
}
