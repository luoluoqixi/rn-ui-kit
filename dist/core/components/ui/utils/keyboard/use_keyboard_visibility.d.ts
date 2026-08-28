import { type SharedValue } from "react-native-reanimated";
import { type KeyboardAnimation } from "./use_keyboard_animation";
/** 确认软键盘已完全收起的规则。 */
export type KeyboardHiddenConfirmation = {
    /** 认为键盘已隐藏的最大高度。默认 20。 */
    heightThreshold?: number;
    /** 键盘高度满足阈值后的确认帧数。默认 1。 */
    consecutiveFrames?: number;
    /** 确认隐藏后，避让高度的最终值；仅负值有效，默认 0。 */
    finalHeight?: number;
};
export type KeyboardVisibilityOptions = {
    /** 键盘隐藏的确认规则。交互式返回期间会自动暂停确认。 */
    hiddenConfirmation?: KeyboardHiddenConfirmation;
    /** 经处理后的键盘生命周期发生变化时调用。 */
    onPhaseChange?: (phase: KeyboardVisibilityPhase) => void;
    /** 导航交互返回开始或结束时调用。 */
    onNavigationGestureChange?: (active: boolean) => void;
};
/** 经导航手势与隐藏确认处理后的键盘生命周期。 */
export type KeyboardVisibilityPhase = "hidden" | "opening" | "visible" | "hiding";
export type KeyboardVisibility = KeyboardAnimation & {
    /**
     * 经处理后的完整键盘生命周期。
     *
     * `hiding` 仅在非返回手势且高度达到隐藏阈值后进入；持续配置的确认帧数后才会
     * 切换至 `hidden`。
    */
    phase: SharedValue<KeyboardVisibilityPhase>;
    /** 键盘是否已显示在界面上，`opening`、`visible`、`hiding` 时均为 true。 */
    isVisible: SharedValue<boolean>;
    /** 键盘是否处于完全显示的稳定阶段，仅 `phase === "visible"` 时为 true。 */
    isFullyDisplayed: SharedValue<boolean>;
    /** 当前是否正处于导航交互返回。 */
    isNavigationGestureActive: SharedValue<boolean>;
    /** `keyboardWillHide` 后正在确认键盘是否真的关闭。 */
    isHiddenConfirmationActive: SharedValue<boolean>;
    /** 隐藏确认完成后供避让布局使用的最终高度。 */
    hiddenFinalHeight: number;
    /** 隐藏确认时长。 */
    hiddenConfirmationDuration: number;
    /** 隐藏确认高度阈值。 */
    hiddenHeightThreshold: number;
};
/**
 * 提供稳定的键盘显示/隐藏通知。
 *
 * `hidden` 阶段不会直接相信 `keyboardWillHide`：它会等待键盘高度连续满足配置阈值，
 * 并在 iOS 交互式返回期间暂停确认，避免把页面返回动画误判为键盘关闭。
 */
export declare function useKeyboardVisibility(options?: KeyboardVisibilityOptions): KeyboardVisibility;
