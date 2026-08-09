/**
 * 将 Tamagui / CSS 颜色值规范化为 SwiftUI `tint(...)` 更稳定可识别的 hex 字符串。
 * 对于已是命名色等无法解析的字符串，保留原值回退。
 */
export declare function toSwiftUIHexColor(value: unknown): string | undefined;
