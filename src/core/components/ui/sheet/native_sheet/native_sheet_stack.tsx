import type { NativeSheetStackProps, NativeSheetStackScreenProps } from "./types";

/** Common-platform placeholder. Metro selects `.native.tsx` or `.web.tsx`. */
function NativeSheetStackFallback(_props: NativeSheetStackProps): null {
  return null;
}

function NativeSheetStackScreenFallback(_props: NativeSheetStackScreenProps): null {
  return null;
}

export const NativeSheetStack = Object.assign(NativeSheetStackFallback, {
  Screen: NativeSheetStackScreenFallback,
});
