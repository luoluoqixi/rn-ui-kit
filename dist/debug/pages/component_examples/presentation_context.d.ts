import { type ReactNode } from "react";
/** 标记示例是否作为总览页面中的内嵌内容渲染。 */
export declare function ComponentExampleEmbeddedProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useIsComponentExampleEmbedded(): boolean;
