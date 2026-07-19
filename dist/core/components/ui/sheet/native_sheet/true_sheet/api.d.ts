/** 展示已挂载的 True Sheet（`name` 须与对应 `<TrueSheet name={...} />` 一致）。 */
export declare function presentTrueSheet(name: string, detentIndex?: number): Promise<void>;
/** 关闭指定名称的 True Sheet。 */
export declare function dismissTrueSheet(name: string): Promise<void>;
/** 将已展示的 True Sheet 切换到指定 detent 档位。 */
export declare function resizeTrueSheet(name: string, detentIndex: number): Promise<void>;
