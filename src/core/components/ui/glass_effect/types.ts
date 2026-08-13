import type {
  GlassColorScheme,
  GlassContainerProps,
  GlassEffectStyleConfig,
  GlassStyle,
  GlassViewProps,
} from "expo-glass-effect";

export type GlassEffectKeyboardAvoidance =
  | boolean
  | {
      /** 是否启用键盘跟随。默认启用。 */
      enabled?: boolean;
      /** 在键盘顶部额外保留的距离，正值会继续向上移动。默认 0。 */
      offset?: number;
      /** 是否扣除底部安全区，适合已经按 safe-area 定位的底部工具栏。默认 true。 */
      subtractSafeAreaInset?: boolean;
    };

/** `expo-glass-effect` GlassView 的完整属性，包含任意 React Native children。 */
export type GlassEffectProps = GlassViewProps & {
  /** 让整个 GlassEffect 在 UI 线程逐帧跟随软键盘高度。 */
  keyboardAvoidance?: GlassEffectKeyboardAvoidance;
};

/** `expo-glass-effect` GlassContainer 的完整属性。 */
export type GlassEffectContainerProps = GlassContainerProps;

export type { GlassColorScheme, GlassEffectStyleConfig, GlassStyle };
