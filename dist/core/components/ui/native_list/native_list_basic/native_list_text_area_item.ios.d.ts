import * as React from "react";
import type { NativeListTextAreaItemProps } from "../types";
/** Basic 列表的 iOS 多行输入行，使用 UIKit TextInput 而非跨平台 Textarea 封装。 */
export declare function NativeListTextAreaItem({ textAreaProps, ...itemProps }: NativeListTextAreaItemProps): React.JSX.Element;
