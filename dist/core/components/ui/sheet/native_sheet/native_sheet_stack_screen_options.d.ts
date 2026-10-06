import type { ResolvedColorScheme } from "../../utils/theme";
import type { NativeSheetStackScreenOptions } from "./types";
/** NativeSheetStack 的统一 screenOptions：iOS 走 Native Stack，其它平台走 JS Stack。 */
export declare function nativeSheetStackScreenOptions(colorScheme: ResolvedColorScheme, backgroundColor: string | undefined, tintColor: string, titleColor: string): NativeSheetStackScreenOptions;
