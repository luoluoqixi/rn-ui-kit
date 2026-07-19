/**
 * 在 iOS pageSheet overlay 内打开 Tamagui modal Sheet 时登记锁计数。
 * 承载 pageSheet 的父级路由会直接订阅这个锁，避免内层 ScrollView/关闭动画手势穿透到 pageSheet。
 */
export declare function useLockPageSheetDismiss(active: boolean): void;
