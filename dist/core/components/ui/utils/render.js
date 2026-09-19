export function resolveRenderProp(value, context) {
    // RenderProp 回调接收调用方提供的上下文；如果回调内部需要 Hook，
    // 应由调用方传入包裹该 Hook 的 React 元素，而不是直接传组件函数。
    return typeof value === "function" ? value(context) : value;
}
