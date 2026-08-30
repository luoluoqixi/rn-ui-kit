import * as ProgressPrimitive from "@rn-primitives/progress";
declare function Progress({ className, value, indicatorClassName, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
}): import("react").JSX.Element;
export { Progress };
