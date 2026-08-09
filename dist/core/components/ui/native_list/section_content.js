import { jsx as _jsx } from "react/jsx-runtime";
/** 将 Section 的函数内容作为组件渲染，确保其内部可以安全使用 React Hooks。 */
export function renderNativeListSectionContent(content) {
    if (typeof content === "function") {
        const Component = content;
        return _jsx(Component, {});
    }
    return content;
}
