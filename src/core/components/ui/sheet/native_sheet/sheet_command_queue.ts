type SheetCommands = {
  present: (index: number) => Promise<void>;
  dismiss: () => Promise<void>;
  resize: (index: number) => Promise<void>;
};

/** Serialize v4 animation promises and coalesce rapid controlled state changes. */
export function createWebSheetCommandQueue(commands: SheetCommands, initialOpen: boolean, initialIndex: number) {
  let desired = { open: initialOpen, index: initialIndex };
  let observed = { ...desired };
  let ready = !initialOpen;
  let disposed = false;
  let running = false;
  let expectedDetentEvent: number | null = null;
  const pump = async () => {
    if (!ready || disposed || running) return;
    running = true;
    try {
      while (!disposed) {
        const target = { ...desired };
        if (target.open !== observed.open) {
          if (target.open) await commands.present(target.index);
          else await commands.dismiss();
          observed = target;
        } else if (target.open && target.index !== observed.index) {
          expectedDetentEvent = target.index;
          await commands.resize(target.index);
          observed = target;
        } else break;
      }
    } catch (error) {
      if (!disposed) console.warn("[rn-ui-kit] TrueSheet command failed", error);
    } finally {
      running = false;
    }
  };
  return {
    update(open: boolean, index: number) {
      desired = { open, index };
      void pump();
    },
    didPresent(index: number) {
      ready = true;
      observed = { open: true, index };
      // Initial auto-presentation may complete after open/position already changed.
      const currentPosition = desired.open && desired.index === index;
      if (!running) void pump();
      return currentPosition;
    },
    didDetentChange(index: number) {
      // A resize promise resolves before its animation/event on Web. Ignore
      // an older completion while a newer controlled index is still pending.
      if (expectedDetentEvent != null) {
        if (expectedDetentEvent !== index) return false;
        expectedDetentEvent = null;
      }
      if (running && desired.index !== index) return false;
      observed.index = index;
      return true;
    },
    didDismiss() {
      observed.open = false;
      expectedDetentEvent = null;
      return !running || !desired.open;
    },
    activate() { disposed = false; },
    dispose() { disposed = true; },
  };
}

