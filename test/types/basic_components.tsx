import { createRef } from "react";
import type { Text as RNText, View } from "react-native";
import { Text } from "../../src/core/components/ui/text";
import { Progress } from "../../src/core/components/ui/progress";
import { Spinner } from "../../src/core/components/ui/spinner";
import { Skeleton } from "../../src/core/components/ui/skeleton";
import { Separator } from "../../src/core/components/ui/separator";
import { Label } from "../../src/core/components/ui/label";

<Text type="h6" color="muted" align="end" weight="semibold" truncate
  herouiNativeProps={{ ref: createRef<RNText>(), onPress: event => void event.nativeEvent.pageX }}
  herouiWebProps={{ ref: createRef<HTMLElement>(), onClick: event => void event.currentTarget.tagName }} />;
<Text style={[{ fontSize: 18 }, { lineHeight: 26 }]} numberOfLines={2} />;
<Progress value={6} minValue={0} maxValue={8} label="Sync" showValueLabel
  herouiNativeProps={{ ref: createRef<View>() }} herouiWebProps={{ ref: createRef<HTMLDivElement>() }}
  labelProps={{ herouiNativeProps: { ref: createRef<RNText>() }, herouiWebProps: { ref: createRef<HTMLLabelElement>() } }}
  indicatorProps={{ herouiNativeProps: { ref: createRef<View>() }, herouiWebProps: { ref: createRef<HTMLDivElement>() } }} />;
<Spinner color="current" size={18} indicatorProps={{ herouiNativeProps: { animation: { rotation: { speed: 0.7 } } } }}
  herouiNativeProps={{ ref: createRef<View>() }} herouiWebProps={{ ref: createRef<HTMLSpanElement>() }} />;
<Separator variant="thick" thickness={4} isDecorative herouiWebProps={{ variant: "secondary" }} />;
<Skeleton variant="pulse" isLoading={false}><Text>Done</Text></Skeleton>;
<Label htmlFor="name" nativeID="label" controlRef={{ current: { focus() {} } }} isRequired isInvalid
  textProps={{ className: "text-sm", herouiNativeProps: { ref: createRef<RNText>() } }}>Name</Label>;

// @ts-expect-error Typography semantic types replace the RNR variant API.
<Text variant="h1" />;
// @ts-expect-error Web refs cannot refer to React Native instances.
<Text herouiWebProps={{ ref: createRef<RNText>() }} />;
// @ts-expect-error Native refs cannot refer to DOM instances.
<Text herouiNativeProps={{ ref: createRef<HTMLSpanElement>() }} />;
// @ts-expect-error The public range cannot be overridden via platform props.
<Progress herouiWebProps={{ maxValue: 10 }} />;
// @ts-expect-error Native progress root refs refer to Views.
<Progress herouiNativeProps={{ ref: createRef<HTMLDivElement>() }} />;
// @ts-expect-error Spinner only retains HeroUI presets or a numeric size.
<Spinner size="2xl" />;
// @ts-expect-error Loading is controlled by the public isLoading prop.
<Spinner herouiNativeProps={{ isLoading: false }} />;
// @ts-expect-error Native indicator events do not accept DOM refs.
<Spinner indicatorProps={{ herouiNativeProps: { ref: createRef<HTMLDivElement>() } }} />;
// @ts-expect-error Web color variants are not shared thickness variants.
<Separator variant="secondary" />;
// @ts-expect-error The common variant owns Skeleton animation selection.
<Skeleton herouiWebProps={{ animationType: "pulse" }} />;
// @ts-expect-error Root disabled state cannot be bypassed through the Native extension.
<Label herouiNativeProps={{ isDisabled: true }} />;
// @ts-expect-error Native text slots cannot use a DOM ref.
<Label textProps={{ herouiNativeProps: { ref: createRef<HTMLLabelElement>() } }} />;
