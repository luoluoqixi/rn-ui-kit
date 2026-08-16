import { jsx as _jsx } from "react/jsx-runtime";
import { Progress as TamaguiProgress } from "tamagui";
function ProgressRoot(props) {
    const { children, indicatorProps, ...rootProps } = props;
    return (_jsx(TamaguiProgress, { ...rootProps, children: children ?? _jsx(ProgressIndicator, { ...indicatorProps }) }));
}
function ProgressIndicator(props) {
    return _jsx(TamaguiProgress.Indicator, { ...props });
}
export const Progress = Object.assign(ProgressRoot, {
    Indicator: ProgressIndicator,
});
