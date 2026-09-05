import { type SharedValue } from "react-native-reanimated";
import type { KeyboardHiddenConfirmation, KeyboardVisibilityPhase } from "./use_keyboard_visibility";
export type KeyboardAvoidanceOptions = {
    /** 键盘确认隐藏后的收尾规则。 */
    hiddenConfirmation?: KeyboardHiddenConfirmation;
    /** 经处理后的键盘生命周期发生变化时调用。 */
    onPhaseChange?: (phase: KeyboardVisibilityPhase) => void;
};
export type KeyboardAvoidance = {
    /** 已处理导航交互返回与隐藏确认后的稳定键盘高度。 */
    height: SharedValue<number>;
    /** 是否正在确认键盘隐藏。 */
    isHiddenConfirmationActive: SharedValue<boolean>;
    /** 键盘是否已显示在界面上。 */
    isVisible: SharedValue<boolean>;
    /** 键盘是否处于完全显示的稳定阶段。 */
    isFullyDisplayed: SharedValue<boolean>;
    /** 经处理后的完整键盘生命周期。 */
    phase: SharedValue<KeyboardVisibilityPhase>;
    /** 确认隐藏后的最终高度。 */
    hiddenFinalHeight: number;
};
/**
 * 返回可直接用于底部浮层位移的稳定键盘高度。
 *
 * iOS 交互式返回会临时移动键盘；本 Hook 会在手势期间冻结高度，取消返回后等键盘
 * 回到 OPEN 状态才继续跟随，避免工具栏在开始或取消手势的瞬间跳动。
 */
export declare function useKeyboardAvoidance(options?: KeyboardAvoidanceOptions): KeyboardAvoidance;
