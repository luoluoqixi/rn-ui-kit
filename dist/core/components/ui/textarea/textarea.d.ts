import type { TextareaProps } from "./types";
declare function Textarea({ className, disabled, multiline, numberOfLines, // On web, numberOfLines also determines initial height. On native, it determines the maximum height.
placeholderClassName, size, unstyled, ...props }: TextareaProps): import("react").JSX.Element;
export { Textarea };
