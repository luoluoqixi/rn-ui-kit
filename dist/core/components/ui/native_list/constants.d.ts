import { type TextStyle } from "react-native";
/** Basic NativeList 默认列表样式。 */
export declare const NATIVE_LIST_BASIC_DEFAULT_STYLE: "rounded";
/** Basic NativeList 样式相关默认配置；主题颜色仍由运行时主题决定。 */
export declare const NATIVE_LIST_BASIC_STYLE_DEFAULTS: {
    readonly borderRadius: 15;
    readonly borderWidth: number;
    readonly dividerPaddingLeft: 16;
    readonly dividerPaddingRight: 0;
    readonly dividerWidth: number;
    readonly sectionShadow: false;
    readonly showDivider: true;
};
/** Basic NativeList 主题分割线的默认透明度。 */
export declare const NATIVE_LIST_BASIC_DIVIDER_OPACITY = 0.3;
/** NativeList 右侧 Select/Dropdown trigger 的统一常态透明度。 */
export declare const NATIVE_LIST_TRAILING_TRIGGER_OPACITY = 1;
/** NativeList 右侧 Select/Dropdown trigger 使用的语义主题色键。 */
export declare const NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN: "primary";
/** NativeList 右侧 Select/Dropdown trigger 的统一常规字重。 */
export declare const NATIVE_LIST_TRAILING_TRIGGER_FONT_WEIGHT: TextStyle["fontWeight"];
/** NativeList 右侧 Select/Dropdown trigger 悬浮时的透明度。 */
export declare const NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY = 0.7;
/** NativeList 右侧 Select/Dropdown trigger 打开时的透明度。 */
export declare const NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY = 0.6;
/** NativeList 右侧 Select/Dropdown trigger 按下时的透明度，默认与打开状态一致。 */
export declare const NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY = 0.6;
/** NativeList 右侧 Select/Dropdown trigger 禁用时的透明度。 */
export declare const NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY = 0.5;
/** NativeList 所有禁用行的统一透明度。 */
export declare const NATIVE_LIST_DISABLED_OPACITY = 0.5;
/** NativeList 编辑态右侧值的透明度。 */
export declare const NATIVE_LIST_EDIT_VALUE_OPACITY = 0.5;
/** NativeList Select/Dropdown item 整行打开时的透明度，默认与 trigger 打开状态一致。 */
export declare const NATIVE_LIST_ITEM_OPEN_OPACITY = 0.6;
/** NativeList Select/Dropdown item 整行按下时的透明度，默认与 trigger 按下状态一致。 */
export declare const NATIVE_LIST_ITEM_PRESS_OPACITY = 0.6;
/** Basic NativeList Section 标题和 footer 的默认字体大小。 */
export declare const NATIVE_LIST_BASIC_SECTION_TEXT_FONT_SIZE = 13;
/** Basic NativeList Section 标题和 footer 的默认主题色键。 */
export declare const NATIVE_LIST_BASIC_SECTION_TEXT_COLOR_TOKEN: "mutedForeground";
