import type { ReactElement, ReactNode } from "react";
import type { ToastShowOptions } from "./types";
import type { BasicToastKind } from "./toast_basic_shared";

export type ToastPayload = {
  title?: ReactNode;
  description?: ReactNode;
  kind: BasicToastKind;
  options: ToastShowOptions;
  custom?: (id: string | number) => ReactElement;
};
export type ToastRecord = { id: string | number; token: string; viewport: string; payload: ToastPayload };
export type ToastCloseReason = "dismiss" | "auto" | "unmount" | "replace";
export type ToastPort = {
  platform: "web" | "native";
  show: (record: ToastRecord, closed: (reason?: ToastCloseReason) => void) => string;
  update: (handle: string, record: ToastRecord) => void;
  close: (handle: string) => void;
};
type Entry = { record: ToastRecord; handle?: string; port?: ToastPort; finished?: boolean };

/** Caller IDs, queued commands and viewport routing do not depend on either HeroUI queue. */
export class ToastCommandBridge {
  private count = 0;
  private entries = new Map<string | number, Entry>();
  private ports = new Map<string, ToastPort>();
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  get = (id: string | number) => this.entries.get(id)?.record;
  private notify() { this.listeners.forEach(listener => listener()); }

  show(payload: ToastPayload) {
    const id = payload.options.id ?? "toast-" + ++this.count;
    const viewport = payload.options.toasterId ?? payload.options.viewportName ?? "default";
    let entry = this.entries.get(id);
    if (entry && entry.record.viewport !== viewport) {
      this.close(id, "replace");
      entry = undefined;
    }
    const record: ToastRecord = { id, viewport, payload, token: entry?.record.token ?? "heroui-toast-" + ++this.count };
    if (entry) {
      entry.record = record;
      this.notify();
      if (entry.handle != null && entry.port) entry.port.update(entry.handle, record);
    } else {
      entry = { record };
      this.entries.set(id, entry);
      const port = this.ports.get(viewport);
      if (port) this.attach(entry, port);
      this.notify();
    }
    return id;
  }

  private finish(entry: Entry, reason: ToastCloseReason) {
    if (entry.finished) return;
    entry.finished = true;
    // Remove before notifying/calling user callbacks: the same ID may be reused immediately.
    if (this.entries.get(entry.record.id) === entry) this.entries.delete(entry.record.id);
    this.notify();
    if (reason === "unmount" || reason === "replace") return;
    const { id, payload: { title, description, kind, options } } = entry.record;
    const callback = reason === "auto" ? "onAutoClose" : "onDismiss";
    if (entry.port?.platform === "web") options.sonnerOptions?.[callback]?.({ id, title, description, type: kind });
    else if (entry.port?.platform === "native") options.sonnerNativeOptions?.[callback]?.(id);
  }

  private attach(entry: Entry, port: ToastPort) {
    entry.port = port;
    entry.handle = port.show(entry.record, reason => this.finish(entry, reason ?? "dismiss"));
  }

  register(viewport: string | undefined, port: ToastPort) {
    const key = viewport ?? "default";
    if (this.ports.has(key)) throw new Error("Duplicate Toast viewport: " + key);
    this.ports.set(key, port);
    for (const entry of [...this.entries.values()]) if (entry.record.viewport === key) this.attach(entry, port);
    return () => {
      if (this.ports.get(key) !== port) return;
      this.ports.delete(key);
      for (const [id, entry] of [...this.entries]) if (entry.port === port) this.close(id, "unmount");
    };
  }

  close(id?: string | number, reason: ToastCloseReason = "dismiss") {
    if (id === undefined) { this.closeAll(); return; }
    const entry = this.entries.get(id);
    if (!entry) return;
    this.finish(entry, reason);
    if (entry.port && entry.handle != null) entry.port.close(entry.handle);
  }
  closeAll() { for (const id of [...this.entries.keys()]) this.close(id); }
}

export const toastBridge = new ToastCommandBridge();
export function toastDuration(record: ToastRecord, fallback = 5000, platform: "web" | "native" = "web") {
  const { options, kind } = record.payload;
  const duration = options.duration ?? (platform === "web" ? options.sonnerOptions?.duration : options.sonnerNativeOptions?.duration);
  if (duration != null && !Number.isNaN(duration)) return duration;
  return kind === "loading" ? Infinity : fallback;
}
export function toastVariant(kind: BasicToastKind) {
  return kind === "error" ? "danger" : kind === "info" ? "accent" : kind === "success" || kind === "warning" ? kind : "default";
}
