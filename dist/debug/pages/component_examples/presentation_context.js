import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const ComponentExampleEmbeddedContext = createContext(false);
/** 标记示例是否作为总览页面中的内嵌内容渲染。 */
export function ComponentExampleEmbeddedProvider({ children }) {
    return (_jsx(ComponentExampleEmbeddedContext.Provider, { value: true, children: children }));
}
export function useIsComponentExampleEmbedded() {
    return useContext(ComponentExampleEmbeddedContext);
}
