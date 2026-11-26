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
export type ToastRecord = {
    id: string | number;
    token: string;
    viewport: string;
    payload: ToastPayload;
};
export type ToastCloseReason = "dismiss" | "auto" | "unmount" | "replace";
export type ToastPort = {
    platform: "web" | "native";
    show: (record: ToastRecord, closed: (reason?: ToastCloseReason) => void) => string;
    update: (handle: string, record: ToastRecord) => void;
    close: (handle: string) => void;
};
/** Caller IDs, queued commands and viewport routing do not depend on either HeroUI queue. */
export declare class ToastCommandBridge {
    private count;
    private entries;
    private ports;
    private listeners;
    subscribe: (listener: () => void) => () => void;
    get: (id: string | number) => ToastRecord | undefined;
    private notify;
    show(payload: ToastPayload): string | number;
    private finish;
    private attach;
    register(viewport: string | undefined, port: ToastPort): () => void;
    close(id?: string | number, reason?: ToastCloseReason): void;
    closeAll(): void;
}
export declare const toastBridge: ToastCommandBridge;
export declare function toastDuration(record: ToastRecord, fallback?: number, platform?: "web" | "native"): number;
export declare function toastVariant(kind: BasicToastKind): "default" | "accent" | "success" | "warning" | "danger";
