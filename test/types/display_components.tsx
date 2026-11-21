import { createRef } from "react";
import type { Image, Text, View } from "react-native";
import { Alert } from "../../src/core/components/ui/alert";
import { Avatar } from "../../src/core/components/ui/avatar";
import { Badge } from "../../src/core/components/ui/badge";

// One public types.ts exposes real platform types without moduleSuffixes.
<Alert status="warning" title={({ status }) => status} description="Description" action="Retry"
  herouiNativeProps={{ ref: createRef<View>(), onLayout: event => void event.nativeEvent.layout }}
  herouiWebProps={{ ref: createRef<HTMLDivElement>(), onClick: event => void event.currentTarget }}
  titleProps={{ herouiNativeProps: { ref: createRef<Text>(), allowFontScaling: true }, herouiWebProps: { ref: createRef<HTMLParagraphElement>(), style: { fontSize: "1rem" } } }}
  descriptionProps={{ herouiNativeProps: { ref: createRef<Text>() }, herouiWebProps: { ref: createRef<HTMLSpanElement>() } }}
  indicator={null} />;
<Avatar src="https://example.com/avatar.jpg" size="lg" variant="soft" color="success" fallback={({ alt }) => alt}
  herouiNativeProps={{ ref: createRef<View>(), animation: "disable-all" }}
  herouiWebProps={{ ref: createRef<HTMLSpanElement>(), "aria-label": "Avatar" }}
  imageProps={{ herouiNativeProps: { ref: createRef<Image>(), source: 42, onError: event => void event.nativeEvent.error }, herouiWebProps: { ref: createRef<HTMLImageElement>(), onLoadingStatusChange: status => void status } }}
  fallbackProps={{ herouiNativeProps: { textProps: { allowFontScaling: true, style: { fontFamily: "System" } } }, herouiWebProps: { ref: createRef<HTMLSpanElement>(), delayMs: 100 } }} />;
<Badge size="sm" variant="soft" color="warning" label={({ color, size }) => color + size}
  herouiNativeProps={{ ref: createRef<View>(), onPress: event => void event.nativeEvent }}
  herouiWebProps={{ ref: createRef<HTMLSpanElement>(), onClick: event => void event.currentTarget }}
  labelProps={{ herouiNativeProps: { allowFontScaling: true }, herouiWebProps: { ref: createRef<HTMLSpanElement>() } }}
  startContent={0} endContent="End" />;

// @ts-expect-error Alert has no artificial size API.
<Alert size="sm" />;
// @ts-expect-error Semantic status replaces the RNR destructive variant.
<Alert variant="destructive" />;
// @ts-expect-error Public API is a single entry.
<Alert.Title>Title</Alert.Title>;
// @ts-expect-error No old RNR size enum.
<Avatar size="2xl" />;
// @ts-expect-error Shared src owns the image URL.
<Avatar imageProps={{ herouiWebProps: { src: "bypass" } }} />;
// @ts-expect-error Native image refs cannot be DOM refs.
<Avatar imageProps={{ herouiNativeProps: { ref: createRef<HTMLImageElement>() } }} />;
// @ts-expect-error No invented system-native implementation.
<Avatar native />;
// @ts-expect-error Use HeroUI Chip variants.
<Badge variant="outline" />;
// @ts-expect-error Shared variant cannot be overridden inside platform props.
<Badge herouiNativeProps={{ variant: "soft" }} />;
// @ts-expect-error Managed label structure cannot be bypassed through platform children.
<Badge herouiWebProps={{ children: "bypass" }} />;
// @ts-expect-error Root Web ref must be a span.
<Badge herouiWebProps={{ ref: createRef<Text>() }} />;
