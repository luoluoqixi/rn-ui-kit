import { createContextScope } from "@tamagui/create-context";
import { SHEET_NAME } from "./constants";
export const [createSheetContext, createSheetScope] = createContextScope(SHEET_NAME);
export const [SheetProvider, useSheetContext] = createSheetContext(SHEET_NAME, {});
