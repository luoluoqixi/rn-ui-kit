import { createRef } from "react";
import { ScrollView, FlatList } from "react-native";
import { TrueSheet, type TrueSheetProps } from "@lodev09/react-native-true-sheet";
import { NativeSheet, NativeSheetStack, NativeSheetScrollContent, type NativeSheetProps } from "rn-ui-kit";
import type { UiPreferences } from "../../src/core/components/ui/utils/theme/settings";

const scrollRef = createRef<ScrollView>();
const listRef = createRef<FlatList<string>>();
const legacy: TrueSheetProps = {
  scrollable: true, anchor: "right", anchorOffset: 12,
  blurOptions: { intensity: 65, interaction: false },
  androidHideFriction: 2, androidSignificantVelocityThreshold: 10,
  disableStackingTranslation: true, children: null,
};
const modern: TrueSheetProps = { scrollableRef: scrollRef, placement: "trailing", children: null };
const list: TrueSheetProps = { scrollableRef: listRef, children: null };
const sheet: NativeSheetProps = { ...legacy, detents: ["auto", 0.8], onSnapPointChange: (index: number) => { void index; } };
const theme: Pick<UiPreferences["appearance"], "themeMode"> = { themeMode: "system" };
void theme;
export const contract = <>
  <TrueSheet {...modern} /><TrueSheet {...list} />
  <NativeSheet {...sheet}><NativeSheetScrollContent ref={scrollRef} bindToNativeSheet constrainToNativeSheetViewport={false}>{null}</NativeSheetScrollContent></NativeSheet>
  <NativeSheetStack open sheetProps={legacy}><NativeSheetStack.Screen name="index" component={() => null} /></NativeSheetStack>
</>;
