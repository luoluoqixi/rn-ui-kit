import type { ReactNode } from "react";
export type RenderProp<Context = unknown> = ReactNode | ((context: Context) => ReactNode);
export declare function resolveRenderProp<Context>(value: RenderProp<Context> | undefined, context: Context): ReactNode | undefined;
