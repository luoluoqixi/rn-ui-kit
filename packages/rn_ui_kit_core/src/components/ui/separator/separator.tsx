import { Separator as TamaguiSeparator } from "tamagui";

import type { SeparatorProps } from "./types";

export function Separator(props: SeparatorProps) {
  if (!props.vertical) {
    return <TamaguiSeparator {...props} borderColor={props.borderColor ?? "$borderColor"} />;
  }

  const {
    borderColor = "$borderColor",
    borderRightWidth,
    height,
    maxH,
    maxW,
    width,
    x,
    ...restProps
  } = props;
  const lineWidth = 1;

  return (
    <TamaguiSeparator
      {...restProps}
      borderColor={borderColor}
      borderRightWidth={borderRightWidth ?? 1}
      height={height ?? "100%"}
      maxH={maxH ?? "100%"}
      maxW={maxW ?? lineWidth}
      width={width ?? lineWidth}
      x={x ?? 0}
    />
  );
}
