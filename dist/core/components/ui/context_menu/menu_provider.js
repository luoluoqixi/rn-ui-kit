import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const MenuConfigContext = createContext({});
export function MenuProvider({ value, children, }) {
    return (_jsx(MenuConfigContext.Provider, { value: value, children: children }));
}
export function useMenuConfig() {
    return useContext(MenuConfigContext);
}
