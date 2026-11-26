import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const MenuConfigContext = createContext({});
export function MenuProvider({ value, children, }) {
    return (_jsx(MenuConfigContext.Provider, { value: value, children: children }));
}
export function useMenuConfig() {
    return useContext(MenuConfigContext);
}
/** 显式关闭始终优先；无适配器时继续回落到原有 HeroUI 渲染。 */
export function resolveMenuAdapter(config, local) {
    if (local === false)
        return undefined;
    return (local ?? config.menuAdapter) || undefined;
}
