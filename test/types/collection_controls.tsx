import { createRef } from "react";
import type { TextInput, View, ScrollView as RNScrollView } from "react-native";
import { CloseButton } from "../../src/core/components/ui/close_button";
import { Toggle } from "../../src/core/components/ui/toggle";
import { ToggleGroup } from "../../src/core/components/ui/toggle_group";
import { TagGroup } from "../../src/core/components/ui/tag_group";
import { Surface } from "../../src/core/components/ui/surface";
import { ScrollShadow } from "../../src/core/components/ui/scroll_shadow";
import { SearchField } from "../../src/core/components/ui/search_field";
import { PressableFeedback } from "../../src/core/components/ui/pressable_feedback";
const button = createRef<HTMLButtonElement>();
const input = createRef<HTMLInputElement>();
const nativeInput = createRef<TextInput>();
const view = createRef<View>();
const scroll = createRef<RNScrollView>();
<CloseButton herouiWebProps={{ ref: button, onKeyDown: e => e.currentTarget.focus() }} />;
<Toggle title={({ isSelected }) => isSelected ? "开" : "关"} size="sm" variant="ghost"
  herouiNativeProps={{ feedbackVariant: "scale", animation: { scale: { value: 0.97 } } }}
  herouiWebProps={{ ref: button, style: state => ({ opacity: state.isSelected ? 1 : 0.9 }) }} />;
<ToggleGroup accessibilityLabel="格式" items={[{ id: "a", title: "A" }]} selectedKeys={new Set(["a"])}
  onSelectionChange={keys => keys.has("a")} selectionMode="multiple" isDetached />;
<Toggle isScaleDisabled title="关闭缩放" />;
<ToggleGroup accessibilityLabel="间距与缩放" gap={6} isScaleDisabled={false}
  items={[{ id: "a", title: "A", isScaleDisabled: true }]} />;
<TagGroup label="分类" items={[{ id: "news", title: "新闻" }]} onRemove={keys => keys.delete("news")}
  herouiNativeProps={{ ref: view }} herouiWebProps={{ ref: createRef<HTMLDivElement>() }} />;
<Surface variant="tertiary" herouiNativeProps={{ ref: view }} herouiWebProps={{ ref: createRef<HTMLDivElement>() }} />;
<ScrollShadow nativeScrollProps={{ ref: scroll, nestedScrollEnabled: true }} onNativeScroll={e => e.contentOffset.y}
  herouiWebProps={{ ref: createRef<HTMLDivElement>(), onScroll: e => e.currentTarget.scrollTop }}><Surface /></ScrollShadow>;
<SearchField label="搜索" inputProps={{ herouiNativeProps: { ref: nativeInput, onFocus: e => e.nativeEvent.target }, herouiWebProps: { ref: input, onFocus: e => e.currentTarget.select() } }}
  herouiWebProps={{ style: state => ({ opacity: state.isDisabled ? 0.5 : 1 }) }} />;
<PressableFeedback feedback="ripple" herouiWebProps={{ ref: button, onKeyDown: e => e.currentTarget.focus() }} />;
// @ts-expect-error CloseButton intentionally has no system-native branch.
<CloseButton native />;
// @ts-expect-error RNR pressed API is removed.
<Toggle pressed />;
// @ts-expect-error Only HeroUI sizes remain.
<Toggle size="xl" />;
// @ts-expect-error Portable gap uses logical pixels, not CSS lengths.
<ToggleGroup accessibilityLabel="group" gap="8px" items={[]} />;
// @ts-expect-error Scale opt-out is a boolean.
<Toggle isScaleDisabled="true" />;
// @ts-expect-error The group owns selection; item callbacks cannot replace it.
<ToggleGroup accessibilityLabel="group" items={[{ id: "a", onSelectedChange() {} }]} />;
// @ts-expect-error Native TextInput refs are not DOM input refs.
<SearchField inputProps={{ herouiWebProps: { ref: nativeInput } }} />;
// @ts-expect-error Input state belongs to SearchField.
<SearchField inputProps={{ herouiNativeProps: { value: "bypass" } }} />;
// @ts-expect-error Platform root props cannot replace Toggle selection state.
<Toggle herouiWebProps={{ isSelected: true }} />;
// @ts-expect-error ScrollShadow cannot enable a second custom scroll container.
<ScrollShadow nativeScrollProps={{ customScrollbar: true }}><Surface /></ScrollShadow>;
// @ts-expect-error TagGroup item ids are portable string keys.
<TagGroup items={[{ id: 1, title: "A" }]} />;
