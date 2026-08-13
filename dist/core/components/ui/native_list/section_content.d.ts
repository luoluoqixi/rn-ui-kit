import type { ComponentType, ReactNode } from "react";
export type NativeListSectionContent = ReactNode | ComponentType;
/** 将 Section 的函数内容作为组件渲染，确保其内部可以安全使用 React Hooks。 */
export declare function renderNativeListSectionContent(content: NativeListSectionContent): ReactNode;
