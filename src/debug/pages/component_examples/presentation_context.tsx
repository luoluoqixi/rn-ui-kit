import { type ReactNode, createContext, useContext } from "react";

const ComponentExampleEmbeddedContext = createContext(false);

/** 标记示例是否作为总览页面中的内嵌内容渲染。 */
export function ComponentExampleEmbeddedProvider({ children }: { children: ReactNode }) {
  return (
    <ComponentExampleEmbeddedContext.Provider value>
      {children}
    </ComponentExampleEmbeddedContext.Provider>
  );
}

export function useIsComponentExampleEmbedded() {
  return useContext(ComponentExampleEmbeddedContext);
}
