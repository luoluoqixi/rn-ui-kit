import { resolveRenderProp } from "../utils/render";
let basicToastRuntimeConfig = { basicHaptics: true, haptics: true };
export function configureBasicToastRuntime(config) {
    basicToastRuntimeConfig = { ...basicToastRuntimeConfig, ...config };
}
export function getBasicToastRuntimeConfig() {
    return basicToastRuntimeConfig;
}
export function resolveToastContent(value) {
    return resolveRenderProp(value, undefined);
}
export function resolveToastText(value) {
    const resolved = resolveToastContent(value);
    return typeof resolved === "string" || typeof resolved === "number" ? String(resolved) : undefined;
}
export function getToastMessage(options) {
    return resolveToastContent(options?.message ?? options?.description);
}
export function getToastMessageText(options) {
    return resolveToastText(options?.message ?? options?.description);
}
export function resolveBasicOptionContent(value) {
    return resolveRenderProp(value, undefined);
}
export function getToastId(id, next) {
    return id ?? `toast-${next()}`;
}
export function getBasicOptions(options) {
    if (options == null)
        return {};
    const { message, description, native, id, variant, viewportName, toasterId, preset, haptic, shouldDismissByTap, from, layout, icon, basicHaptics, haptics, customToastViewProps, action, cancel, jsx, sonnerOptions, sonnerNativeOptions, burntOptions, ...basic } = options;
    void message;
    void description;
    void native;
    void id;
    void variant;
    void viewportName;
    void toasterId;
    void preset;
    void haptic;
    void shouldDismissByTap;
    void from;
    void layout;
    void icon;
    void basicHaptics;
    void haptics;
    void customToastViewProps;
    void jsx;
    void sonnerOptions;
    void sonnerNativeOptions;
    void burntOptions;
    const basicOptions = basic;
    if ("action" in options)
        basicOptions.action = resolveBasicOptionContent(action);
    if ("cancel" in options)
        basicOptions.cancel = resolveBasicOptionContent(cancel);
    return basicOptions;
}
export function BasicToasterFallback(_props) {
    return null;
}
