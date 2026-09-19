/**
 * TrueSheet 专属 overlay host 命名空间。
 *
 * Toast、Dialog 等布局补偿仅应作用在 TrueSheet；所有由 NativeSheet 创建的 host
 * 都通过此命名空间注册，避免 app 或 debug 页面自行命名时漏掉补偿。
 */
export declare const TRUE_SHEET_OVERLAY_PORTAL_HOST_PREFIX = "rn-ui-kit:true-sheet:";
export declare function createTrueSheetOverlayPortalHostName(name: string): string;
export declare function isTrueSheetOverlayPortalHostName(hostName: string): boolean;
