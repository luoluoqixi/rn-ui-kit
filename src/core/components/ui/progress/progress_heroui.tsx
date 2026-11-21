import { ProgressBar } from "@heroui/react/progress-bar";
import { Label } from "@heroui/react/label";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { hasSlotContent } from "../utils/slot_content";
import { resolveProgress } from "./progress_state";
import type { ProgressProps } from "./types";
export function ProgressHeroUI(props: ProgressProps) {
  const { min, max, current, isIndeterminate, valueText } = resolveProgress(props);
  const { label, labelProps, valueLabelProps, trackProps, indicatorProps } = props;
  const labelFont = StyleSheet.flatten(useDefaultTextStyle(undefined, labelProps?.className));
  const outputFont = StyleSheet.flatten(useDefaultTextStyle(undefined, valueLabelProps?.className));
  const hasLabel = hasSlotContent(label);
  return <ProgressBar aria-label={props.accessibilityLabel ?? (hasLabel ? undefined : "进度")}
    {...props.herouiWebProps} value={current} minValue={min} maxValue={max} isIndeterminate={isIndeterminate}
    valueLabel={valueText} formatOptions={props.formatOptions} size={props.size} color={props.color} className={props.className}>
    {hasLabel && <Label {...labelProps?.herouiWebProps} className={labelProps?.className}
      style={{ fontFamily: labelFont?.fontFamily, ...labelProps?.herouiWebProps?.style }}>{label}</Label>}
    {props.showValueLabel && valueText != null && <ProgressBar.Output {...valueLabelProps?.herouiWebProps} className={valueLabelProps?.className}
      style={{ fontFamily: outputFont?.fontFamily, ...valueLabelProps?.herouiWebProps?.style }}>{valueText}</ProgressBar.Output>}
    <ProgressBar.Track {...trackProps?.herouiWebProps} className={trackProps?.className}>
      <ProgressBar.Fill {...indicatorProps?.herouiWebProps} className={indicatorProps?.className} />
    </ProgressBar.Track>
  </ProgressBar>;
}
