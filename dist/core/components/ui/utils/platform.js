import { Platform } from "react-native";
function getNavigatorPlatform() {
    if (typeof navigator === "undefined") {
        return "";
    }
    return `${navigator.platform ?? ""} ${navigator.userAgent ?? ""}`.toLowerCase();
}
export function os() {
    if (Platform.OS === "ios" || Platform.OS === "android" || Platform.OS === "web") {
        return Platform.OS;
    }
    const platform = getNavigatorPlatform();
    if (platform.includes("win")) {
        return "windows";
    }
    if (platform.includes("mac")) {
        return "macos";
    }
    if (platform.includes("linux")) {
        return "linux";
    }
    return "unknown";
}
export function isWeb() {
    return Platform.OS === "web";
}
export function isMobile() {
    return Platform.OS === "ios" || Platform.OS === "android";
}
export function isDesktop() {
    const currentOs = os();
    return currentOs === "windows" || currentOs === "macos" || currentOs === "linux";
}
export function isTauri() {
    if (typeof window === "undefined") {
        return false;
    }
    const candidate = window;
    return candidate.__TAURI__ != null || candidate.__TAURI_INTERNALS__ != null;
}
export function iosMajorVersion() {
    if (Platform.OS !== "ios") {
        return null;
    }
    const version = Platform.Version;
    if (typeof version === "number") {
        return Math.floor(version);
    }
    if (typeof version === "string") {
        const major = Number.parseInt(version.split(".")[0] ?? "", 10);
        return Number.isFinite(major) ? major : null;
    }
    return null;
}
export function isIos26Plus() {
    const major = iosMajorVersion();
    return major != null && major >= 26;
}
export function isIos15() {
    const major = iosMajorVersion();
    return major != null && major <= 15;
}
export function isLegacyCompactIphone() {
    if (Platform.OS !== "ios") {
        return false;
    }
    return false;
}
export function supportsImpactHaptics() {
    return Platform.OS === "ios" || Platform.OS === "android";
}
